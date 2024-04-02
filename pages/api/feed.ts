import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import { publicacaoModel } from "@/models/publicacaoModel";
import { seguidorModel } from "@/models/seguidorModel";

const feedEndopoint = async(req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) => {
  try {
    if(req.method === 'GET'){
        if(req?.query?.id){
          const usuario = await UsuarioModel.findById(req?.query?.id);
          if(!usuario){
            return res.status(400).json({erro: 'usuario não encontrado'});
          }

          const publicacoes = await publicacaoModel
              .find({idUsuario : usuario._id})
              .sort({data : -1});
              
              return res.status(200).json({publicacoes});
        }
    }else{
      const {userId} = req.query;
      const usuarioLogado = await UsuarioModel.findById(userId);
      if(!usuarioLogado){
        return res.status(400).json({erro: 'Usuário não encontrado'});
      };

      const seguidores = await seguidorModel.find({usuarioId : usuarioLogado._id});
      const seguidoresIds = seguidores.map(s => s.usuarioSeguidoId)

      const publicacoes = await publicacaoModel.find({
        $or : [
          {idUsuario : usuarioLogado._id},
          {idUsuario : seguidoresIds}
          
        ]
      })
      .sort({data : -1});

      const result = [];
      for (const publicacao of publicacoes){
        const usuarioDaPublicacao = await UsuarioModel.findById(publicacao.idUsuario);
        if(usuarioDaPublicacao){
          const final = {...publicacao._doc, usuario : {
            nome: usuarioDaPublicacao.nome,
            avatar : usuarioDaPublicacao.avatar
          }};
          result.push(final);

        }
      }

      return res.status(200).json(result);
    }


    return res.status(405).json({erro: 'método inválido'})
  } catch (e) { 
    console.log(e);
  }
  return res.status(400).json({erro: 'Não foi possível obter feed'});
}

export default validarTokenJWT(conectarMongoDB(feedEndopoint));
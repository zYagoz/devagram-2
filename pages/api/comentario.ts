import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import { publicacaoModel } from "@/models/publicacaoModel";

const comentarioEndpoint = async (req : NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) =>{
  try {
    if(req.method === 'PUT'){
      const {userId, id} = req.query;
      const usuarioLogado = await UsuarioModel.findById(userId);
      if(!usuarioLogado){
        return res.status(400).json({erro: 'Usuário não encontrado'});
      }
      
      const publicacao = await publicacaoModel.findById(id);
      if(!publicacao){
        return res.status(400).json({erro: 'Publicação não encontrada'});
      }
      
      if(!req.body || !req.body.comentario 
        || req.body.comentario.length <2){
          return res.status(400).json({erro: 'conetário inválido'});
      }

      const comentario = {
        usuarioId : usuarioLogado._id,
        nome : usuarioLogado.nome,
        comentario : req.body.comentario
      };

      publicacao.comentario.push(comentario);
      await publicacaoModel.findByIdAndUpdate({_id : publicacao});
      return res.status(200).json({msg : 'Comentário adicionado'})


    }
    
    return res.status(405).json({erro: 'Método inválido'});
  } catch (e) {
    console.log(e);
    return res.status(500).json({erro: 'Ocorreu um erro ao adicionar comentário'})
    
  }
}
export default validarTokenJWT(conectarMongoDB(comentarioEndpoint));
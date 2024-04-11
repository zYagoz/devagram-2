import type { NextApiRequest, NextApiResponse } from "next";
import type {RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import { publicacaoModel } from "@/models/publicacaoModel";
import { politcaCors } from "@/middlewares/politicaCors";

const likeEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) =>{
try {
  if(req.method === 'PUT'){
    const {id} = req?.query;
    const publicacao = await publicacaoModel.findById(id);
    if(!publicacao){
      return res.status(400).json({erro: 'Públicação não encontrada'});
    }
    
    const {userId} = req?.query;
    const usuario = await UsuarioModel.findById(id)
    if(!usuario){
      return res.status(400).json({erro: 'usuário não encontrada'});
    }

    const indexDoUsuarioNoLike = publicacao.likes.findIndex((e: any) => e.toString() === usuario._id.toString());

    if(indexDoUsuarioNoLike != -1){
      publicacao.likes.splice(indexDoUsuarioNoLike, 1);
      await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao)
      return res.status(200).json({msg: 'Publicacao descurtida'})

    }else{
      publicacao.likes.push(usuario._id);
      await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
      return res.status(200).json({msg: 'Publicacao curtida'})
    }
  }
  return res.status(400).json({erro: 'Método inválido'});
  
  
} catch (e) {
  console.log(e);
  return res.status(500).json({erro: 'Não foi possível curtir/descutir'});
  
}
}

export default politcaCors(validarTokenJWT(conectarMongoDB(likeEndpoint)));



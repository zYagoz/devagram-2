import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import { seguidorModel } from "@/models/seguidorModel";

const endpointSeguir = async (req : NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) =>{
  try {
    if(req.method === 'PUT'){

      const {userId,id} = req?.query;

      const usuarioLogado = await UsuarioModel.findById(userId);
      if(!usuarioLogado){
        return res.status(400).json({erro: 'Usuário logado não encontrado'})
      }
      const usuarioASeguir = await UsuarioModel.findById(userId);
      if(!id){
        return res.status(400).json({erro: 'Usuário a ser seguido não encontrado'})
      }

      // Buscar se o EU LOGADO já sigo ou não esse usuário
      const jaSegueUsuario = await seguidorModel
        .find({usuarioId: usuarioLogado._id , usuarioSeguidoId: usuarioASeguir._id});
      
      // Verificar se já segue o usuário
      if(jaSegueUsuario && jaSegueUsuario.length >0){
        jaSegueUsuario.forEach(async(e : any) => await seguidorModel.findByIdAndDelete({_id: e._id}));
        
        usuarioLogado.seguindo--;
        await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado);
       
        usuarioASeguir.seguidores--;
        await UsuarioModel.findByIdAndUpdate({_id: usuarioASeguir._id }, usuarioASeguir)
        
        return res.status(200).json({msg : 'Deixou de seguir com sucesso'});
      }else{
        // caso não siga
        const seguidor = {
          usuarioId : usuarioLogado._id ,
          usuarioSeguidoId : usuarioASeguir._id

        };
        await seguidorModel.create(seguidor);
        
        // Adicionar seguindo no usuário logado
        usuarioLogado.seguindo++;
        await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado);
        
        // Adicionar um seguidor no usuário seguido
        usuarioASeguir.seguidores++;
        await UsuarioModel.findByIdAndUpdate({_id: usuarioASeguir._id }, usuarioASeguir)

        return res.status(200).json({msg : 'Usuário seguido com sucesso'});
      }


    }
    
    return res.status(405).json({erro: 'Método inválido'});
  } catch (e) {
    console.log(e);
    return res.status(500).json({erro: 'Não foi possível seguir/deseguir'});
    
  }
}

export default validarTokenJWT(conectarMongoDB(endpointSeguir));
import type { NextApiRequest, NextApiResponse } from "next";
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import { conectarMongoDB } from "@/middlewares/conectMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import usuário from "./usuário";
import { UsuarioModel } from "@/models/UsuarioModel";

const pesquisaEndpoint 
  = async(req : NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any[]>) =>{
    try {
      if(req.method === 'GET'){
        const {filtro} = req.query;

        if(req?.query.id){
          const usuarioEncontrado = await UsuarioModel.findById(req?.query?.id);
          if(!usuarioEncontrado){
            return res.status(400).json({erro: 'usuário não encontrado'})
          }
          return res.status(200).json(usuarioEncontrado)
            
        }else{
          if(!filtro || filtro?.length <2){
            return res.status(400).json({erro: 'Informe 2 caracteres para buscar'});
          }
  
          const usuarioEncontrados = await UsuarioModel.find({
            $or: [{nome: {$regex : filtro, $options : 'i'}}
            ,{email: {$regex : filtro, $options : 'i'}}]
          });
  
          return res.status(200).json(usuarioEncontrados)
        }
      }
      
    } catch (e) {
      console.log(e);
      return res.status(500).json({erro: 'Não foi possível buscar usuários'});
    }
  }

  export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint));
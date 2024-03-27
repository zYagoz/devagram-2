import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import type { NextApiRequest, NextApiResponse } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import {conectarMongoDB} from '../../middlewares/conectMongoDB'
import { UsuarioModel } from "@/models/UsuarioModel";
import nc from 'next-connect';
import {upload, uploadImageComisc} from '../../services/uploadImagemCosmic';


const handler = nc()
    .use(upload.single('file'))
    .put(async(req : any, res: NextApiResponse<RespostaPadraoMsg>) => {
        try{
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);

            if(!usuario){
                res.status(400).json({erro : 'usuario não autenticado'})
            }
            
            const {nome} = req.body;
            if(nome || nome.length >2){
                usuario.nome = nome;
            }
            
            const {file} = req;
            if(file && file.originalname){
                const image = await uploadImageComisc(req);
                if(image && image.media && image.media.url){
                    usuario.file = image.media.url;
                }
            }

            await UsuarioModel
                .findByIdAndUpdate({_id : usuario._id}, usuario);

            res.status(200).json({msg: 'Dados atualizados'})


        }catch(e){
            console.log(e)
            res.status(400).json({erro : 'não foi possível fazer atualizar o usuário'})
        }
    })
    .get(async (req : NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any> ) =>{
    
        try{
              //id do usuário
            const {userId} = req?.query;
            // buscar dados do usuário
            const usuario = await UsuarioModel.findById(userId);
            usuario.senha = null;
            return res.status(200).json({usuario});
        }catch(e){
            console.log(e);
        }
        return res.status(400).json({erro: 'Não foi possível obter os dados'})
      
    })

export const config = {
    api : {
        bodyParser : false
    }
}

export default validarTokenJWT(conectarMongoDB(handler));
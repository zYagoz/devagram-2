import type {NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg"; 
import nc from 'next-connect';
import { upload, uploadImageComisc } from '../../services/uploadImagemCosmic';
import {conectarMongoDB} from '../../middlewares/conectMongoDB';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import { publicacaoModel } from "../../models/publicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";
import { politcaCors } from "@/middlewares/politicaCors";

const handler = nc()
  .use(upload.single('file'))
  .post(async (req : any , res : NextApiResponse<RespostaPadraoMsg>) => {
    
    try{
      const {userId} = req.query;
      const usuario = await UsuarioModel.findById(userId);
      if(!usuario){
      return res.status(400).json({erro: 'Usuário inválidos'}) 
        }

      const {descricao, file} = req.body;
      
      if(!req || !req.body){
      return res.status(400).json({erro: 'Parametros inválidos'})
    }

    if(!descricao || descricao.length < 2) {
      return res.status(400).json({erro: 'Descrição inválida'})
    }

    if(!req.file || !req.file.originalname) {
      return res.status(400).json({erro: 'Imagem obrigatória'})
    }
    
    const image = await uploadImageComisc(req);
    const publicacao = {
      idUsuario : usuario._id,
      descricao,
      foto : image.media.url,
      data : new Date()
    }

    usuario.publicacoes++;
    await UsuarioModel.findByIdAndUpdate({_id: usuario._id}, usuario);

    await publicacaoModel.create(publicacao);

    return res.status(200).json({msg: 'Publicação criada com sucesso'})

    }catch(e){
      console.log(e);
      return res.status(400).json({erro: 'Erro ao cadastrar publicação'})
    }
    
  });

  export const config = {
    api: {
      bodyParser : false
    }
  }

  export default politcaCors(validarTokenJWT(conectarMongoDB(handler)));
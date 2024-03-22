import type { NextApiRequest, NextApiResponse } from "next";
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {CadastroRequisicao} from '../../types/CadastroRequisicao';
import {UsuarioModel} from '../../models/UsuarioModel';
import {conectarMongoDB} from '../../middlewares/conectMongoDB';
import md5 from 'md5';
import {upload, uploadImageComisc} from '../../services/uploadImagemCosmic';
import nc from 'next-connect';


const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) =>{
        const usuario = req.body as CadastroRequisicao;

        
        if(!usuario.nome || usuario.nome.length <2){
            return res.status(400).json({erro: 'Nome inválido'});
        }
            
        if(!usuario.email || usuario.email.length <5
            || !usuario.email.includes('@')
            || !usuario.email.includes('.')){
                return res.status(400).json({erro: 'Email inválido'});
                    
            }
            if(!usuario.senha || usuario.senha.length <4){
                return res.status(400).json({erro: 'Senha inválido'});
                    
            }
            
            // validar se o email já existe
            const usuarioJaCadastrado = await UsuarioModel.find({email : usuario.email});
            if(usuarioJaCadastrado && usuarioJaCadastrado.length > 0 ){
                return res.status(400).json({erro: 'Email já cadastrado'});
            }

            //enviar imagem do multer para o comisc
            const image = await uploadImageComisc(req);


            // salvar novo ususário
            const usuarioASerSalvo = {
                nome : usuario.nome,
                email: usuario.email,
                senha: md5(usuario.senha),
                avatar : image?.media?.url
            }
            await UsuarioModel.create(usuarioASerSalvo);
            return res.status(200).json({msg : 'Usuário Cadastrado'});

    }
)

export const confi = {
    api : {
        bodyParser : false
    }
}

export default conectarMongoDB(handler);
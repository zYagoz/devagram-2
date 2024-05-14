import { log } from "console";
import type { NextApiRequest, NextApiResponse } from "next";
import {conectarMongoDB} from '../../middlewares/conectMongoDB';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {LoginResposta} from '../../types/LoginResposta';
import md5 from 'md5';
import { UsuarioModel } from "../../models/UsuarioModel";
import jwt from 'jsonwebtoken';
import { politcaCors } from "@/middlewares/politicaCors";


const endpointLogin = async(
    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg | LoginResposta>
) => {

const MINHA_CHAVE_SWT = process.env.MINHA_CHAVE_SWT as string;
if(!MINHA_CHAVE_SWT){
    res.status(500).json({erro: 'ENV jwt não informada'});
}

    if(req.method === 'POST') {
        const {login, senha} = req.body;

        const usuarioEncontrado = await UsuarioModel.find({email: login, senha : md5(senha)});
        if(usuarioEncontrado && usuarioEncontrado.length > 0){
                const usuarioLogado = usuarioEncontrado[0]

                const token = jwt.sign({_id : usuarioLogado._id}, MINHA_CHAVE_SWT);

                return res.status(200).json({nome : usuarioLogado.nome, email : usuarioLogado.email, token});

            }
            return res.status(400).json({erro : 'Usuário/Senha inválido'})
    }    
    return res.status(405).json({erro : 'Método inválido'})
}

export default politcaCors(conectarMongoDB(endpointLogin));
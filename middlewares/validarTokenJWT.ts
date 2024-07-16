import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import {RespostaPadraoMsg} from '../types/RespostaPadraoMsg';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const validarTokenJWT = (handler : NextApiHandler) =>
   async (req : NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>)  => {
    

        try{
            const {MINHA_CHAVE_SWT} = process.env
    if(!MINHA_CHAVE_SWT){
        return res.status(500).json({erro : 'ENV de chave não informada' });
    }


    if(!req || req.headers){
        return res.status(401).json({erro : 'Permissão negada'});
    }
    
    if(req.method !== 'OPTIONS'){
        const authorization = req.headers['authorization'] as string;
        if(!authorization){
            return res.status(401).json({erro : 'Permissão negada'});
        }
        
        
        const token = authorization.substring(7);
        if(!token){
            return res.status(401).json({erro : 'Permissão negada'});
            
        }
        
        const decoded = await jwt.verify(token, MINHA_CHAVE_SWT) as JwtPayload;
        if(!decoded){
            return res.status(401).json({erro : 'Permissão negada'});
        }

        if(!req.query){
            req.query = {};
        }

        req.query.userId = decoded._id;
    }
            
        }catch(e){
            console.log(e)
            return res.status(401).json({erro : 'ENV de chave não informada' });

        }


    

    return handler(req, res);

   }

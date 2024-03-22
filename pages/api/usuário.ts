import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import type { NextApiRequest, NextApiResponse } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJWT'

const usuarioEndpoint = (req : NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) =>{
    return res.status(200).json({msg : 'usuário autenticado'})
}


export default validarTokenJWT(usuarioEndpoint);
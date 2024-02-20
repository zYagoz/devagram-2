import { log } from "console";
import type { NextApiRequest, NextApiResponse } from "next";

export default(
    req : NextApiRequest,
    res : NextApiResponse
) => {
    if(req.method === 'POST') {
        const {login, senha} = req.body;

        if(login === 'adim@admin.com' &&
            senha === 'admin@123'){
                return res.status(200).json({msg: 'Usuário Autenticado'})

            }
            return res.status(405).json({erro : 'Usuário/Senha inválido'})
    }    
    return res.status(405).json({erro : 'Método inválido'})
}
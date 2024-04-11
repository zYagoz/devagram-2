import type { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg';
import NextCors from "nextjs-cors";

export const politcaCors = (handler : NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) =>{
    try {
      await NextCors(req, res, {
        origin : '*',
        method: ['POST', 'PUT', 'GET'],
        optionSucessStatus : 200,
      });

      return handler(req, res);
    } catch (e) {
      console.log('Erro ao tratar a polítca de CORS:', e);
      res.status(500).json({erro: 'Erro ao tratar a polítca de CORS'})
      
      
    }
  }

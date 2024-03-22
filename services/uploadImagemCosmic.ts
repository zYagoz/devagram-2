import multer from 'multer';
import comiscjs from 'cosmicjs';
import { originalPathname } from 'next/dist/build/templates/app-page';

const{CHAVE_GRAVACAO_PRODUCAO,
  BUCKET_PRODUCAO,} = process.env;

const Comisc = comiscjs();
const bucketAvatares = Comisc.bucket({
  slug: BUCKET_PRODUCAO,
  write_key: CHAVE_GRAVACAO_PRODUCAO
});

const bucketPublicacoes = Comisc.bucket({
  slug: BUCKET_PRODUCAO,
  write_key: CHAVE_GRAVACAO_PRODUCAO
});

const storage = multer.memoryStorage();
const upload = multer({storage : storage})

const uploadImageComisc = async(req : any) => {
  if(req?.file?.originalname){
    const media_object = {
      originalName: req.file.originalname,
      buffer : req.file.buffer

    };


    if(req.url && req.url.includes('publicacao')){
      return await bucketPublicacoes.addMedia({media : media_object});
    }else{
      return await bucketAvatares.addMedia({media : media_object});

    }

  }
}


export {upload, uploadImageComisc}
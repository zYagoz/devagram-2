import mongoose, {Schema} from 'mongoose';

const seguidorSchema = new Schema ({
  // ID de quem segue
  usuarioId : {type : String, required: true },
  //ID de quem está sendo seguido
  usuarioSeguidoId : {type : String, required : true},

});

export const seguidorModel = (mongoose.models.seguidores || 
  mongoose.model('seguidores', seguidorSchema));
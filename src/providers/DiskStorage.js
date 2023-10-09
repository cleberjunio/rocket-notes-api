const fs = require ("fs");
const path = require ("path");
const uploadConfig = require ("../configs/upload")

class DiskStorage {
  async saveFile(file){

    //rename para renomear um arquivo/mover.
    await fs.promises.rename(
      //Quando a imagem chega no banco ela vai pra pasta temporária 
      path.resolve(uploadConfig.TMP_FOLDER, file),

      path.resolve(uploadConfig.UPLOADS_FOLDER, file)
    );

    return file;
  }
    async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    try{
      //verifica o estado do arquivo(se está aberto ou corrompido)
      await fs.promises.stat(filePath);
      
    }catch{
      return;
    }
    
    await fs.promises.unlink(filePath);
    }
}

module.exports = DiskStorage;
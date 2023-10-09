const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController {
  async update(req, res) {
    //id do usuário  que deseja atualizar a imagem dele
    const user_id = req.user.id;

    //nome do arquivo que o usuário fez upload/novo avatar
    const avatarFilename = req.file.filename;

    //Instanciando o DiskStorage responsável por salvar e/ou deletar as imagens
    const diskStorage = new DiskStorage();

    const user = await knex("users")
    .where({ id: user_id }).first();

    //Caso o usuário não exista
    if (!user) {
      throw new AppError("Somente usuários autenticados podem mudar o avatar!",401);
    }

    //Se dentro da tabela do usuário existir um avatar, 
    //é preciso pegar a foto antiga e deletar, para uma imagem não sobrepor a outra
    if (user.avatar) {
     
      // se já existe uma imagem/foto no banco, invoca função deletar,
      // pra  conseguir colocar uma nova.
      await diskStorage.deleteFile(user.avatar); //deletando foto antiga
    }

    //Caso não exista imagem ele pega a nova imagem(avatarFilename)  
    // no diskStorage e passa o novo avatar
    //filename-variável que armazena a nova imagem salva
    const filename = await diskStorage.saveFile(avatarFilename); 

    //Inserir a nova imagem pra dentro do avatar do usuário
    user.avatar = filename;

    await knex("users").update(user).where({ id: user_id });

    return res.json(user);
  }
}

module.exports = UserAvatarController;

require("express-async-errors");
require("dotenv/config");
const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload")

// é um mecanismo baseado em cabeçalho HTTP que permite 
//que um servidor indique qualquer origem (domínio, esquema ou porta) diferente da sua própria,
// a partir da qual um navegador deve permitir o carregamento de recursos. 
const cors = require("cors");
const express = require("express");
const routes = require("./routes");

migrationsRun();

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

//Tratamento de Erros
app.use((error, req, res, next) => {
  //erro gerado no lado do cliente
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  //erro gerado no lado do servidor
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});
const PORT = process.env.SERVER_PORT || 3333;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

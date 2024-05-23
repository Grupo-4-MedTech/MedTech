process.env.AMBIENTE_PROCESSO = "desenvolvimento";
// process.env.AMBIENTE_PROCESSO = "producao";

const express = require("express");
const cors = require("cors");
const path = require("path");

const PORTA = process.env.AMBIENTE_PROCESSO == "desenvolvimento" ? 3333 : 8080;

const app = express();

const indexRouter = require("./src/routes/index");
const hospitalRouter = require("./src/routes/hospital");
const funcionarioRouter = require("./src/routes/funcionario");
const emailRouter = require("./src/routes/email");
const adminRouter = require("./src/routes/admin");
const computadorRouter = require("./src/routes/computador");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/hospital", hospitalRouter);
app.use("/funcionario", funcionarioRouter);
app.use("/send-email", emailRouter);
app.use("/admin", adminRouter);
app.use("/computador", computadorRouter)

app.listen(PORTA, function () {
    console.log(`Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar: http://localhost:${PORTA} \n
    Você está rodando sua aplicação em Ambiente de ${process.env.AMBIENTE_PROCESSO} \n
    \t\tSe "desenvolvimento", você está se conectando ao banco LOCAL (MySQL Workbench). \n
    \t\tSe "producao", você está se conectando ao banco REMOTO (SQL Server em nuvem Azure) \n
    \t\t\t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'`);
});

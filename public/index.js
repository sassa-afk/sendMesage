require("dotenv").config();

const Mail = require("./Mail");
const objMail = new Mail();

const express = require("express");
const lermail = require("nodemailer");

const app = express();
app.use(express.json());

app.get("/mail/enviar", async (req, res) => {
  return res.json({ mesage: `ola mundo ` });
});

app.post("/mail/sendMain", async (req, res) => {
  const { hst, port, secure, user, pass, mailTo, titulo, msgHTML, msgText } =
    req.body;

  if (
    !hst ||
    !port ||
    !secure ||
    !user ||
    !pass ||
    !mailTo ||
    !titulo ||
    !msgHTML ||
    !msgText
  ) {
    return res
      .status(500)
      .json({ mesage: "Parametros invalidos / imcompletos" });
  }

  try {
    const retorno = await objMail.sendMailLerSimple(
      hst,
      port,
      secure,
      user,
      pass,
      mailTo,
      titulo,
      msgHTML,
      msgText
    );
    return res.status(200).json({ mesage: retorno.log });
  } catch (err) {
    return res
      .status(500)
      .json({ mesage: `Erro na execução do processo ${err.message}` });
  }
});

app.listen(3000, () => {
  console.log("Servidor ativo na porta 3000");
});

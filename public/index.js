require("dotenv").config();


const Default = require("./Default");
const def = new Default() ; 

const express = require("express");

const app = express();
app.use(express.json());


// -------------------------------------------------------------------------------------------------------
// ------------------------------------  APIS DISPARR MAIL -----------------------------------------------
// -------------------------------------------------------------------------------------------------------

const lermail = require("nodemailer");
const Mail = require("./Mail");
const objMail = new Mail();

app.get("/mail/enviar", async (req, res) => {
  return res.json({ mesage: `ola mundo ` });
});

app.post("/mail/sendMain", async (req, res) => {
  const { hst, port, secure, user, pass, mailTo, titulo, msgHTML, msgText } =
    req.body;

  if (
    !hst ||
    !port ||
    !user ||
    !pass ||
    !mailTo ||
    !titulo ||
    !msgHTML ||
    !msgText
  ) {
    def.logs( false , "Solicitação de envio de email parametros invalidos") ; // <--------- LOG
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

    def.logs( true , `${retorno.log}`) ; // <--------- LOG
    return res.status(200).json({ mesage: retorno.log });
  } 
  catch (err) {
    def.logs( false , `Error ao enviar email : ${err.message}`) ; // <--------- LOG
    return res
      .status(500)
      .json({ mesage: `Erro na execução do processo ${ err.message}` });
  }
});

// CONSTRUIR MAIL PARA ENVIAR ARQUIVOS  <-------------------------------

// -------------------------------------------------------------------------------------------------------
// -----------------------------------  APIS CALENDER DO GOOGLE ------------------------------------------
// -------------------------------------------------------------------------------------------------------


const Calender = require('./Calender');
const calender = new Calender();

app.post("/google/calender/newToken" , async ( req , res ) =>{

  const { client_id , client_secret  } = req.body ; 
  
  if( !client_id || !client_secret ){
    def.logs( false , ` Solicitãção token novo token google calender com parametros invalidos`) ; // <--------- LOG
    return res.status(400).json( { mesage : "Parametros invalidos" });
  }

  try{

    const nwToken = await calender.newToken( client_id , client_secret );

    def.logs( true , ` Solicitação de newTokenCalender realizado com sucesso`) ; // <--------- LOG
    return res.status(200).json( {mesage : nwToken.authURL , data : `${ nwToken.data }`});


  }catch(er){

    def.logs( false , ` Erro na solicitação da api  newTokenCalender ${ er.message }`) ; // <--------- LOG
    return res.status(500).json( { mesage : `Erro ao gerar token  ${er} ` });
  }
});

app.get("/google/calender/lsCaleder" , async ( req , res ) => {
  const {token} = req.query ;
  
  if(!token){
    def.logs( false , ` Solicitãção ver calendario google do calender com parametros nulos `) ; // <--------- LOG
  }


  const reposta = await calender.MyCalenders( token);

  return res.json({ mesage : reposta });
}) ;

app.post( "/google/calender/newEvent" , async ( req , res ) => {

  const { token , local , descricao , dataStart  , dataEnd , mailMeu , mailConvidado , tempMin , tempMax } = req.body ;
  
  if(!token || !local || !descricao || !dataStart  || !dataEnd || !mailMeu || !mailConvidado || !tempMin || !tempMax){
    return res.status(401).json({ mesage : 'Parametros obrigatorio invalidos ou nulo ' });
  };

  try{
    const retorno = await calender.newEvent ( token , local , descricao , dataStart  , dataEnd , mailMeu , mailConvidado , tempMin , tempMax );
    return res.status(200).json({  mesage : retorno.log }) ;
  }catch( er ){
    return res.status(500).json({ message: 'Erro ao criar evento.', error: err.message || err });
  }
})

app.patch("/google/calender/edtEvent", async (req, res) => {
  const { token, idTarefa, summary, location, description, dataStart, dataEnd } = req.body;

  if (!token || !idTarefa || !summary || !location || !description || !dataStart || !dataEnd) {
    return res.status(400).json({ mesage: 'Parâmetros inválidos ou nulos' });
  }

  try {
    const resposta = await calender.updateEvent(token, idTarefa, summary, location, description, dataStart, dataEnd);

    def.logs(true, `At ${def.dateFormat()} : solicitação realizada com sucesso ${JSON.stringify(resposta)}`);

    return res.status(200).json({ mesage: resposta });

  } catch (er) {
    def.logs(false, `At ${def.dateFormat()} : ${er}`);
    return res.status(500).json({ mesage: `At ${def.dateFormat()} , ${er.message}` });
  }
});

app.delete("/google/calender/delEvent" , async ( req , res ) =>{

  const body = { token , idTarefa } = req.body ; 

  if( !token || !idTarefa ){
    return res.status(401).json({ mesage : 'Parametros nulos' })
  }

  try{
    const retorno = await calender.deletEvent ( token , idTarefa ) ;
    return res.status(200).json({ mesage : `At ${def.dateFormat()} : : ${JSON.stringify(retorno)} : `})
  }catch( er ){
    return res.status(500).json({ mesage : `At ${def.dateFormat()} : error -> ${er.message}`})
  }
});

// ---------------------------------------------------------------------------------------------------
// -----------------------------------------  APIS OCRSpace ------------------------------------------
// -------------------------------------------------------------------------------------------------------

const OCR = require("./OCRSpace");
const objOcr = new OCR ();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post("/OCR/fileRead", upload.single("file"), async (req, res) => {
  const {token} = req.body;
  const file = req.file;

  if (!token || !file) {
    return res.status(401).json({ mesage: "Parametors obrigatoriso invalidos" });
  }

  try {
    const resultado = await objOcr.describle(token, file.path);
    return res.status(200).json({ mensagem: resultado });
  } catch (er) {
    return res.status(500).json({ mesage: `At ${def.dateFormat()} Erro: ${er.message}` });
  }
});
// -------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
app.listen(3000, () => {
  console.log("Servidor ativo na porta 3000");
});

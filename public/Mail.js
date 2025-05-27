const nodemailer = require("nodemailer");

const Default = require("./Default");
const def = new Default();


class Mail {

  async sendMailLerSimple(
    hst,
    port,
    secure,
    user,
    pass,
    mailTo,
    titulo,
    msgHTML,
    msgText
  ) {
    const transporter = nodemailer.createTransport({
      host: hst,
      port: port,
      secure: secure,
      auth: {
        user: user,
        pass: pass,
      },
    });

    try {
      const response = await transporter.sendMail({

        from: user,
        to: mailTo,
        subject: titulo,
        html: msgHTML,
        text: msgText,

      });


 
      console.log(`Email sent successfully at ${ def.dateFormat() } | From: ${user} | To: ${mailTo} | Subject: "${titulo}" | Message ID: ${response.messageId}`);
       // let retorno =   `Email sent successfully at ${ def.dateFormat() } | From: ${user} | To: ${mailTo} | Subject: "${titulo}" | Message ID: ${response.messageId}` ;
             let retorno =   `Email sent successfully at ${ def.dateFormat() } | From: ${user} | To: ${mailTo} | Subject: "${titulo}" | Message ID: ${response.messageId}` ;

       return { log : retorno } ;

    } catch (er) {

         console.error(`Email sending failed at ${ def.dateFormat() } | From: ${user} | To: ${mailTo} | Subject: "${titulo}" | Error: ${err.message}`);

      // let retorno = `log`: `Email sending failed at ${ def.dateFormat() } | From: ${user} | To: ${mailTo} | Subject: "${titulo}" | Error: ${err.message}`  ;
       let retorno =   `Email sending failed at ${def.dateFormat} | From: ${user} | To: ${mailTo} | Subject: "${titulo}" | Error: ${err.message}` ;
       return {  log : retorno } ;

    }
  }

}

module.exports = Mail;

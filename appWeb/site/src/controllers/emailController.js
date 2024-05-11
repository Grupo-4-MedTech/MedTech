const nodeMailer = require('nodemailer');
const transporter = nodeMailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
        user: "medtech.it.solutions@outlook.com",
        pass: "foco1020"
    },
});

function emailCadastro(hospital){

    const config = {
        from: 'medtech.it.solutions@outlook.com',
        to: 'medtech.it.solutions@outlook.com',
        subject: 'NOVO CADASTRO DE HOSPITAL REALIZADO',
        html: `
        <h1>O hospital ${hospital.nomeFantasia} foi cadastrado.</h1> 
            <h2>Dados:</h2> 
            <ul> 
                <li>Nome fantasia: ${hospital.nomeFantasia}</li> 
                <li>Razão social: ${hospital.razaoSocial}</li> 
            </ul>
        <h4>Entre em contato para validar os dados através do email " ${hospital.email}"</h4>
            '`,
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(config, function(error, info) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log('E-mail enviado: ' + info.response);
                resolve(true);
            }
        });
    });
}

module.exports = {
    emailCadastro
}
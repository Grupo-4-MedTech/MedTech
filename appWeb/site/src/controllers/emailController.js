const nodeMailer = require('nodemailer');


function emailCadastro(hospital){
    const transporter = nodeMailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth: {
            user: "medtech.it.solutions@outlook.com",
            pass: "foco1020"
        },
    });

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
            '`
    }

    return send(transporter, config);
}

function repairMail(obj, responsavel) {
    const transporter = nodeMailer.createTransport({
        host: obj.funcionario.host,
        port: obj.funcionario.port,
        secure: false,
        auth: {
            user: obj.funcionario.email,
            pass: obj.funcionario.pass
        },
    });

    const config = {
        from: obj.funcionario.email,
        to: responsavel.email,
        subject: 'MANUTENÇÃO AGENDADA',
        html: `
        Olá, ${responsavel.nome}! <br> 
        Uma manutenção para o computador de nome "${obj.computador.nome}", do departamento "${obj.computador.nomeDepartamento}"
        foi agendada para a seguinte data: <b>${obj.date}</b>`
    }

    return send(transporter, config);
}

function send(transporter, config) {
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
    emailCadastro,
    repairMail
}
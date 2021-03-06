import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';

class SendMailService{
    private client: Transporter
    constructor() {
        //.then recebe o resposta de caso de sucesso
        //em erro vai para .catch
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            this.client = transporter;
        })
    }

    async execute(to: string, subject: string, variables: object, path: string){

        //------------PATH & READ FILE-------------
        const templateFileContent = fs.readFileSync(path).toString("utf8");
        
        //----------HBS COMPILE TEMPLATE----------
        const mailTemplateParse = handlebars.compile(templateFileContent)

        //---------------PARSE VAR----------------
        const html = mailTemplateParse(variables);

        //-----------------------------------------

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: 'NPS <noreplay@nps.com.br>'
        })

        console.log('Message sent: %s', message.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
};

export default new SendMailService();

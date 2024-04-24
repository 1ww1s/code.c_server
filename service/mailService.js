const nodemailer = require('nodemailer')

class MailService {

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {rejectUnauthorized: false}
        })
    }

    async sendActivationMail(to, link){
        try{
            await this.transporter.sendMail({
                from: `Code.C - изучение языка Си ${process.env.SMTP_USER}`,
                to,
                subject: 'Активация аккаунта на ' + process.env.CLIENT_URL,
                text: '',
                html: 
                    `
                        <div style="
                            padding: 20px;

                        ">
                            <h1>Для активации аккаунта нажмите на кнопку</h1>
                            <a style = "
                                    font-family: 'Montserrat Medium';
                                    display: inline;
                                    color: white;
                                    position: relative;
                                    text-decoration: none;
                                    font-size: 15px;
                                    width: 220px;
                                    height: 50px;
                                "
                                href="${link}"
                            >
                                <button style="
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    border-radius: 8px 8px / 50% 50%;
                                    padding: 20px;
                                    width: 220px;
                                    height: 50px;
                                    color: white;
                                    background-color: #4A68FF;
                                    border: 0;
                                    outline: 0;
                                    cursor: pointer"
                                >
                                    Активировать
                                </button>
                            </a>
                        </div>
                    `
            })
        }
        catch(e){
            throw e
        }
    }

    async sendReminder(to, link){
        try{
            await this.transporter.sendMail({
                from: `Code.C - изучение языка Си ${process.env.SMTP_USER}`,
                to,
                subject: 'Восстановление пароля на ' + process.env.CLIENT_URL,
                text: '',
                html: 
                    `
                        <div style="
                            padding: 20px;
                        ">
                            <h1>Чтобы восстановить доступ к своему аккаунту, пройдите, пожалуйста, по ссылке:</h1>
                            <a href="${link}">${link}</a>
                        </div>
                    `
            })
        }
        catch(e){
            throw e
        }
    }
}

module.exports = new MailService();
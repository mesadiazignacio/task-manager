import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user : IEmail) => {
        await transporter.sendMail({
            from: 'Task Manager - MERN',
            to: user.email,
            subject: 'Account Verification - Task Manager (MERN)',
            text: 'Account Verification - Task Manager (MERN)',
            html: `<p>Hi ${user.name}, just one more step:</p>
                <p>Click the link below to confirm your account:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account"/>¡Click Here!</a>
                <p><b>${user.token}</b></p>
                <p>This token will expire in <b>10 minutes</b></p>
                <p>If you did not create an account, please ignore this email</p>
            `
        })
    }

    static sendPasswordResetToken = async (user : IEmail) => {
        await transporter.sendMail({
            from: 'Task Manager - MERN',
            to: user.email,
            subject: 'Reset Password - Task Manager (MERN)',
            text: 'Reset Password - Task Manager (MERN)',
            html: `<p>Hi ${user.name}, you have requested a password reset. Click the link below to reset it:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password"/>¡Click Here!</a>
                <p>You will need to put the following token there: <b>${user.token}</b></p>
                <p>This token will expire in <b>10 minutes</b></p>
                <p>(If you did not create an account, please ignore this email)</p>
            `
        })
    }
}
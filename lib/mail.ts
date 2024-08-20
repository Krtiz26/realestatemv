import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`

    await resend.emails.send ({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `
            <p>Hi,</p>
            <p>We received a request to verify your email address. Please click the link below to confirm your email:</p>
            <p><a href="${confirmLink}">Confirm Email</a></p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thank you,<br>The Real Estate MV Team</p>
        `
    })
}

export const sendPasswordResetEmail = async (
    email: string,
    token: string,
) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `
            <p>Hi,</p>
            <p>We received a request to reset your password. Please click the link below to reset your password:</p>
            <p><a href="${resetLink}">Reset Password</a></p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thank you,<br>The Real Estate MV Team</p>
        `
    })
}

import { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body
            const userExists = await User.findOne({ email })
            if (userExists) { // Check if the user already exists in the database
                const error = new Error('User already exists')
                res.status(409).json({ error: error.message })
                return
            }
            const user = new User(req.body)

            user.password = await hashPassword(password) // Hash the password before saving it to the database

            const token = new Token() // Create a new token instance
            token.token = generateToken()
            token.user = user.id

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()]) // Save the user and token to the database
            res.send('Account created successfully, check your email for verification link')
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Not valid token')
                res.status(401).json({ error: error.message })
                return
            }
            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()]) // Save the user and delete the token from the database
            res.send('Account verificated successfully')
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })

            if (!user) { // Check if the user exists in the database
                const error = new Error('User does not exist')
                res.status(401).json({ error: error.message })
                return
            }

            if (!user.confirmed) { // Check if the user is confirmed
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()


                AuthEmail.sendConfirmationEmail({ // Send confirmation email again
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('User not verified, check your email for verification link')
                res.status(401).json({ error: error.message })
                return
            }

            const isPasswordCorrect = await checkPassword(password, user.password)
            if (!isPasswordCorrect) { // Check if the password is correct
                const error = new Error('Incorrect password, try again')
                res.status(401).json({ error: error.message })
                return
            }

            const token = generateJWT({id: user.id}) // Generate a JWT token
            res.send(token)
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            const user = await User.findOne({ email })
            if (!user) { // Check if the user already exists in the database
                const error = new Error('User does not exist')
                res.status(404).json({ error: error.message })
                return
            }
            if (user.confirmed) {
                const error = new Error('User already confirmed')
                res.status(403).json({ error: error.message })
                return
            }

            const token = new Token() // Create a new token instance
            token.token = generateToken()
            token.user = user.id

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()]) // Save the user and token to the database
            res.send('New token was sent, check your email')
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            const user = await User.findOne({ email })
            if (!user) { // Check if the user already exists in the database
                const error = new Error('User does not exist')
                res.status(404).json({ error: error.message })
                return
            }

            const token = new Token() // Create a new token instance
            token.token = generateToken()
            token.user = user.id
            await token.save()

            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Check your email and follow the instructions')
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Not valid token')
                res.status(401).json({ error: error.message })
                return
            }

            res.send('Token is valid, define a new password')
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const { password } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Not valid token')
                res.status(401).json({ error: error.message })
                return
            }

            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(password) // Hash the password before saving it to the database
            Promise.allSettled([user.save(), tokenExists.deleteOne()]) // Save the user and delete the token from the database
            res.send('Password updated successfully')
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    static user = async (req: Request, res: Response) => {
        res.json(req.user)
        return
    }

    static updateProfile = async (req: Request, res: Response) => {
        const { name, email } = req.body
        const userExists = User.findOne({email})
        if(userExists && (await userExists).id.toString() !== req.user.id.toString()) {
            const error = new Error('Email already in use')
            res.status(409).json({ error: error.message })
            return
        }
        req.user.name = name
        req.user.email = email

        try {
            await req.user.save()
            res.send('Profile updated successfully')
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { currentPassword, password } = req.body
        const user = await User.findById(req.user.id)
        const isPasswordCorrect = await checkPassword(currentPassword, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('Incorrect password, try again')
            res.status(401).json({ error: error.message })
            return
        }

        try {
            user.password = await hashPassword(password) // Hash the new password before saving it to the database
            await user.save()
            res.send('Password updated successfully')
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body
        const user = await User.findById(req.user.id)
        const isPasswordCorrect = await checkPassword(password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('Incorrect password, try again')
            res.status(401).json({ error: error.message })
            return
        }
        res.send('Correct password')
    }
}
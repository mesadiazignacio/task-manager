import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10) // Salt is a unique and random value for that password
    return await bcrypt.hash(password, salt) // Hash the password with the salt
}

export const checkPassword = async (enteredPassword: string, hashedPassword: string) => {
    return await bcrypt.compare(enteredPassword, hashedPassword) // Compare the entered password with the hashed password
}
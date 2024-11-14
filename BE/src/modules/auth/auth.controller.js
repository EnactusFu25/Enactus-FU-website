import User from '../../../DB/models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

export const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email})
    if (!user)
        return res.status(400).json({message: 'invalid email or password'})
    const isPasswordCorrect = await bcrypt.compareSync(password, user.password)
    if (!isPasswordCorrect)
        return res.status(400).json({message: 'invalid email or password'})
    const token = jwt.sign({email: user.email, id: user._id}, 'test', {expiresIn: '1h'})
    res.status(200).json({message: 'logged in successfuly', result: user, token})
}
export const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body
    const user = await User.findOne({ email})
    if (user)
        return res.status(400).json({message: 'email already exists'})
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({ email, password: hashedPassword, name: `${firstName} ${lastName}`})
    await newUser.save()
    res.status(201).json({message: 'user created successfuly'})
}
/* @TODO: implement forget password */
export const forgetPassword = async (req, res) => {
    
    
}
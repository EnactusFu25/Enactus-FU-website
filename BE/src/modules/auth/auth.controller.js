import User from '../../../DB/models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import sendEmailService from '../../services/send-email.service.js'

export const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email})
    if (!user)
        return res.status(400).json({message: 'invalid email or password', success: false})
    const isPasswordCorrect = bcrypt.compareSync(password, user.password)
    if (!isPasswordCorrect)
        return res.status(400).json({message: 'invalid email or password', success: false})
    const token = process.env.TOKEN_PREFIX + jwt.sign({email: user.email, id: user._id}, process.env.JWT_SECRET_LOGIN , {expiresIn: '1d'})
    res.status(200).json({message: 'logged in successfuly', success: true, token})
}
export const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body
    const user = await User.findOne({ email})
    if (user)
        return res.status(400).json({message: 'email already exists'})
    
    const usertoken = jwt.sign({ email },
        process.env.JWT_SECRET_VERFICATION,
        { expiresIn: '5m' })
    const isEmailSent = await sendEmailService(
    {
        to: email,
        subject: 'Email Verification',
        message: `<h2>please click on this link to verfiy your email</h2>
        <a href="${req.protocol}://${req.headers.host}/auth/verify-email?token=${usertoken}">Verify Email</a>`
    })

    if (!isEmailSent) 
        return next(new Error('An error occured, please try again later', { cause: 500 }))
    
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({ email, password: hashedPassword, name: `${firstName} ${lastName}`})
    await newUser.save()
    res.status(201).json({
        message: 'User created successfully, please check your email to verify your account',
        success: true,
        data: newUser
    })
}

    
export const verifyEmail = async (req, res, next) => 
{
    const { token } = req.query

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_VERFICATION)

    const user = await User.findOne({ email: decodedData.email, verifiedEmail: false })
    if (!user)
        return next(new Error('User not found', { cause: 404 }))

    user.verifiedEmail = true
    const updatedUser = await user.save()
    if (!updatedUser)
        return next(new Error('An error occured, please try again later', { cause: 500 }))

    res.status(200).json({
        success: true,
        message: 'Email verified successfully'
    })
}


export const resendEmail = async (req, res, next) =>
{
    const {email} = req.body

    const doesUserExist = await User.findOne({email, verifiedEmail: false})
    if (!doesUserExist)
        return next(new Error('user doesn\'t exist or already verified', { cause: 409 }))

    const usertoken = jwt.sign({ email },
        process.env.JWT_SECRET_VERFICATION,
        { expiresIn: '5m' })
    
    const isEmailSent = await sendEmailService(
    {
        to: email,
        subject: 'Email Verification',
        message: `<h2>please click on this link to verfiy your email</h2>
        <a href="${req.protocol}://${req.headers.host}/auth/verify-email?token=${usertoken}">Verify Email</a>`
    })

    if (!isEmailSent) 
        return next(new Error('An error occured, please try again later', { cause: 500 }))
    
    res.status(200).json(
    {
        success: true,
        message: "sent verification email"
    })
}

export const forgetPassword = async (req, res, next) =>
{
    const { email } = req.body

    const user =  await User.findOne({email, verifiedEmail: true})
    if (!user)
        return next(new Error('User not found', { cause: 404 }))
    
    const usertoken = jwt.sign({ email },
        process.env.JWT_SECRET_FORGETPASSWORD,
        { expiresIn: '2m' })
    const isEmailSent = await sendEmailService(
    {
        to: email,
        subject: 'Password Reset',
        message: `<h2>Please use this code to reset your password</h2>
        <h3>${usertoken}</h3>`
    })
    if (!isEmailSent) 
        return next(new Error('An error occured, please try again later', { cause: 500 }))
    res.status(200).json(
    {
        success: true,
        message: "please check your email to reset your password"
    })
}

export const resetPassword = async (req, res, next) =>
{
    const { token, password } = req.body

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_FORGETPASSWORD)

    const user = await User.findOne({ email: decodedData.email, isEmailVerified: true })
    if (!user)
        return next(new Error('incorrect code', { cause: 404 }))

    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)


    user.password = hashedPassword
    const updatedUser = await user.save()
    if (!updatedUser)
        return next(new Error('An error occured, please try again later', { cause: 500 }))

    res.status(200).json({
        success: true,
        message: 'Password reset successfully, you can now login with your new password'
    })
}
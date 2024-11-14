import User from '../../../DB/models/user.model.js'
import bcrypt from 'bcryptjs'
export const addRecoveryEmail = async (req, res) => {
    const { email } = req.body
    const user = req.AuthUser
    /**
     * @todo send email to confirm adding the recovery email
     */
    const emailAdded = await User.findByIdAndUpdate(user._id, {
        recoveryEmail: email
    })
    if (!emailAdded)
        return res.status(500).json({message: "an error occured"})
    res.status(200).json({message: "added recovery email"})
}


export const changeRecoveryEmail = async (req, res) => {
    const { email } = req.body
    const user = req.AuthUser
    /**
     * @todo send email to confirm adding the recovery email
     */
    const emailChanged = await User.findByIdAndUpdate(user._id, { recoveryEmail: email })
    if (!emailChanged)
        return res.status(500).json({message: "an error occured"})
    res.status(200).json({message: "recovery email changed"})
}

export const updatePassword = async (req, res) => {
    const { password, oldPassword } = req.body
    const user = req.AuthUser

    const isPasswordCorrect = bcrypt.compareSync(oldPassword, user.password)
    if (!isPasswordCorrect)
        return res.status(400).json({message: "invalid password"})
    const hashedPassword = await bcrypt.hash(password, 12)
    const passwordUpdated = await User.findByIdAndUpdate(user._id, {
        password: hashedPassword
    })
    if (!passwordUpdated)
        return res.status(500).json({message: "an error occured"})
    res.status(200).json({message: "password updated"})
}

export const updateData = async (req, res) => {
    const { firstName, lastName } = req.body
    const user = req.AuthUser
    const name = `${firstName} ${lastName}`
    const dataUpdated = await User.findByIdAndUpdate(user._id, {name})
    if (!dataUpdated)
        return res.status(500).json({message: "an error occured"})
    res.status(200).json({message: "data updated"})
}
/**
 * @todo implement verify email
 */
// export const verifyEmail = async (req, res) => {
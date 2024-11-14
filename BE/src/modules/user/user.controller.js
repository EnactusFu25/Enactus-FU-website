import User from '../../../DB/models/user.model.js'

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
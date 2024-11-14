import Applications from '../../../DB/models/application.model.js'
import Forms from '../../../DB/models/form.model.js'

export const apply = async (req, res) => {
    const { email, name, phone, facebook, age, faculty,
    university, year, firstTime, whyInterested, commitment, previousRole,
    department, secondDepartment, form, answers} = req.body

    const isFormExist = await Forms.findById(form)

    if (!isFormExist)
        return res.status(404).json({message: 'form not found'})
    for (let i = 0; i < isFormExist.questions.length; i++)
    {
        if (isFormExist.questions[i] != answers[i].question)
            return res.status(400).json({message: 'question not found'})
        if (isFormExist.questions[i].type == "MCQ" && !isFormExist.questions[i].options.includes(answers[i].answer))
            return res.status(400).json({message: 'answer not valid'})
    }
    const application = new Applications({ email, name, phone, facebook, age, faculty,
        university, year, firstTime, whyInterested, commitment, previousRole,
        department, secondDepartment, form, answers})
    const isApplicationCreated = await application.save()
    if (!isApplicationCreated)
        return res.status(500).json({message: 'an error occured'})
    res.status(201).json({message: 'application created'})
}

export const getApplications = async (req, res) => {
    const applications = await Applications.find()
    if (!applications.length)
        return res.status(404).json({message: 'no applications found'})
    res.status(200).json({applications})
}

export const getApplication = async (req, res) => {
    const { id } = req.params
    const application = await Applications.findById(id)
    if (!application)
        return res.status(404).json({message: 'application not found'})
    res.status(200).json({application})
}

export const respondToApplication = async (req, res) => {
    const { id, response } = req.body
    const user = req.AuthUser
    let application;
    if (!response)
        application = await Applications.findByIdAndUpdate(id, {isRejected: true, rejectedBy: user._id})
    else    
        application = await Applications.findByIdAndUpdate(id, {isApproved: true, approvedBy: user._id})
    if (!application)
        return res.status(404).json({message: 'application not found'})
    res.status(200).json({message: 'application responded'})
}

/**
 * @todo excel sheet
 */
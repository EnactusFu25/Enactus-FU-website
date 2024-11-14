import Form from '../../../DB/models/form.model.js'

export const createForm = async (req, res) => {
    const { questions, department } = req.body

    const isDepartmentExist = await Form.findOne({department})
    if (isDepartmentExist)
        return res.status(400).json({message: 'department already has a form'})
    
}

export const updateForm = async (req, res) => {
    const { id } = req.params
    const { questions } = req.body

    const isFormExist = await Form.findById(id)
    if (!isFormExist)
        return res.status(404).json({message: 'form not found'})
    const formUpdated = await Form.findByIdAndUpdate(id, {questions})
    if (!formUpdated)
        return res.status(500).json({message: 'an error occured'})
    res.status(200).json({message: 'form updated'})
}

export const deleteForm = async (req, res) => {
    const { id } = req.params
    const form = await Form.findByIdAndUpdate(id, {isDeleted: true, deletedAt: Date.now()})
    if (!form)
        return res.status(404).json({message: 'form not found'})
    res.status(200).json({message: 'form deleted'})
}
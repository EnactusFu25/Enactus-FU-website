import Joi from "joi"
import generalValidationRule from "../../utils/general.validation.rules.js"

export const createFormSchema = {

    body: Joi.object({
        questions: Joi.array().items(Joi.object({
            question: Joi.string().required(),
            type: Joi.string().required().valid("text", "MCQ"),
            options: Joi.array().items(Joi.string())
        })).required(),
        department: Joi.string().required()
    }),
    header: generalValidationRule.headersRule
    
}

export const updateFormSchema = {
    body: Joi.object({
        questions: Joi.array().items(Joi.object({
            question: Joi.string().required(),
            type: Joi.string().valid("text", "MCQ").required(),
            options: Joi.array().items(Joi.string())
        }))
    }),
    query: Joi.object({
        id: generalValidationRule.dbId.required()
    }),
    header: generalValidationRule.headersRule
}

export const deleteFormSchema = {
    query: Joi.object({
        id: generalValidationRule.dbId.required()
    }),
    header: generalValidationRule.headersRule
}
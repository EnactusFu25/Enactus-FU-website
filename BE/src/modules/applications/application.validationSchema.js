import Joi from "joi"
import * as generalValidationRule from "../../utils/general.validation.rules.js"
   
export const applySchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        phone: Joi.string().required(),
        facebook: Joi.string().required(),
        age: Joi.number().required(),
        faculty: Joi.string().required(),
        university: Joi.string().required(),
        year: Joi.number().required(),
        firstTime: Joi.boolean().required(),
        whyInterested: Joi.string().required(),
        commitment: Joi.string().required(),
        previousRole: Joi.string().required(),
        department: Joi.string().required(),
        secondDepartment: Joi.string().required(),
        form: generalValidationRule.dbId.required(),
        answers: Joi.array().items(Joi.object({
            question: Joi.string().required(),
            answer: Joi.string().required()
        })).required()
    }),
    header: generalValidationRule.headersRuleOptional
})

export const getApplicationsSchema = Joi.object({
    header: generalValidationRule.headersRule
})

export const getApplicationSchema = Joi.object({
    query: Joi.object({
        id: generalValidationRule.dbId.required()
    }),
    header: generalValidationRule.headersRule
})

export const respondToApplicationSchema = Joi.object({
    body: Joi.object({
        id: generalValidationRule.dbId.required(),
        response: Joi.boolean().required()
    }),
    header: generalValidationRule.headersRule
})
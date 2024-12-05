import Joi from "joi"
import generalValidationRule from "../../utils/general.validation.rules.js"
import { departments } from "../../utils/globalImports.js"
   
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
        department: Joi.string().required().valid(departments.PM, departments.HR, departments.PR, departments.LSC, departments.Market, departments.Media, departments.Presentation, departments.BE, departments.FE, departments.DA),
        secondDepartment: Joi.string().valid(departments.PM, departments.HR, departments.PR, departments.LSC, departments.Market, departments.Media, departments.Presentation),
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
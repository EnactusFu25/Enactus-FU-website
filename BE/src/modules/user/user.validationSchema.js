import Joi from "joi"
import generalValidationRule from "../../utils/general.validation.rules.js"

export const addRecoveryEmailSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required()
    }),
    header: generalValidationRule.headersRule
})

export const changeRecoveryEmailSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required()
    }),
    header: generalValidationRule.headersRule
})

export const updatePasswordSchema = Joi.object({
    body: Joi.object({
        oldPassword: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().valid(Joi.ref('password'))
    }).with('password', 'confirmPassword'),
    header: generalValidationRule.headersRule
})

export const updateDataSchema = Joi.object({
    body: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
    }),
    header: generalValidationRule.headersRule
})
import Joi from "joi"
import generalValidationRule from "../../utils/general.validation.rules.js"
export const createArticleschema = Joi.object({
    body:
        Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required()
        }),
    header: generalValidationRule.headersRule
})

export const updateArticleSchema = Joi.object({
    body:
        Joi.object({
            title: Joi.string(),
            content: Joi.string()
        }),
    params:
        Joi.object({
            id: generalValidationRule.dbId.required()
        }),
    header: generalValidationRule.headersRule
})

export const deleteArticleSchema = Joi.object({
    params:
        Joi.object({
            id: generalValidationRule.dbId.required()
        }),
    header: generalValidationRule.headersRule
})

export const getArticleSchema = Joi.object({
    params:
        Joi.object({
           id: generalValidationRule.dbId.required()
        }),
    header: generalValidationRule.headersRuleOptional
})

export const getArticlesSchema = Joi.object({
    header: generalValidationRule.headersRuleOptional
})
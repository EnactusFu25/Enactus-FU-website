import Joi from "joi"
export const signUpSchema =
{
    body: Joi.object(
    {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        confirmEmail: Joi.string().valid(Joi.ref('email')),
        password: Joi.string().required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')),
    })
    .with('password', 'confirmPassword')
    .with('email', 'confirmEmail')
}


export const logInSchema =
{
    body: Joi.object(
    {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
}

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

export default class LoginValidator
{
    constructor (protected ctx: HttpContextContract)
    {}

    public schema = schema.create({
        email: schema.string({ trim: true }, [
            rules.required(),
            rules.exists({ column: 'email', table: 'users' }),
            rules.email(),
        ]),
        password: schema.string({ trim: true }, [rules.required()]),
    });
}

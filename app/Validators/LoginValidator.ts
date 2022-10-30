import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

export default class LoginValidator
{
    constructor (protected ctx: HttpContextContract)
    {}

    public schema = schema.create({
        email: schema.string.optional({ trim: true }, [
            rules.email(),
            rules.exists({ column: 'email', table: 'users' }),
        ]),
        password: schema.string({ trim: true }, [rules.required()]),
    });
}

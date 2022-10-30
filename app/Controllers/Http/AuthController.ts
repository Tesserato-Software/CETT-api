/* eslint-disable one-var */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import LoginValidator from 'App/Validators/LoginValidator';

export default class AuthController
{
    public async login ({ request, response, auth }: HttpContextContract)
    {
        const { email, password } = await request.validate(LoginValidator);

        let user,
            token: Record<string, any> | null = null;

        if (email)
        {
            /* Verifica soft_delete */
            user = await User.query().where('email', email).firstOrFail();

            token = await auth.use('api').attempt(email, password);
        }

        return response.send({ user, token: token?.token });
    }
}

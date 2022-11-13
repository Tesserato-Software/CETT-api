/* eslint-disable one-var */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
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
            let user = await User.query().where('email', email).firstOrFail();

            let up__password = await Database
                    .from('passwords')
                    .select('password')
                    .where('user_id', user.id)
                    .first(),
                up__unhashed = await User.CompareHash(up__password.password, password);

            if (up__unhashed)
            {
                token = await auth.use('api').attempt(email, password);
            }
        }

        return response.send({ user, token: token?.token });
    }
}

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

    public async getUserData ({ auth, response }: HttpContextContract)
    {
        const {user} = auth;

        if (!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        if(user)
        {
            if (!user.is_enabled)
            {
                return response.unauthorized({ message: 'user_disabled' });
            }

            if (user.should_reset_password)
            {
                return response.unauthorized({ message: 'should_reset_password' });
            }
        }

        await user?.load('passwords');

        let password_created_at = user?.passwords?.find((password) => password.id === user.password_id)?.created_at;
        if (password_created_at)
        {
            if (password_created_at.diffNow('days').days < -3)
            {
                await Database
                    .from('users')
                    .where('id', user?.id)
                    .update({ should_reset_password: true });

                return response.unauthorized({ message: 'should_reset_password' });
            }
        }

        await user?.load('hirarchy');

        return response.send(user);
    }
}

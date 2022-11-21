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
            let user = await User.query().where('email', email).andWhere('is_enabled', true).firstOrFail();

            let up__password = await Database
                    .from('passwords')
                    .select('password')
                    .where('id', user.password_id!)
                    .first(),
                up__unhashed = await User.CompareHash(up__password.password, password);

            if (up__unhashed)
            {
                token = await auth.use('api').attempt(email, password);
            }
            else
            {
                return response.unauthorized({ message: 'Unauthorized', up__unhashed });
            }
        }
        else
        {
            return response.badRequest({ message: 'Bad Request' });
        }

        return response.send({ user, token: token?.token });
    }

    public async getUserData ({ auth, response }: HttpContextContract)
    {
        const {user} = auth;

        if (!user)
        {
            return response.unauthorized({ message: 'Unauthorized', id: undefined });
        }

        if(user)
        {
            if (!user.is_enabled)
            {
                return response.unauthorized({ message: 'user_disabled', id: user.id});
            }

            if (user.should_reset_password)
            {
                return response.unauthorized({ message: 'should_reset_password', id: user.id});
            }
        }

        await user?.load('passwords');

        if (user?.passwords.length >= 3)
        {
            // deleta o com id menor
            let pswToDelete = await Database.from('passwords')
                .select('id')
                .where('user_id', user.id)
                .orderBy('id', 'asc')
                .first();

            await Database.from('passwords').where('id', pswToDelete.id).delete();
        }

        let password_created_at = user?.passwords?.find((password) => password.id === user.password_id)?.created_at;
        if (password_created_at)
        {
            if (password_created_at.diffNow('days').days < -3)
            {
                await Database
                    .from('users')
                    .where('id', user?.id)
                    .update({ should_reset_password: true });

                return response.unauthorized({ message: 'should_reset_password', id: user.id});
            }
        }

        await user?.load('hierarchy');

        return response.send(user);
    }

    public async LoginFailureLimit ({ response, request }: HttpContextContract)
    {
        const { email } = request.all();

        if (!email)
        {
            return response.badRequest({ message: 'Bad Request' });
        }

        try
        {
            await Database
                .from('users')
                .where('email', email)
                .update({
                    should_reset_password: true,
                    is_enabled: false,
                });

            return response.ok({ message: 'Ok' });
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ error });
        }
    }
}

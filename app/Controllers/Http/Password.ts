import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';

export default class PasswordController
{
    public async hash ({ response, request }: HttpContextContract)
    {
        let { password } = request.all();

        try
        {
            let hash = await User.HashPassword(password);

            return response.ok({ hash });
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }
}

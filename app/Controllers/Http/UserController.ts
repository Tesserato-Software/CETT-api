/* eslint-disable one-var */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';

export default class UserController
{
    public async AttachHierarchy ({ response, auth, request, params }: HttpContextContract)
    {
        let { user:currentuser } = auth,
            hierarchy_id = params.id,
            { users } = request.all();

        if(!currentuser)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        if (!users.length || users.find(u => typeof u !== 'number'))
        {
            return response.badRequest('user must be a number array');
        }

        if (isNaN(+hierarchy_id))
        {
            return response.badRequest('hierarchy id must be a number');
        }

        try
        {
            for (let user of users)
            {
                try
                {
                    await Database
                        .from('users')
                        .where('id', user)
                        .firstOrFail();
                }
                catch (error)
                {
                    return response.badRequest(`user ${user} not found`);
                }
            }

            await Database
                .from('users')
                .whereIn('id', users)
                .update({ hierarchy_id });

            return response.ok('updated');
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ error });
        }
    }
}


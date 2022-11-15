import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';

export default class SchoolController
{
    public async list ({ response, auth }: HttpContextContract)
    {
        let { user } = auth;

        if(!user || !user.is_super_user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        try
        {
            let school = await Database
                .from('schools')
                .select(
                    'schools.id',
                    'schools.name',
                )
                .groupBy('schools.id');

            return response.ok(school);
        }
        catch(error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async create ({ response, auth, request }: HttpContextContract)
    {
        let { user } = auth,
            { name } = request.all();

        if(!user || !user.is_super_user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        try
        {
            let school = await Database
                .table('schools')
                .returning('id')
                .insert({
                    name,
                });

            return response.ok(school);
        }
        catch(error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async update ({ response, auth, params, request }: HttpContextContract)
    {
        let { user } = auth,
            { name } = request.all();

        if(!user || !user.is_super_user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        try
        {
            let school = await Database
                .from('schools')
                .where('id', params.id)
                .update({ name });

            return response.ok(school);
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async delete ({ response, auth, params }: HttpContextContract)
    {
        let { user } = auth;

        if(!user || !user.is_super_user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        try
        {
            let school = await Database
                .from('schools')
                .where('id', params.id)
                .delete();

            return response.ok(school);
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Unauthorized' });
        }
    }
}

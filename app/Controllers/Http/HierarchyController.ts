/* eslint-disable one-var */
import { Request } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Hierarchy from 'App/Models/Hierarchy';

export default class HierarchyController
{

    // LIST
    public async index ({ response, auth }: HttpContextContract)
    {
        let { user } = auth;

        if(!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        try
        {
            let hierarchies = await Database
                .from('hierarchies')
                .select(
                    'hierarchies.id',
                    'hierarchies.name',
                    Database.raw(`
                        CASE WHEN COUNT(users.id) > 0
                        THEN (
                            json_agg(
                                json_build_object(
                                    'id', users.id,
                                    'full_name', users.full_name,
                                    'email', users.email,
                                    'hierarchy_id', users.hierarchy_id,
                                    'school_id', users.school_id
                                )
                            )
                        )
                        ELSE '[]'
                        END AS users
                    `)
                )
                .where('hierarchies.school_id', user.school_id)
                .leftJoin('users', 'users.hierarchy_id', 'hierarchies.id')
                .groupBy('hierarchies.id');

            return response.ok(hierarchies);
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    // CREATE
    public async create ({ response, auth, request }: HttpContextContract)
    {
        const { user } = auth;
        const { name, can_update, can_delete, can_enable_users } = request.all();
        const isInvalidRegister = !(
            name?.length
        );

        if (!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        if (isInvalidRegister)
        {
            return response.badRequest({ message: 'Bad Request' });
        }

        try
        {
                let hierarchyCreate = await Database.table('hierarchies')
                .returning('id')
                .insert({
                    name,
                    can_update,
                    can_delete, 
                    can_enable_users,
                    school_id: user.school_id
                });

            return response.ok({ hierarchyCreate });
        }

        catch (error)
        {
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }


    // UPDATE    
    public async update ({ response, auth, request, params }: HttpContextContract)
    {
        const { user } = auth;
        const user_id = params.id;
        const { name, can_delete, can_update, can_enable_users } = request.all();
        const isInvalidRegister = !(
            name?.length
        );

        if (!user_id)
        {
            return response.badRequest('user id must be a number');
        }

        if (isInvalidRegister)
        {
            return response.badRequest('Not valid register');
        }

        if (!user || !user.hierarchy_id)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        else if (user && user.hierarchy_id)
        {
            try
            {
                let hierarchy = await Database.from('hierarchies')
                    .where('id', user.hierarchy_id)
                    .firstOrFail();

                if (!hierarchy?.can_update)
                {
                    return response.unauthorized({ message: 'Unauthorized' });
                }
            }
        
            catch (error)
            {
                console.error(error);
                return response.internalServerError({ error });
            }
        }

        try 
        {
            let hierarchyUpdated = await Database.from('hierarchies')
                .where('id', params.id)
                .update({
                    name,
                    can_delete,
                    can_update,
                    can_enable_users
                });

            return response.ok({ hierarchyUpdated });
        }
        catch (error)
        {
            return response.internalServerError({ message: 'Internal Server Error' })
        }
    }



    // DELETE
    public async delete ({ response, auth, params }: HttpContextContract)
    {
        const { user } = auth;
        const h_id = params.id;

        if (!h_id)
        {
            return response.badRequest('hierarchy id must be a number');
        }

        if (!user || !user.hierarchy_id)
        {
            return response.unauthorized({message: 'Unauthorized'});
        }

        else if (user && user.hierarchy_id)
        {
            try
            {
                let hierarchy = await Database.from('hierarchies')
                    .where('id', user.hierarchy_id)
                    .firstOrFail();

                if (!hierarchy?.can_delete)
                {
                    return response.unauthorized({ message: 'Unauthorized'});
                }
            }
            catch (error)
            {
                console.error(error);
                return response.internalServerError({ error });
            }
        }

        try
        {
            await Database
                .from('users')
                .where('hierarchy_id', h_id)
                .update({ hierarchy_id: null})

            await Database
                .from('hierarchies')
                .where('id', h_id)
                .delete();

            return response.ok({});
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ error });
        }
    }

}

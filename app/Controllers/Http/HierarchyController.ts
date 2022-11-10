/* eslint-disable one-var */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';

export default class HierarchyController
{
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
                                    'school_id', users.school_id,
                                    'first_access', users.first_access
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

    public async create ({ response, auth, request }: HttpContextContract)
    {
        let { user } = auth;
        



    }
}

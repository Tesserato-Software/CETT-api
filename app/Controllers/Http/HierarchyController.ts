/* eslint-disable one-var */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Hierarchy from 'App/Models/Hierarchy';

export default class HierarchyController
{
    public async index ({ response, auth }: HttpContextContract)
    {
        let { user } = auth;

        if(!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        let hierarchies = await Hierarchy
            .query()
            .preload('users')
            .where('school_id', user.school_id)
            .orderBy('id', 'asc');

        return response.ok(hierarchies);
    }
}

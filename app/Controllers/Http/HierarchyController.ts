import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Hierarchy from 'App/Models/Hierarchy';

export default class HierarchyController
{
    public async index ({ response }: HttpContextContract)
    {
        let hierarchies = await Hierarchy
            .query()
            .preload('users')
            .orderBy('id', 'asc');

        return response.ok(hierarchies);
    }
}

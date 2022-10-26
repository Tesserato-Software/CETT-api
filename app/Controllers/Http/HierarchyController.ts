import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class HierarchyController
{
    public async index ({ auth, request, response }: HttpContextContract)
    {
        return 'Hello World';
    }
}

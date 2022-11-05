/* eslint-disable one-var */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';

export default class EgressController
{
    public async DashboardAttachArchive ({ response, auth }: HttpContextContract)
    {
        let { user } = auth;

        if (!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        try
        {
            let egresses = await Database.from('egresses')
                .select(
                    'egresses.id',
                    'egresses.name',
                )
                .where('egresses.school_id', user.school_id)
                .groupBy('egresses.id');

            let archives = await Database.from('archives')
                .select(
                    'archives.id',
                )
                .where('archives.school_id', user.school_id)
                .groupBy('archives.id');

            return response.ok({egresses, archives});
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }
}

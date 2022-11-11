import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';

export default class ArchiveController
{
    public async DashBoardAttachEgress ({ response, auth, params}: HttpContextContract)
    {
        let { user } = auth,
            archive_id = params.id;

        if(!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        if (!archive_id)
        {
            return response.badRequest({ message: 'Missing parameters' });
        }

        try
        {
            let archives = await Database
                    .from('archives')
                    .select ('archives.id')
                    .where('archives.school_id', user.school_id)
                    .where('archives.id', archive_id)
                    .groupBy('archives.id')
                    .firstOrFail(),

                egresses = await Database
                    .from('egresses')
                    .select(
                        'egresses.arq_id',
                        'egresses.name',
                        'egresses.archive_id'
                    )
                    .where('egresses.school_id', user.school_id)
                    .groupBy('egresses.id');

            return response.ok({archives, egresses});
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async AttachEgress ({ response, auth, request,params }: HttpContextContract)
    {
        let { user } = auth,
            archive_id = params.id,
            { egress } = request.all();

        if (!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        if (!egress || !egress?.length || egress.find(e => isNaN(+e)))
        {
            return response.badRequest({ message: 'Bad Request' });
        }

        try
        {
            await Database
                .from('egresses')
                .whereIn('id', egress)
                .andWhere('school_id', user.school_id)
                .update({ archive_id });

            return response.ok('updated');
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async DettachEgress ({ response, auth, request }: HttpContextContract)
    {
        let { user } = auth,
            { egress } = request.all();

        if (!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        if (!egress || !egress?.length || egress.find(e => isNaN(+e)))
        {
            return response.badRequest({ message: 'Bad Request' });
        }

        try
        {
            await Database
                .from('egresses')
                .whereIn('id', egress)
                .andWhere('school_id', user.school_id)
                .update({ archive_id: null });

            return response.ok('updated');
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }
}

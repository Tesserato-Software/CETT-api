import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';

export default class ArchiveController
{
    public async index ({ response, auth }: HttpContextContract)
    {
        let { user } = auth;

        if (!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        try
        {
            let archives = await Database
                .from('archives')
                .select(
                    'archives.school_id',
                    'archives.id',
                )
                .where('archives.school_id', user.school_id)
                .groupBy('archives.id')
                .orderBy('archives.id', 'asc');

            return response.ok(archives);
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async create ({ response, auth }: HttpContextContract)
    {
        let { user } = auth;

        if(!user) //if u ser is not authenticated
        {
            return response.unauthorized({ message: 'Unauthorized' }); //retorna não autorizado
        }
        if(!user.school_id)
        {
            return response.unauthorized({ message: 'Unauthorized' }); //retorna não autorizado 
        }
        try
        {
            let archives = await Database //tenta inserir dados na tabela archives 
                .insertQuery()
                .table('archives')
                .insert({school_id: user.school_id});

            return response.ok({archives}); //retorna os dados criados
        }
        catch (error) // caso de algum erro 
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' }); //retorna erro de sevidor interno
        }
    }

    public async delete ({ response, auth, params }: HttpContextContract)
    {
        let { user } = auth,
            archive_id = params.id;

        if (!archive_id || isNaN(+archive_id))
        {
            return response.badRequest({ message: 'Bad Request' });
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
            await Database.from('egresses')
                .where('archive_id', archive_id)
                .update({ archive_id: null });

            await Database.from('archives')
                .where('id',archive_id)
                .delete();

            return response.ok({});
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ error });
        }
    }

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
                    .where('archives.id', archive_id)
                    .andWhere('archives.school_id', user.school_id)
                    .groupBy('archives.id')
                    .firstOrFail(),

                egresses = await Database
                    .from('egresses')
                    .select(
                        'egresses.arq_id',
                        'egresses.name',
                        'egresses.archive_id',
                        'egresses.id'
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

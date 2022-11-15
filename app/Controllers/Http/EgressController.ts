/* eslint-disable one-var */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import ListValidator from 'App/Validators/ListValidator';
import { DateTime } from 'luxon';
import { getJsDateFromExcel } from 'excel-date-to-js';
import XLSX from 'xlsx';

export default class EgressController
{
    public async index ({ response, auth, request }: HttpContextContract)
    {
        let { user } = auth;

        if (!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        try
        {
            let pagination, order, filters;

            if(request.method() === 'POST')
            {
                let req = await request.validate(ListValidator);

                pagination = req.pagination;
                order = req.order;
                filters = req.filters;
            }

            let query = await Database
                .from('egresses')
                .select('egresses.*')
                .where('egresses.school_id', user.school_id)
                .groupBy('egresses.id')
                .if((pagination), query =>
                {
                    query.paginate(pagination?.page, pagination?.per_page_limit);
                })
                .if((order), query =>
                {
                    if (order.column)
                    {
                        query.orderBy(order.column, order.direction);
                    }
                    else if (order.columns)
                    {
                        order.columns.forEach((column: string) =>
                        {
                            query.orderBy(column, order.direction);
                        });
                    }
                })
                .if((filters), query =>
                {
                    filters.forEach((filter: any) =>
                    {
                        if (filter.operator === 'like')
                        {
                            query.where(filter.column, filter.operator, `%${filter.value}%`);
                        }
                        if (filter.operator === 'ilike')
                        {
                            query.where(filter.column, 'ilike', `%${filter.value}%`);
                        }
                        else if (filter.operator === 'between')
                        {
                            let [start, end] = filter.value.split(',');

                            query.whereBetween(filter.column, [start, end]);
                        }
                        else if (filter.operator === 'in')
                        {
                            let values = filter.value.split(',');

                            query.whereIn(filter.column, values);
                        }
                        else
                        {
                            query.where(filter.column, filter.operator, filter.value);
                        }
                    });
                });

            return response.ok(query);
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ error });
        }
    }

    public async show ({ response, auth, params }: HttpContextContract)
    {
        let { user } = auth,
            egressId = params.id;

        if (!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        if (!egressId)
        {
            return response.badRequest({ message: 'Missing egress id' });
        }

        try
        {
            let query = await Database
                .from('egresses')
                .select('egresses.*')
                .where('egresses.id', user.id);

            return response.ok(query);
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ error });
        }
    }

    public async store ({ response, auth, request }: HttpContextContract)
    {
        let { user } = auth;

        if (!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        let {
            name,
            CGM_id,
            arq_id,
            birth_date,
            responsible_name,
            archive_id,
        } = request.all();

        if (!name || typeof name !== 'string')
        {
            return response.badRequest('name must be a string');
        }

        if (CGM_id && typeof CGM_id !== 'number')
        {
            return response.badRequest('CGM_id must be a number');
        }

        if (birth_date && DateTime.fromISO(birth_date).isValid === false)
        {
            return response.badRequest('birth_date must be a valid date');
        }

        if (archive_id)
        {
            try
            {
                await Database
                    .from('archives')
                    .where('id', archive_id)
                    .firstOrFail();
            }
            catch (error)
            {
                return response.badRequest('archive_id not found');
            }
        }

        try
        {
            let egress = await Database
                .insertQuery()
                .table('egresses')
                .returning('id')
                .insert({
                    name,
                    CGM_id,
                    arq_id,
                    birth_date,
                    responsible_name,
                    archive_id,
                    school_id: user.school_id,
                });

            return response.ok({ egress });
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ error });
        }
    }

    public async update ({ response, auth, request, params }: HttpContextContract)
    {
        let { user } = auth,
            egress_id = params.id;

        if (!egress_id)
        {
            return response.badRequest('egress id must be a number');
        }

        if (!user || !user.hierarchy_id)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }
        else if (user && user.hierarchy_id)
        {
            try
            {
                let hierarchy = await Database
                    .from('hierarchies')
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

        let {
            name,
            CGM_id,
            arq_id,
            birth_date,
            responsible_name,
            archive_id,
        } = request.all();

        if (!name || typeof name !== 'string')
        {
            return response.badRequest('name must be a string');
        }

        if (CGM_id && typeof CGM_id !== 'number')
        {
            return response.badRequest('CGM_id must be a number');
        }

        if (birth_date && DateTime.fromISO(birth_date).isValid === false)
        {
            return response.badRequest('birth_date must be a valid date');
        }

        if (archive_id)
        {
            try
            {
                await Database
                    .from('archives')
                    .where('id', archive_id)
                    .firstOrFail();
            }
            catch (error)
            {
                return response.badRequest('archive_id not found');
            }
        }

        try
        {
            let egress = await Database
                .query()
                .from('egresses')
                .where('id', egress_id)
                .update({
                    name,
                    CGM_id,
                    arq_id,
                    birth_date,
                    responsible_name,
                    archive_id,
                    last_edit_by: user.id,
                    updated_at: DateTime.now(),
                });

            return response.ok({ egress });
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ error });
        }
    }

    public async destroy ({ response, auth, params }: HttpContextContract)
    {
        let { user } = auth,
            egress_id = params.id;

        if (!egress_id)
        {
            return response.badRequest('egress id must be a number');
        }

        if (!user || !user.hierarchy_id)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }
        else if (user && user.hierarchy_id)
        {
            try
            {
                let hierarchy = await Database
                    .from('hierarchies')
                    .where('id', user.hierarchy_id)
                    .firstOrFail();

                if (!hierarchy?.can_delete)
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
            let egress = await Database
                .from('egresses')
                .where('id', egress_id)
                .delete();

            return response.ok({ egress });
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ error });
        }
    }

    public async DashboardAttachArchive ({ response, auth, params}: HttpContextContract)
    {
        let { user } = auth,
            egress_id = params.id;

        if (!egress_id)
        {
            return response.badRequest('egress id must be a number');
        }

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
                    'egresses.CGM_id',

                )
                .where('egresses.id', egress_id)
                .andWhere('egresses.school_id', user.school_id)
                .groupBy('egresses.id');

            let archives = await Database.from('archives')
                .select('archives.id')
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

    public async DashboardDettachArchive ({response, auth, params}: HttpContextContract)
    {
        let { user } = auth;

        if (!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        try
        {
            let egressesAndArchive = await Database
                .from('egresses')
                .select(
                    'egresses.id',
                    'egresses.name',
                    'egresses.CGM_id',
                    'egresses.archive_id',
                )
                .where('egresses.id', params.id)
                .andWhere('egresses.school_id', user.school_id)
                .groupBy('egresses.id');

            if (egressesAndArchive[0].archive_id === null)
            {
                return response.badRequest({message: 'Egresso não está anexado a nenhum arquivo'});
            }

            return response.ok({egressesAndArchive});
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async AttachArchives ({ response, auth, request, params }: HttpContextContract)
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

    public async DettachArchives ({ response, auth, request }: HttpContextContract)
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

    public async ImportExcel ({response, request, auth}: HttpContextContract)
    {
        let { user } = auth,
            file = request.file('file');

        if (!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        if (!file || !file.tmpPath)
        {
            return response.badRequest({ message: 'Bad Request' });
        }

        try
        {
            // le o arquivo excel
            const workbook = XLSX.readFile(file.tmpPath);
            // pega a primeira aba do arquivo
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            // converte a aba em um array de objetos
            let data = XLSX.utils.sheet_to_json(sheet);

            // percorre o array de objetos
            for (let row of data as any)
            {
                // formata row.aniversario para o formato de data
                row.Aniversário = DateTime
                    .fromISO(
                        getJsDateFromExcel(row.Aniversário).toISOString()
                    )
                    .toFormat('yyyy-MM-dd');

                console.log('row ~ ', row);

                // insere dados no banco
                await Database
                    .table('egresses')
                    .insert({
                        name: row.Nome,
                        CGM_id: row.CGM,
                        arq_id: row.ID,
                        birth_date: row.Aniversário,
                        responsible_name: row.Responsável,
                    });
            }

            return response.ok({ message: 'ok' });
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }
}

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';

export default class SchoolController {
    public async list ({ response, auth }: HttpContextContract) {
        let { user } = auth;

        if(!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }
        try {
            let school = await Database
                .from('school')
                .select(
                    'school.id',
                    'school.name',
                    'school.situacao',
                    // Database.raw(`
                    //     CASE WHEN Count(school.id) > 0
                    //     THEN (
                    //         json_agg (
                    //             json_build_object(
                    //                 'school_id', school.id
                    //                 'situacao_school', school.situacao
                    //             )
                    //         )
                    //     )
                    // ELSE '[]'
                    // END AS 
                    // `)
                )
                .groupBy('school.id');

            return response.ok(school);
        } 
        catch(error) {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error'  });
        }
    }

    public async create({ response, auth, request }: HttpContextContract) {
        let { user } = auth;
        let { name } = request.all();

        if(!user) {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        try {
            let school = await Database
            .insertQuery()
            .table('school')
            .insert({ name })

            return response.ok(school)
        }
        catch(error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async update({ response, auth }: HttpContextContract) {
        let { user } = auth;

        if(!user) {
            return response.unauthorized({ message: 'Unauthorized' });
        }
        
        try {
            let school = await Database
                // .query()
                // .from('school')
                // .where('id', params.id)
                // .update({  })
                .from('school')
                .where('id', 1)
                .update({ name:'Escola Estadual Thiago Terra' })
            
            return response.ok(school)
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async delete({ response, auth }: HttpContextContract) {
        let { user } = auth;

        if(!user) {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        try {
            let school = await Database
                .from('users')
                .where('id', 1)
                .delete()

            return response.ok(school)
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Unauthorized' });
        }
    }
}
/* eslint-disable one-var */
import Hash from '@ioc:Adonis/Core/Hash';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';
import { DateTime } from 'luxon';

export default class UserController
{
    public async AttachHierarchy ({ response, auth, request, params }: HttpContextContract)
    {
        let { user: currentuser } = auth,
            hierarchy_id = params.id,
            { users } = request.all();

        if (!currentuser)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        if (!users.length || users.find((u) => typeof u !== 'number'))
        {
            return response.badRequest('user must be a number array');
        }

        if (isNaN(+hierarchy_id))
        {
            return response.badRequest('hierarchy id must be a number');
        }

        try
        {
            for (let user of users)
            {
                try
                {
                    await Database.from('users').where('id', user).firstOrFail();
                }
                catch (error)
                {
                    return response.badRequest(`user ${user} not found`);
                }
            }

            await Database.from('users').whereIn('id', users).update({ hierarchy_id });

            return response.ok('updated');
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ error });
        }
    }

    public async PswFirstAccess ({ response, auth, request }: HttpContextContract)
    {
        const { user } = auth;
        const { password } = request.all();
        const isInvalidRegister = !password?.length;
        //ADD CREATED_AT DATE
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
            let hashed_pass = User.HashPassword(password),
                adonis__hashed_pass = await Hash.make(password);

            let pass_id = await Database.table('passwords')
                .returning('id')
                .insert({ password: hashed_pass });

            let userFirstAccess = await Database.table('users').returning('id').insert({
                password_id: pass_id[0],
                password: adonis__hashed_pass,
                should_reset_password: false,
            });

            await Database.from('passwords')
                .where('id', pass_id[0])
                .update({ user_id: userFirstAccess[0] });

            return response.ok({ userFirstAccess });
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async PswMod ({ response, auth, request }: HttpContextContract)
    {
        const { user } = auth;
        const { password } = request.all();
        const isInvalidRegister = !password?.length;

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
            let hashed_pass = User.HashPassword(password),
                adonis__hashed_pass = await Hash.make(password);

            let pass_id = await Database.table('passwords')
                .returning('id')
                .insert({ password: hashed_pass });

            let userPswUp = await Database.table('users').returning('id').insert({
                password_id: pass_id[0],
                password: adonis__hashed_pass,
            });

            await Database.from('passwords')
                .where('id', pass_id[0])
                .update({ user_id: userPswUp[0] });

            return response.ok({ userPswUp });
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async pswStorage ({ response, request, params }: HttpContextContract)
    {
        let { password } = request.all(),
            user_id = params.id;

        try
        {
            let hashed_pass = User.HashPassword(password);

            let exists = await Database.from('passwords')
                .where('user_id', user_id)
                .andWhere('password', hashed_pass)
                .first();

            if (exists)
            {
                return response.badRequest({ exists: true });
            }

            let pswNCheck = await Database.from('passwords')
                .count('* as count')
                .where('user_id', user_id);

            if (pswNCheck[0].count >= 3)
            {
                // deleta o com id menor
                let pswToDelete = await Database.from('passwords')
                    .select('id')
                    .where('user_id', user_id)
                    .orderBy('id', 'asc')
                    .first();

                await Database.from('passwords').where('id', pswToDelete.id).delete();
            }

            let pswUp = await Database.table('passwords').returning('id').insert({
                password: hashed_pass,
                user_id: user_id,
                created_at: DateTime.now(),
            });

            await Database.from('users')
                .where('id', user_id)
                .update({
                    password_id: pswUp[0],
                    password: await Hash.make(password),
                    should_reset_password: false,
                });

            return response.ok({ pswUp });
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }
    public async GetUserById ({ response, auth, params }: HttpContextContract)
    {
        const { user } = auth;
        const user_id = params.id;

        if (!user_id)
        {
            return response.badRequest('User id must be a number');
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
            let user = await Database.from('users').select('users.*').where('users.id', user_id);

            return response.ok(user);
        }
        catch (error)
        {
            console.log(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async listDisableds ({ response, auth }: HttpContextContract)
    {
        let { user } = auth;

        if (!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        try
        {
            let users = await Database.from('users')
                .select(
                    'users.id',
                    'users.full_name',
                    'users.email',
                    Database.raw(`
                        json_agg(
                            hierarchies.*
                        ) AS hierarchy
                    `)
                )
                .where('users.school_id', user.school_id)
                .andWhere('users.is_enabled', false)
                .innerJoin('hierarchies', 'hierarchies.id', 'users.hierarchy_id')
                .groupBy('users.id');

            return response.ok(users);
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ error });
        }
    }

    public async renableUser ({ response, auth, params }: HttpContextContract)
    {
        let { user } = auth;

        if (!user)
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

                if (!hierarchy?.can_enable_users)
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
            await Database.from('users').where('id', params.id).update({ is_enabled: true });

            return response.ok({ message: 'User reenabled' });
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ error });
        }
    }

    public async ListUsers ({ response, auth }: HttpContextContract)
    {
        let { user } = auth;

        if (!user)
        {
            return response.unauthorized({ message: 'Unauthorized' });
        }

        try
        {
            let users = await Database.from('users')
                .select(
                    'users.id',
                    'users.full_name',
                    'users.email',
                    Database.raw(`
                        json_agg(
                            hierarchies.*
                        ) AS hierarchy
                    `)
                )
                .where('users.school_id', user.school_id)
                .andWhere('users.is_enabled', true)
                .innerJoin('hierarchies', 'hierarchies.id', 'users.hierarchy_id')
                .groupBy('users.id');

            return response.ok(users);
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async CreateUsers ({ response, auth, request }: HttpContextContract)
    {
        const { user } = auth;
        const { email, full_name, password, hierarchy_id } = request.all();
        const isInvalidRegister = !(
            email?.length ||
            full_name?.length ||
            password?.length ||
            hierarchy_id
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
            let hashed_pass = User.HashPassword(password),
                adonis__hashed_pass = await Hash.make(password);

            let pass_id = await Database.table('passwords').returning('id').insert({
                password: hashed_pass,
                created_at: DateTime.now(),
            });

            let userCreated = await Database.table('users').returning('id').insert({
                full_name,
                email,
                password_id: pass_id[0],
                password: adonis__hashed_pass,
                hierarchy_id,
                school_id: user.school_id,
            });

            await Database.from('passwords')
                .where('id', pass_id[0])
                .update({ user_id: userCreated[0] });

            return response.ok({ userCreated });
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async UpdateUsers ({ response, auth, request, params }: HttpContextContract)
    {
        const { user } = auth;
        const user_id = params.id;
        const { email, full_name, should_reset_password, hierarchy_id, school_id } = request.all();
        const isInvalidRegister = !(
            school_id ||
            email?.length ||
            full_name?.length ||
            typeof should_reset_password === 'boolean' ||
            hierarchy_id
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
            let userUpdated = await Database.from('users').where('id', user_id).update({
                full_name,
                should_reset_password,
                email,
                hierarchy_id,
            });

            return response.ok({ userUpdated });
        }
        catch (error)
        {
            return response.internalServerError({ message: 'Internal Server Error' });
        }
    }

    public async DeleteUsers ({ response, auth, params }: HttpContextContract)
    {
        const { user } = auth;
        const user_id = params.id;

        if (!user_id)
        {
            return response.badRequest('user id must be a number');
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
                    .where('hierarchies.id', user.hierarchy_id)
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
            await Database.from('egresses')
                .where('egresses.last_edit_by', user_id)
                .update({ last_edit_by: null });

            await Database.from('users').where('users.id', user_id).delete();

            return response.ok({});
        }
        catch (error)
        {
            console.error(error);
            return response.internalServerError({ error });
        }
    }
}

/* eslint-disable one-var */
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Hierarchy from 'App/Models/Hierarchy';
import Password from 'App/Models/Password';
import School from 'App/Models/School';
import User from 'App/Models/User';

export default class MakeDev extends BaseSeeder
{
    public async run ()
    {
        let dev_school = await School.create({name: 'DEV'});

        let hierarchy = await Hierarchy
            .create({
                name: 'DEV',
                can_enable_users: true,
                can_delete: true,
                can_update: true,
                school_id: dev_school.id,
            });

        let user = await User
            .create({
                full_name: 'DEV',
                email: `dev@dev.com${hierarchy.id}`,
                hierarchy_id: hierarchy.id,
                school_id: dev_school.id,
                is_enabled: true,
                should_reset_password: false,
                password:
                    '$argon2id$v=19$t=3,m=4096,p=1$f0uT5fFVrMGXA2pGbq+SCg$iUBrgB6wnm1epwOBljfyOIWQT9yvmaMM1whoNF+KShA',
                is_super_user: true,
            });

        let password = await Password
            .create({
                password: '110001 110010 110011 1000000 1100100 1100101 1110110 110001 110010 110011',
                user_id: user.id,
            });

        user.password_id = password.id;
        await user.save();

        console.log('[DEV] DEV CREATED');
    }
}

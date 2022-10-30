import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';

export default class PolicyPrepare
{
    public async handle ({ auth }: HttpContextContract, next: () => Promise<void>)
    {
        // getting authenticated user
        const user = auth.user;

        // only works if user exists
        if(user)
        {
            // load the school of user
            await user.load('school');

            if(!user.school)
            {
                Logger.warn('noSchoolVinculated');
            };

            await next();
        }
    }
}

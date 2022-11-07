import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Hierarchy from 'App/Models/Hierarchy';
import School from 'App/Models/School';
import { DateTime } from 'ts-luxon';

export default class User extends BaseModel
{
    @column({ isPrimary: true })
    public id: number;

    @column()
    public full_name: string;

    @column()
    public password: string;

    @column()
    public email: string;

    @column()
    public hierarchy_id: number;

    @column()
    public school_id: number;

    @column()
    public first_access: DateTime;

    /* relations */
    @belongsTo(() => Hierarchy, {
        localKey: 'id',
        foreignKey: 'hierarchy_id',
    })
    public hirarchy: BelongsTo<typeof Hierarchy>;

    @belongsTo(() => School, {
        localKey: 'id',
        foreignKey: 'school_id',
    })
    public school: BelongsTo<typeof School>;

    public static HashPassword (pass: string)
    {
        let pswC = pass.split('');
        for (let i = pswC.length; i > 0; i--)
        {
            pswC[i] = pswC[-i];
            let pswE = parseInt(pswC[i], 10);
            return pswE;
        }
    }
}

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
    public hirarchy_id: number;

    @column()
    public school_id: number;

    @column()
    public first_acess: DateTime;

    /* relations */
    @belongsTo(() => Hierarchy, {
        localKey: 'id',
        foreignKey: 'hirarchy_id',
    })
    public hirarchy: BelongsTo<typeof Hierarchy>;

    @belongsTo(() => School, {
        localKey: 'id',
        foreignKey: 'school_id',
    })
    public school: BelongsTo<typeof School>;
}

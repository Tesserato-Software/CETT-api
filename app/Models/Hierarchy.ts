import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import School from 'App/Models/School';
import User from 'App/Models/User';

export default class Hierarchy extends BaseModel
{
    @column({ isPrimary: true })
    public id: number;

    @column()
    public name: string;

    @column()
    public can_delete: boolean;

    @column()
    public can_update: boolean;

    @column()
    public school_id: number;

    /* relations */
    @hasMany(() => User, { foreignKey: 'hierarchy_id' })
    public users: HasMany<typeof User>;

    @belongsTo(() => School, {
        localKey: 'id',
        foreignKey: 'school_id',
    })
    public school: BelongsTo<typeof School>;
}

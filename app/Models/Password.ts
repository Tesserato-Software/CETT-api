import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import User from 'App/Models/User';
import { DateTime } from 'luxon';

export default class Password extends BaseModel
{
    @column({ isPrimary: true })
    public id: number;

    @column()
    public user_id: number;

    @column()
    public password: string;

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime;

    // RELATIONS
    @belongsTo(() => User, {
        localKey: 'id',
        foreignKey: 'password_id',
    })
    public user: BelongsTo<typeof User>;
}

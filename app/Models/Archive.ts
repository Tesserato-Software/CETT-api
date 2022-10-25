import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import Egress from 'App/Models/Egress';
import School from 'App/Models/School';

export default class Archive extends BaseModel
{
    @column({ isPrimary: true })
    public id: number;

    @column()
    public school_id: number;

    /* relations */
    @hasMany(() => Egress, { foreignKey: 'archive_id' })
    public egress: HasMany<typeof Egress>;

    @belongsTo(() => School, { foreignKey: 'school_id' })
    public school: BelongsTo<typeof School>;
}

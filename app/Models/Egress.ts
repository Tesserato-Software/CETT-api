import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Archive from 'App/Models/Archive';
import School from 'App/Models/School';
import User from 'App/Models/User';

export default class Egress extends BaseModel
{
    @column({ isPrimary: true })
    public id: number;

    @column()
    public name?: string;

    @column()
    public CGM_id?: number;

    @column()
    public arq_id: number;

    @column()
    public birth_date?: Date;

    @column()
    public responsible_name?: string;

    @column()
    public last_edit_by?: number;

    @column()
    public archive_id?: number;

    @column()
    public school_id: number;

    @column()
    public updated_at: Date;

    /* relations */
    @belongsTo(() => User, { foreignKey: 'last_edit_by' })
    public last_edit: BelongsTo<typeof User>;

    @belongsTo(() => Archive, { foreignKey: 'archive_id' })
    public archive: BelongsTo<typeof Archive>;

    @belongsTo(() => School, { foreignKey: 'school_id' })
    public school: BelongsTo<typeof School>;
}

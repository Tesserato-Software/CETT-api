import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import Archive from 'App/Models/Archive';
import Egress from 'App/Models/Egress';
import Hierarchy from 'App/Models/Hierarchy';
import User from 'App/Models/User';

export default class School extends BaseModel
{
    @column({ isPrimary: true })
    public id: number;

    @column()
    public name: string;

    /* relations */
    @hasMany(() => User, { foreignKey: 'school_id' })
    public users: HasMany<typeof User>;

    @hasMany(() => Hierarchy, { foreignKey: 'school_id' })
    public hierarchy: HasMany<typeof Hierarchy>;

    @hasMany(() => Egress, { foreignKey: 'school_id' })
    public egress: HasMany<typeof Egress>;

    @hasMany(() => Archive, { foreignKey: 'school_id' })
    public archives: HasMany<typeof Archive>;
}

/* eslint-disable one-var */
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import Hierarchy from 'App/Models/Hierarchy';
import Password from 'App/Models/Password';
import School from 'App/Models/School';

export default class User extends BaseModel
{
    @column({ isPrimary: true })
    public id: number;

    @column()
    public full_name: string;

    @column()
    public password: string;

    @column()
    public password_id?: number;

    @column()
    public email: string;

    @column()
    public hierarchy_id: number;

    @column()
    public school_id: number;

    @column()
    public should_reset_password: boolean;

    @column()
    public is_enabled: boolean;

    @column()
    public is_super_user: boolean;

    /* relations */
    @hasMany(() => Password, {
        foreignKey: 'user_id',
    })
    public passwords: HasMany<typeof Password>;

    @belongsTo(() => Hierarchy, {
        localKey: 'id',
        foreignKey: 'hierarchy_id',
    })
    public hierarchy: BelongsTo<typeof Hierarchy>;

    @belongsTo(() => School, {
        localKey: 'id',
        foreignKey: 'school_id',
    })
    public school: BelongsTo<typeof School>;

    public static HashPassword (pass: string)
    {
        let root_pass = pass,
            new_pass = '';

        for (let i = 0; i < root_pass.length; i++)
        {
            let bin = root_pass[i].charCodeAt(0).toString(2);

            if (bin)
            {
                new_pass += bin + (((i + 1) === root_pass.length) ? '' : ' ');
            }
        }

        return new_pass;
    }

    public static CompareHash (hashed_pass: string, pass: string)
    {
        let char_pass = '',
            char_splited = hashed_pass.split(' ');

        for (let bin of char_splited)
        {
            char_pass += String.fromCharCode(parseInt(bin, 2));
        }

        return char_pass === pass;
    }
}

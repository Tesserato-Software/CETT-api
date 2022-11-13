/* eslint-disable one-var */
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import Hierarchy from 'App/Models/Hierarchy';
import Password from 'App/Models/Password';
import School from 'App/Models/School';
import { DateTime } from 'ts-luxon';

export default class User extends BaseModel
{
    @column({ isPrimary: true })
    public id: number;

    @column()
    public full_name: string;

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

    @hasMany(() => Password, { foreignKey: 'password_id' })
    public passwords: HasMany<typeof Password>;

    public static HashPassword (pass: string)
    {
        /*
            O Aluno deverá criar um algoritmo 
            para "criptografar" a senha no banco 
            de dados utilizando conceitos de 
            criptografia simétrica ou então 
            assimétrica.

            Deverá fazer o uso de funções e 
            vetores/matrizes. Não deve copiar algoritmos prontos da Internet nem fazer uso de bibliotecas/funções 
            que trazem 
            o resultado pronto. Poderá, no entanto, fazer uso de funções das bibliotecas do PHP que localizem 
            caracteres,
            contem caracteres e outras semelhantes as encontradas na biblioteca string.h da Linguagem C.
        */

        let root_pass = pass,
            new_pass = '';

        for (let i = 0; i < root_pass.length; i++)
        {
            // conver to binary WITHOUT charCodeAt
            let binary;
            for (let j = 0; j < root_pass[i].length; j++)
            {
                binary += root_pass[i][j].toString();

                // add 0 to the left
                if (binary.length < 8)
                {
                    binary = '0' + binary;
                }

                // add 1 to the right
                if (binary.length < 8)
                {
                    binary += '1';
                }
            }

            new_pass += binary;
        }

        console.log('🚀 ~ file: User.ts ~ line 60 ~ new_pass', new_pass);
    }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Passwords extends BaseSchema
{
    protected tableName = 'users';

    public async up ()
    {
        this.schema.alterTable(this.tableName, (table) =>
        {
            table
                .string('password')
                .notNullable()
                .defaultTo(
                    '$argon2id$v=19$t=3,m=4096,p=1$f0uT5fFVrMGXA2pGbq+SCg$iUBrgB6wnm1epwOBljfyOIWQT9yvmaMM1whoNF+KShA'
                );
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

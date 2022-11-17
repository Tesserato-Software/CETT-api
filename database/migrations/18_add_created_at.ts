import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Passwords extends BaseSchema
{
    protected tableName = 'passwords';

    public async up ()
    {
        this.schema.alterTable(this.tableName, (table) =>
        {
            table.dateTime('created_at').notNullable().defaultTo(this.now());
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

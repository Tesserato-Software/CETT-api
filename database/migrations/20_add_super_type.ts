import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Users extends BaseSchema
{
    protected tableName = 'users';

    public async up ()
    {
        this.schema.alterTable(this.tableName, (table) =>
        {
            table.boolean('is_super_user').defaultTo(false);
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

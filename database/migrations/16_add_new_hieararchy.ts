import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Hierarchies extends BaseSchema
{
    protected tableName = 'hierarchies';

    public async up ()
    {
        this.schema.alterTable(this.tableName, (table) =>
        {
            table.boolean('can_enable_users').defaultTo(false);
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

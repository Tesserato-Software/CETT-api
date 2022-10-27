import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Hierarchy extends BaseSchema
{
    protected tableName = 'hierarchies';

    public async up ()
    {
        this.schema.createTable(this.tableName, (table) =>
        {
            table.increments('id').primary();
            table.string('name', 255).notNullable();
            table.boolean('can_delete').notNullable();
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

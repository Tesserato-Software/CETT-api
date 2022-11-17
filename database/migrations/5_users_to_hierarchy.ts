import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Users extends BaseSchema
{
    protected tableName = 'users';

    public async up ()
    {
        this.schema.alterTable(this.tableName, (table) =>
        {
            table
                .integer('hierarchy_id')
                .unsigned()
                .references('id')
                .inTable('hierarchies')
                .onDelete('CASCADE');
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

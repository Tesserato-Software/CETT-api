import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Hierarchy extends BaseSchema
{
    protected tableName = 'hierarchies';

    public async up ()
    {
        this.schema.alterTable(this.tableName, (table) =>
        {
            table
                .integer('school_id')
                .unsigned()
                .references('id')
                .inTable('schools')
                .onDelete('CASCADE');

            table.boolean('can_update').defaultTo(false);
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

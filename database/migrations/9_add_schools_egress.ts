import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Egress extends BaseSchema
{
    protected tableName = 'egresses';

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

            table.dateTime('updated_at').nullable();
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

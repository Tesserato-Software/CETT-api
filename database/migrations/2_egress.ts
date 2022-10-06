import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Egress extends BaseSchema
{
    protected tableName = 'egress';

    public async up ()
    {
        this.schema.createTable(this.tableName, (table) =>
        {
            table.increments('id').primary();
            table.string('name', 255);
            table.integer('CGM_id').unique();
            table.integer('arq_id').unique();

            table.dateTime('birth_date');

            table.string('responsible_name', 255);

            table
                .integer('last_edit_by')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

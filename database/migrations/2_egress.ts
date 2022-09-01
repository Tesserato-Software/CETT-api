import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Users extends BaseSchema
{
    protected tableName = 'egress';

    public async up ()
    {
        this.schema.createTable(this.tableName, (table) =>
        {
            table.increments('id').primary();
            table.string('name', 255).notNullable();
            table.integer('CGM_id').unique().notNullable();
            table.integer('arq_id').unique().notNullable();

            table.dateTime('birth_date').notNullable();

            table.string('responsible_name', 255).nullable();
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

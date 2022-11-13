import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Passwords extends BaseSchema
{
    protected tableName = 'passwords';

    public async up ()
    {
        this.schema.createTable(this.tableName, (table) =>
        {
            table.increments('id').primary();

            table.string('password').notNullable();

            table
                .integer('user_id')
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

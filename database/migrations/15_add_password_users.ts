import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Users extends BaseSchema
{
    protected tableName = 'users';

    public async up ()
    {
        this.schema.alterTable(this.tableName, (table) =>
        {
            table.dropColumn('password');
            table.dropColumn('first_access');

            table.boolean('is_enabled').defaultTo(true);

            table
                .integer('password_id')
                .unsigned()
                .references('id')
                .inTable('passwords')
                .onDelete('SET NULL');

            table.boolean('should_reset_password').defaultTo(true);
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

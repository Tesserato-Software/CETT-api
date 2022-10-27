import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Users extends BaseSchema
{
    protected tableName = 'users';

    public async up ()
    {
        this.schema.alterTable(this.tableName, (table) =>
        {
            /* relação para escolha */
            table
                .integer('school_id')
                .unsigned()
                .references('id')
                .inTable('schools')
                .onDelete('CASCADE');
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

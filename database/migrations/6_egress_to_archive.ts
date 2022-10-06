import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Egress extends BaseSchema
{
    protected tableName = 'egress';

    public async up ()
    {
        this.schema.alterTable(this.tableName, (table) =>
        {
            table
                .integer('archive_id')
                .unsigned()
                .references('id')
                .inTable('archive');
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

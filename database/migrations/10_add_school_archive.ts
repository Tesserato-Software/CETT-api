import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Archive extends BaseSchema
{
    protected tableName = 'archive';

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
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

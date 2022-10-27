import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Archive extends BaseSchema
{
    protected tableName = 'archivies';

    public async up ()
    {
        this.schema.createTable(this.tableName, (table) =>
        {
            table.increments('id').primary();
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

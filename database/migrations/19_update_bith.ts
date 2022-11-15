import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Egress extends BaseSchema
{
    protected tableName = 'egresses';

    public async up ()
    {
        this.schema.alterTable(this.tableName, (table) =>
        {
            table.date('birth_date').alter();
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

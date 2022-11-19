import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Egress extends BaseSchema
{
    protected tableName = 'egresses';

    public async up ()
    {
        this.schema.alterTable(this.tableName, (table) =>
        {
            return table.dropUnique(['CGM_id']);
        });
    }

    public async down ()
    {
        this.schema.dropTable(this.tableName);
    }
}

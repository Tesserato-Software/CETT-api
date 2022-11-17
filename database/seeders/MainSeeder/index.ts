import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Logger from '@ioc:Adonis/Core/Logger';

export default class IndexSeeder extends BaseSeeder
{
    private async runSeeder (seeder: { default: typeof BaseSeeder })
    {
        await new seeder.default(this.client).run();
    }

    public async run ()
    {
        await this.runSeeder(await import('../DEV/index'));
        Logger.info('AttachmentType Seeder Ran');
    }
}

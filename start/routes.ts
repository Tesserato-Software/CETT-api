// DEBUG:QUERIES
import Event from '@ioc:Adonis/Core/Event';
import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import Route from '@ioc:Adonis/Core/Route';
import Database from '@ioc:Adonis/Lucid/Database';
// importing files
import './routes/Hierarchy';
import './routes/Auth';
import './routes/Archive';
import './routes/Egress';
import './routes/User';
import './routes/Password';
import './routes/School';

// Health Check
Route.get('health', async ({ response }) =>
{
    const report = await HealthCheck.getReport();
    return report.healthy ? response.ok(report) : response.badRequest(report);
});

Route.get('/', async () =>
{
    return { status: 'hello world' };
});

Event.on('db:query', Database.prettyPrint);

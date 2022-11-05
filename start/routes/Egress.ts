import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- Egress ----------------------------------- */
Route.group(() =>
{
    // GET /egress
    Route.get('dashboard-attach-archive', 'EgressController.DashboardAttachArchive');
}).prefix('egress').middleware(['auth']);

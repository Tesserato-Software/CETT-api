import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- Egress ----------------------------------- */
Route.group(() =>
{
    Route.patch('attach-archives', 'EgressController.AttachArchives');
    Route.get('dashboard-attach-archive', 'EgressController.DashboardAttachArchive');
}).prefix('egress').middleware(['auth']);


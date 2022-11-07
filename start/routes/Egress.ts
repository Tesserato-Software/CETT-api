import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- Egress ----------------------------------- */
Route.group(() =>
{
    Route.patch('dettach-archives', 'EgressController.DettachArchives');
    Route.patch('attach-archives/:id', 'EgressController.AttachArchives');
    Route.get('dashboard-attach-archive', 'EgressController.DashboardAttachArchive');
}).prefix('egress').middleware(['auth']);


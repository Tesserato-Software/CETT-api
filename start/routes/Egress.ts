import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- Egress ----------------------------------- */
Route.group(() =>
{
    // POST
    Route.post('create', 'EgressController.store');
    Route.post('list', 'EgressController.index');
    Route.post('update/:id', 'EgressController.update');

    // GET
    Route.get('dashboard-attach-archive/:id', 'EgressController.DashboardAttachArchive');
    Route.get('dashboard-dettach-archive/:id', 'EgressController.DashboardDettachArchive');
    Route.get('list', 'EgressController.index');
    Route.get('show/:id', 'EgressController.show');

    // DELETE
    Route.delete('delete/:id', 'EgressController.destroy');

    // PATCH
    Route.patch('dettach-archives', 'EgressController.DettachArchives');
    Route.patch('attach-archives/:id', 'EgressController.AttachArchives');
}).prefix('egress').middleware(['auth']);

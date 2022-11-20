import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- Egress ----------------------------------- */
Route.group(() =>
{
    // POST
    Route.post('create', 'EgressController.store');
    Route.post('list', 'EgressController.index');
    Route.post('list-deleteds', 'EgressController.listDeleteds');
    Route.post('update/:id', 'EgressController.update');

    Route.post('hard-delete/:id', 'EgressController.hardDelete');
    Route.post('delete/:id', 'EgressController.destroy');

    Route.post('restore/:id', 'EgressController.restore');

    Route.post('import-excel', 'EgressController.ImportExcel');

    Route.post('dettach-archives', 'EgressController.DettachArchives');
    Route.post('attach-archives/:id', 'EgressController.AttachArchives');

    // GET
    Route.get('dashboard-attach-archive/:id', 'EgressController.DashboardAttachArchive');
    Route.get('dashboard-dettach-archive/:id', 'EgressController.DashboardDettachArchive');
    Route.get('list', 'EgressController.index');
    Route.get('show/:id', 'EgressController.show');
}).prefix('egress').middleware(['auth']);

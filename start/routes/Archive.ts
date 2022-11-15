import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- ARCHIVE ----------------------------------- */
Route.group(() =>
{
    // GET /archive
    Route.get('list', 'ArchiveController.index');
    Route.get('dashboard-attach-egress/:id','ArchiveController.DashBoardAttachEgress');
    Route.get('dashboard-dattach-egress/:id','ArchiveController.DashBoardDettachEgress');

    // POST /archive
    Route.post('create','ArchiveController.create');
    Route.post('dettach-egress','ArchiveController.DettachEgress');
    Route.post('attach-egress/:id','ArchiveController.AttachEgress');
    // DELETE /archive
    Route.delete('delete/:id','ArchiveController.delete');
}).prefix('archive').middleware(['auth']);

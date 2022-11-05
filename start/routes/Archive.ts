import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- ARCHIVE ----------------------------------- */
Route.group(() =>
{
    // GET /archive
    Route.get('list', 'ArchiveController.index');
    Route.get('dashboard-attach-egress','ArchiveController.DashBoardAttachEgress');
}).prefix('archive').middleware(['auth']);

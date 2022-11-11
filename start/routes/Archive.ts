import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- ARCHIVE ----------------------------------- */
Route.group(() =>
{
    // GET /archive
    Route.get('list', 'ArchiveController.index');
    Route.get('dashboard-attach-egress/:id','ArchiveController.DashBoardAttachEgress');
    // Patch /archive
    Route.patch('dettach-egress','ArchiveController.DettachEgress');
    Route.patch('attach-egress/:id','ArchiveController.AttachEgress');
}).prefix('archive').middleware(['auth']);

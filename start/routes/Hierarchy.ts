import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- HIERARCHY ----------------------------------- */
Route.group(() =>
{
    // GET /hierarchy
    Route.get('list', 'HierarchyController.index');
}).prefix('hierarchy').middleware(['auth']);

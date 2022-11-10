import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- HIERARCHY ----------------------------------- */
Route.group(() =>
{
    // GET /hierarchy
    Route.get('list', 'HierarchyController.index');

    // POST /hierarchy
    Route.post('create', 'HierarchyController.create');
}).prefix('hierarchy').middleware(['auth']);


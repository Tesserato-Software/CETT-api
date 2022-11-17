import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- HIERARCHY ----------------------------------- */
Route.group(() =>
{
    // GET /hierarchy
    Route.get('list', 'HierarchyController.index');
    Route.get('show/:id', 'HierarchyController.show');
    Route.get('get-hierarchy/:id', 'HierarchyController.GetHierarchyById');

    // POST /hierarchy
    Route.post('create', 'HierarchyController.create');

    // PUT /hierarchy
    Route.put('update/:id', 'HierarchyController.update');

    // DELETE /hierarchy
    Route.delete('delete/:id', 'HierarchyController.delete');
}).prefix('hierarchy').middleware(['auth']);


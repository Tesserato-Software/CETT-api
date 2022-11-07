import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- USER ----------------------------------- */

Route.group(() =>
{
    // GET /user
    Route.post('user-hierarchy/:id', 'UserController.AttachHierarchy');
}).prefix('user').middleware(['auth']);

import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- USER ----------------------------------- */

Route.group(() =>
{
    // GET / list users
    Route.get('list', 'UserController.ListUsers');
    // POST / create users
    Route.post('create', 'UserController.CreateUsers');
    // PUT / update users
    Route.put('update/:id', 'UserController.UpdateUsers');
    // GET /user
    Route.post('user-hierarchy/:id', 'UserController.AttachHierarchy');
    Route.post('psw-fa', 'UserController.PswFirstAccess');
    Route.post('psw-mod', 'UserController.PswMod');
}).prefix('user').middleware(['auth']);

import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- USER ----------------------------------- */

Route.group(() =>
{
    // GET /user
    Route.post('user-hierarchy/:id', 'UserController.AttachHierarchy');
    Route.post('psw-fa', 'UserController.PswFirstAccess');
    Route.post('psw-mod', 'UserController.PswMod');
}).prefix('user').middleware(['auth']);

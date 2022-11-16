import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- USER ----------------------------------- */

Route.group(() =>
{
    // GET / list users
    Route.get('list', 'UserController.ListUsers');
    // GET / get user by id
    Route.get('get-user/:id', 'UserController.GetUserById');
    Route.get('list-disableds', 'UserController.listDisableds');
    // POST / create users
    Route.post('create', 'UserController.CreateUsers');
    Route.post('re-enable/:id', 'UserController.renableUser');
    // PUT / update users
    Route.put('update/:id', 'UserController.UpdateUsers');
    // DELETE / delete users
    Route.delete('delete/:id', 'UserController.DeleteUsers');
    // GET /user
    Route.post('user-hierarchy/:id', 'UserController.AttachHierarchy');
    Route.post('psw-fa/:id', 'UserController.PswFirstAccess');
    Route.post('psw-mod/:id', 'UserController.PswMod');
    Route.post('psw-storage/:id', 'UserController.pswStorage');
}).prefix('user').middleware(['auth']);

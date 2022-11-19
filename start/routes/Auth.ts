import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- AUTH ----------------------------------- */
Route.group(() =>
{
    // POST
    Route.post('login', 'AuthController.login');

    Route.get('get-user-data', 'AuthController.getUserData');

    Route.post('login-failure', 'AuthController.LoginFailureLimit');
}).prefix('auth');

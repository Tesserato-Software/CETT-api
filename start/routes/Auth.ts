import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- AUTH ----------------------------------- */
Route.group(() =>
{
    // POST
    Route.post('login', 'AuthController.login');
}).prefix('auth');

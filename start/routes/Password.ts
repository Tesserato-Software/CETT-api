import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- Password  ----------------------------------- */

Route.group(() =>
{
    //POST
    Route.post('hash', 'PasswordController.hash');
}).prefix('password').middleware(['auth']);

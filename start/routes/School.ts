import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- SCHOOL ----------------------------------- */

Route.group(() => 
{
    //GET /school
    Route.get('list', 'SchoolController.list');
    //POST /school
    Route.post('create', 'SchoolController.create');
    //PUT /school
    Route.put('update', 'SchoolController.update');
    //DELETE /school
    Route.delete('delete', 'SchoolController.delete');
}).prefix('school').middleware(['auth']);

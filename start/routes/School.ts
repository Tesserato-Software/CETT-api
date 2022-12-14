import Route from '@ioc:Adonis/Core/Route';

/* --------------------------------- SCHOOL ----------------------------------- */

Route.group(() =>
{
    //GET /school
    Route.get('list', 'SchoolController.list');
    // GET / get school by id
    Route.get('get-school/:id', 'SchoolController.GetSchoolById');
    //POST /school
    Route.post('create', 'SchoolController.create');
    //PUT /school
    Route.put('update/:id', 'SchoolController.update');
    //DELETE /school
    Route.delete('delete/:id', 'SchoolController.delete');
}).prefix('school').middleware(['auth']);

/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import CategoriesController from '#controllers/categories_controller'
import ArticlesController from '#controllers/articles_controller'
import UsersController from '#controllers/users_controller'

router.on('/').render('pages/home')
router.resource('category', CategoriesController)
router.resource('/article', ArticlesController)
router.post('register', 'users_controller.register')
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
// import UsersController from '#controllers/users_controller'
import AuthController from '#controllers/auth_controller'
import KontakController from '#controllers/kontaks_controller'

router.on('/').render('pages/home')
router.resource('category', CategoriesController)
router.get('/article', [ArticlesController, 'index'])
router.get('/article/:slug', [ArticlesController, 'show'])
router.post('/article', [ArticlesController, 'store'])
router.put('/article/:id', [ArticlesController, 'update'])
router.delete('/article/:id', [ArticlesController, 'destroy'])

router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router.get('/me', [AuthController, 'me']).middleware('auth')

router.post('/kontak', [KontakController, 'kirimPesan'])
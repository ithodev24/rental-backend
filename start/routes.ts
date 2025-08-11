import router from '@adonisjs/core/services/router'
import ArticlesController from '#controllers/articles_controller'
import KontakController from '#controllers/kontaks_controller'
import ArticleViewsController from '#controllers/article_views_controller'

// Public routes
router.on('/').render('pages/home')
router.get('/article', [ArticlesController, 'index'])
router.get('/article/:slug', [ArticlesController, 'show'])
router.post('/article', [ArticlesController, 'store'])
router.put('/article/:id', [ArticlesController, 'update'])
router.delete('/article/:id', [ArticlesController, 'destroy'])

router.post('/kontak', [KontakController, 'kirimPesan'])

router.get('/article-views', [ArticleViewsController, 'index'])
import Article from '#models/article'
import type { HttpContext } from '@adonisjs/core/http'
import { schema, rules } from '@adonisjs/validator'

export default class ArticlesController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    try {
      const article = await Article.query().where({ dihapus: 0 })
      return article
    } catch (error) {
      return { message: 'Gagal mengambil data Article' }
    }
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validate({
      schema: schema.create({
        title: schema.string({}, [rules.required()]),
        slug: schema.string({}, [rules.required()]),
        content: schema.string({}, [rules.required()]),
        status: schema.boolean(),
        thumbnail: schema.string({}, [rules.required()]),
        publishedAt: schema.date({}, [rules.required()]),
        categoryId: schema.number([rules.required()]),
        userId: schema.number([rules.required()]),
      }),
      messages: {
        'title.required': 'Judul kategori harus diisi',
        'slug.required': 'Slug kategori harus diisi',
        'content.required': 'Konten kategori harus diisi',
        'status.required': 'Status kategori harus diisi',
        'thumbnail.required': 'Thumbnail kategori harus diisi',
        'publishedAt.required': 'Tanggal kategori harus diisi',
        'categoryId.required': 'Kategori kategori harus diisi',
        'userId.required': 'User kategori harus diisi',
      },
    })

    const slugUsed = await Article.findBy('slug', payload.slug)

    const errors = [slugUsed && { field: 'slug', message: 'Slug artikel sudah digunakan' }].filter(
      Boolean
    )

    if (errors.length) {
      return response.unprocessableEntity({ errors })
    }

    const article = await Article.create(payload)

    return {
      article,
      message: 'Article Berhasil Ditambahkan',
    }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    try {
      const article = await Article.query().where({ id: params.id, dihapus: 0 }).first()
      return article
    } catch (error) {
      return { message: 'Artikel tidak ditemukan' }
    }
  }

  /**
   * Edit individual record
   */
  async edit({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response, params }: HttpContext) {
    const payload = await request.validate({
      schema: schema.create({
        title: schema.string({}, [rules.required()]),
        slug: schema.string({}, [rules.required()]),
        content: schema.string({}, [rules.required()]),
        status: schema.boolean(),
        thumbnail: schema.string({}, [rules.required()]),
        publishedAt: schema.date({}, [rules.required()]),
        categoryId: schema.number([rules.required()]),
        // userId: schema.number([rules.required()]),
      }),
      messages: {
        'title.required': 'Judul kategori harus diisi',
        'slug.required': 'Slug kategori harus diisi',
        'content.required': 'Konten kategori harus diisi',
        'status.required': 'Status kategori harus diisi',
        'thumbnail.required': 'Thumbnail kategori harus diisi',
        'publishedAt.required': 'Tanggal kategori harus diisi',
        'categoryId.required': 'Kategori kategori harus diisi',
        // 'userId.required': 'User kategori harus diisi',
      },
    })

    const article = await Article.findOrFail(params.id)

    const slugUsed = await Article.query()
      .where('slug', payload.slug)
      .whereNot('id', article.id)
      .first()

    const errors = [slugUsed && { field: 'slug', message: 'Slug artikel sudah digunakan' }].filter(
      Boolean
    )

    if (errors.length) {
      return response.unprocessableEntity({ errors })
    }

    article.merge(payload)
    await article.save()

    return {
      article,
      message: 'Article Berhasil Diupdate',
    }
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    try {
      const article = await Article.query().where({ id: params.id }).update({ dihapus: 1 })
      return { article, message: 'Artikel berhasil dihapus!' }
    } catch (error) {
      return { message: 'Gagal menghapus artikel' }
    }
  }
}

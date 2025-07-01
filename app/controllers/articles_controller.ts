import Article from '#models/article'
import type { HttpContext } from '@adonisjs/core/http'
import { schema, rules } from '@adonisjs/validator'
import { promises as fs } from 'fs'
import { join } from 'path'

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
  public async store({ request, response }: HttpContext) {
    const payload = await request.validate({
      schema: schema.create({
        title: schema.string({}, [rules.required()]),
        slug: schema.string({}, [rules.required()]),
        content: schema.string({}, [rules.required()]),
        status: schema.boolean(),
        thumbnail: schema.file(
          {
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png'],
          },
          [rules.required()]
        ),
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
        'thumbnail.file.size': 'Ukuran thumbnail tidak boleh lebih dari 2MB',
        'thumbnail.file.extname': 'Format thumbnail harus jpg, jpeg, atau png',
        'publishedAt.required': 'Tanggal kategori harus diisi',
        'categoryId.required': 'Kategori kategori harus diisi',
        'userId.required': 'User kategori harus diisi',
      },
    })

    const slugUsed = await Article.findBy('slug', payload.slug)
    if (slugUsed) {
      return response.unprocessableEntity({
        errors: [{ field: 'slug', message: 'Slug artikel sudah digunakan' }],
      })
    }

    const thumbnail = payload.thumbnail
    const fileName = `${Date.now()}_${thumbnail.clientName}`
    const uploadDir = join('public', 'uploads')
    const publicUrl = `/uploads/${fileName}`

    await fs.mkdir(uploadDir, { recursive: true })

    // Pindahkan file ke folder public/uploads
    await thumbnail.move(uploadDir, {
      name: fileName,
      overwrite: true,
    })

    const article = await Article.create({
      title: payload.title,
      slug: payload.slug,
      content: payload.content,
      status: payload.status,
      thumbnail: publicUrl,
      publishedAt: payload.publishedAt,
      categoryId: payload.categoryId,
      userId: payload.userId,
    })

    return response.created({
      article,
      message: 'Artikel berhasil ditambahkan',
    })
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const article = await Article.query().where({ slug: params.slug, dihapus: 0 }).first()

    if (!article) {
      return response.notFound({ message: 'Artikel tidak ditemukan' })
    }

    return article
  }

  /**
   * Edit individual record
   */
  async edit({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response, params }: HttpContext) {
    const article = await Article.findOrFail(params.id)

    const payload = await request.validate({
      schema: schema.create({
        title: schema.string({}, [rules.required()]),
        slug: schema.string({}, [rules.required()]),
        content: schema.string({}, [rules.required()]),
        status: schema.boolean(),
        thumbnail: schema.file.optional({
          size: '2mb',
          extnames: ['jpg', 'jpeg', 'png'],
        }),
        publishedAt: schema.date({}, [rules.required()]),
        categoryId: schema.number([rules.required()]),
      }),
      messages: {
        'title.required': 'Judul kategori harus diisi',
        'slug.required': 'Slug kategori harus diisi',
        'content.required': 'Konten kategori harus diisi',
        'status.required': 'Status kategori harus diisi',
        'thumbnail.file.size': 'Ukuran thumbnail tidak boleh lebih dari 2MB',
        'thumbnail.file.extname': 'Format thumbnail harus jpg, jpeg, atau png',
        'publishedAt.required': 'Tanggal kategori harus diisi',
        'categoryId.required': 'Kategori kategori harus diisi',
      },
    })

    const slugUsed = await Article.query()
      .where('slug', payload.slug)
      .whereNot('id', article.id)
      .first()

    if (slugUsed) {
      return response.unprocessableEntity({
        errors: [{ field: 'slug', message: 'Slug artikel sudah digunakan' }],
      })
    }

    let newThumbnailUrl = article.thumbnail
    if (payload.thumbnail) {
      const fileName = `${Date.now()}_${payload.thumbnail.clientName}`
      const uploadDir = join('public', 'uploads')
      const publicUrl = `/uploads/${fileName}`

      await fs.mkdir(uploadDir, { recursive: true })

      await payload.thumbnail.move(uploadDir, {
        name: fileName,
        overwrite: true,
      })

      newThumbnailUrl = publicUrl
    }

    article.merge({
      title: payload.title,
      slug: payload.slug,
      content: payload.content,
      status: payload.status,
      thumbnail: newThumbnailUrl,
      publishedAt: payload.publishedAt,
      categoryId: payload.categoryId,
    })

    await article.save()

    return {
      article,
      message: 'Artikel berhasil diupdate',
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

import Article from '#models/article'
import type { HttpContext } from '@adonisjs/core/http'
import { schema, rules } from '@adonisjs/validator'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export default class ArticlesController {
  async index({}: HttpContext) {
  try {
    const article = await Article.query()
      .where('dihapus', false)
      .preload('category') // <-- tambahkan preload
      .preload('user')     // <-- jika kamu juga mau tampilkan penulis

    return article
  } catch (error) {
    return { message: 'Gagal mengambil data Article' }
  }
}

  async store({ request, response }: HttpContext) {
    const articleSchema = schema.create({
      title: schema.string({}, [rules.required()]),
      slug: schema.string({}, [rules.required()]),
      content: schema.string({}, [rules.required()]),
      status: schema.boolean(),
      thumbnail: schema.file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png'],
      }, [rules.required()]),
      publishedAt: schema.date({}, [rules.required()]),
      categoryId: schema.number([rules.required()]),
      userId: schema.number([rules.required()]),
    })

    const payload = await request.validate({ schema: articleSchema })

    const slugUsed = await Article.findBy('slug', payload.slug)
    if (slugUsed) {
      return response.unprocessableEntity({
        errors: [{ field: 'slug', message: 'Slug artikel sudah digunakan' }],
      })
    }

    const thumbnail = payload.thumbnail
    const fileName = `${Date.now()}_${cuid()}.${thumbnail.extname}`
    const uploadsPath = app.publicPath('uploads')

    await thumbnail.move(uploadsPath, {
      name: fileName,
      overwrite: true,
    })

    const newArticle = await Article.create({
      title: payload.title,
      slug: payload.slug,
      content: payload.content,
      status: payload.status,
      thumbnail: `/uploads/${fileName}`,
      publishedAt: payload.publishedAt,
      categoryId: payload.categoryId,
      userId: payload.userId,
    })

    return response.created({
      article: newArticle,
      message: 'Artikel berhasil ditambahkan',
    })
  }

  async show({ params, response }: HttpContext) {
    const article = await Article.query()
      .where('slug', params.slug)
      .andWhere('dihapus', false)
      .first()

    if (!article) {
      return response.notFound({ message: 'Artikel tidak ditemukan' })
    }

    return article
  }

  async update({ request, response, params }: HttpContext) {
    const article = await Article.findOrFail(params.id)

    const articleSchema = schema.create({
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
    })

    const payload = await request.validate({ schema: articleSchema })

    const slugUsed = await Article.query()
      .where('slug', payload.slug)
      .whereNot('id', article.id)
      .first()

    if (slugUsed) {
      return response.unprocessableEntity({
        errors: [{ field: 'slug', message: 'Slug artikel sudah digunakan' }],
      })
    }

    let thumbnailPath = article.thumbnail
    if (payload.thumbnail) {
      const fileName = `${Date.now()}_${cuid()}.${payload.thumbnail.extname}`
      const uploadsPath = app.publicPath('uploads')

      await payload.thumbnail.move(uploadsPath, {
        name: fileName,
        overwrite: true,
      })

      thumbnailPath = `/uploads/${fileName}`
    }

    article.merge({
      title: payload.title,
      slug: payload.slug,
      content: payload.content,
      status: payload.status,
      publishedAt: payload.publishedAt,
      categoryId: payload.categoryId,
      thumbnail: thumbnailPath,
    })

    await article.save()

    return {
      article,
      message: 'Artikel berhasil diperbarui',
    }
  }

  async destroy({ params }: HttpContext) {
    const deleted = await Article.query()
      .where('id', params.id)
      .update({ dihapus: true })

    return {
      deleted,
      message: 'Artikel berhasil dihapus',
    }
  }
}

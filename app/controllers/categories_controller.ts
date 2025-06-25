import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'
import { schema, rules } from '@adonisjs/validator'

export default class CategoriesController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    try {
      const categories = await Category.query().where({ dihapus: 0 })
      return categories
    } catch (error) {
      return { message: 'Gagal mengambil data kategori' }
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
        nama: schema.string({}, [rules.required()]),
        slug: schema.string({}, [rules.required()]),
      }),
      messages: {
        'nama.required': 'Nama kategori harus diisi',
        'slug.required': 'Slug kategori harus diisi',
      },
    })

    const [namaUsed, slugUsed] = await Promise.all([
      Category.findBy('nama', payload.nama),
      Category.findBy('slug', payload.slug),
    ])

    const errors = [
      namaUsed && { field: 'nama', message: 'Nama kategori sudah digunakan' },
      slugUsed && { field: 'slug', message: 'Slug kategori sudah digunakan' },
    ].filter(Boolean)

    if (errors.length) {
      return response.unprocessableEntity({ errors })
    }

    const category = await Category.create(payload)

    return {
      category,
      message: 'Category Berhasil Ditambahkan',
    }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    try {
      const category = await Category.query().where({ id: params.id, dihapus: 0 }).first()
      return category
    } catch (error) {
      return { message: 'Kategori tidak ditemukan' }
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
        nama: schema.string({}, [rules.required()]),
        slug: schema.string({}, [rules.required()]),
      }),
      messages: {
        'nama.required': 'Nama kategori harus diisi',
        'slug.required': 'Slug kategori harus diisi',
      },
    })

    const category = await Category.findOrFail(params.id)

    const [namaUsed, slugUsed] = await Promise.all([
      Category.query().where('nama', payload.nama).whereNot('id', category.id).first(),
      Category.query().where('slug', payload.slug).whereNot('id', category.id).first(),
    ])

    const errors = [
      namaUsed && { field: 'nama', message: 'Nama kategori sudah digunakan' },
      slugUsed && { field: 'slug', message: 'Slug kategori sudah digunakan' },
    ].filter(Boolean)

    if (errors.length) {
      return response.unprocessableEntity({ errors })
    }

    category.merge(payload)
    await category.save()

    return {
      category,
      message: 'Category Berhasil Diupdate',
    }
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    try {
      const category = await Category.query().where({ id: params.id }).update({ dihapus: 1 })
      return { category, message: 'Category berhasil dihapus!' }
    } catch (error) {
      return { message: 'Gagal menghapus kategori' }
    }
  }
}

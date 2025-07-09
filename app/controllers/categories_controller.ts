// app/controllers/categories_controller.ts
import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'
import { schema, rules } from '@adonisjs/validator'

export default class CategoriesController {
  async index({ response }: HttpContext) {
    try {
      const categories = await Category.query().where({ dihapus: false })
      return response.ok(categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      return response.status(500).json({ message: 'Gagal mengambil data kategori', error: error.message })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      console.log('Menerima request POST /category:', request.body()) // Log request
      const payload = await request.validate({
        schema: schema.create({
          nama: schema.string({}, [rules.required(), rules.trim()]),
          slug: schema.string({}, [rules.required(), rules.trim()]),
        }),
        messages: {
          'nama.required': 'Nama kategori harus diisi',
          'slug.required': 'Slug kategori harus diisi',
        },
      })

      console.log('Payload setelah validasi:', payload) // Log payload

      const [namaUsed, slugUsed] = await Promise.all([
        Category.findBy('nama', payload.nama),
        Category.findBy('slug', payload.slug),
      ])

      const errors = [
        namaUsed && { field: 'nama', message: 'Nama kategori sudah digunakan' },
        slugUsed && { field: 'slug', message: 'Slug kategori sudah digunakan' },
      ].filter(Boolean)

      if (errors.length) {
        console.log('Validasi gagal:', errors) // Log error validasi
        return response.status(422).json({ errors })
      }

      const category = await Category.create({ ...payload, dihapus: false }) // Pastikan dihapus false
      console.log('Kategori berhasil dibuat:', category) // Log hasil

      return response.created({
        category,
        message: 'Kategori berhasil ditambahkan',
      })
    } catch (error) {
      console.error('Error storing category:', error) // Log detail error
      return response.status(500).json({ message: 'Gagal menyimpan kategori', error: error.message })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const category = await Category.query().where({ id: params.id, dihapus: false }).firstOrFail()
      return response.ok(category)
    } catch (error) {
      console.error('Error fetching category:', error)
      return response.status(404).json({ message: 'Kategori tidak ditemukan' })
    }
  }

  async update({ request, response, params }: HttpContext) {
    try {
      const payload = await request.validate({
        schema: schema.create({
          nama: schema.string({}, [rules.required(), rules.trim()]),
          slug: schema.string({}, [rules.required(), rules.trim()]),
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
        return response.status(422).json({ errors })
      }

      category.merge(payload)
      await category.save()

      return response.ok({
        category,
        message: 'Kategori berhasil diupdate',
      })
    } catch (error) {
      console.error('Error updating category:', error)
      return response.status(500).json({ message: 'Gagal mengupdate kategori', error: error.message })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.merge({ dihapus: true }).save()
      return response.ok({ message: 'Kategori berhasil dihapus' })
    } catch (error) {
      console.error('Error deleting category:', error)
      return response.status(500).json({ message: 'Gagal menghapus kategori', error: error.message })
    }
  }
}
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { schema, rules } from '@adonisjs/validator'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  async register({ request, response }: HttpContext) {
    const payload = await request.validate({
      schema: schema.create({
        name: schema.string({}, [rules.required()]),
        email: schema.string({}, [rules.required(), rules.email()]),
        password: schema.string({}, [rules.required(), rules.minLength(8), rules.maxLength(32)]),
      }),
      messages: {
        'name.required': 'Nama harus diisi',
        'email.required': 'Email harus diisi',
        'email.email': 'Format email tidak valid',
        'password.required': 'Password harus diisi',
        'password.minLength': 'Password minimal 8 karakter',
        'password.maxLength': 'Password maksimal 32 karakter',
      },
    })

    const emailUsed = await User.findBy('email', payload.email)

    const errors = [emailUsed && { field: 'email', message: 'Email sudah digunakan' }].filter(
      Boolean
    )

    if (errors.length) {
      return response.unprocessableEntity({ errors })
    }

    const user = await User.create(payload)

    return {
      user,
      message: 'Register Berhasil!',
    }
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}

// app/controllers/auth_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const { name, email, password } = request.only(['name', 'email', 'password'])

    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      return response.conflict({ message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password })

    // Jangan kirim password ke client
    const safeUser = user.serialize({ fields: { omit: ['password'] } })
    return response.created(safeUser)
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.findBy('email', email)
    if (!user || user.password !== password) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id }, env.get('JWT_SECRET'), { expiresIn: '7d' })

    const safeUser = user.serialize({ fields: { omit: ['password'] } })
    return { token, user: safeUser }
  }

  async me({ request, response }: HttpContext) {
    const user = request.get('authUser')
    if (!user) return response.unauthorized({ message: 'Unauthenticated' })

    const safeUser = user.serialize({ fields: { omit: ['password'] } })
    return response.ok(safeUser)
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class UsersController {
  async register({ request, response }: HttpContext) {
    const { name, email, password } = request.only(['name', 'email', 'password'])

    const existing = await User.findBy('email', email)
    if (existing) return response.status(400).json({ message: 'Email already exists' })

    const user = await User.create({ name, email, password })
    return response.status(201).json({ message: 'User created', user })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.findBy('email', email)
    if (!user || user.password !== password) {
      return response.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, email: user.email }, env.get('JWT_SECRET'), { expiresIn: '1d' })
    return response.json({ token })
  }

  async profile({ authUser, response }: HttpContext) {
    return response.json(authUser)
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import User from '#models/user'

export default class AuthMiddleware {
  async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    const authHeader = request.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.unauthorized({ message: 'Token required' })
    }

    const token = authHeader.split(' ')[1]

    try {
      const payload = jwt.verify(token, env.get('JWT_SECRET'))
      if (typeof payload !== 'object' || !('id' in payload)) {
        throw new Error('Invalid token payload')
      }

      const user = await User.find((payload as any).id)
      if (!user) throw new Error('User not found')

      request.set('authUser', user)
      await next()
    } catch {
      return response.unauthorized({ message: 'Invalid or expired token' })
    }
  }
}

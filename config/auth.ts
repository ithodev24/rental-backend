// app/middleware/auth.ts
import { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'
import User from '#models/user'

export default async function authMiddleware(ctx: HttpContext, next: () => Promise<void>) {
  const authHeader = ctx.request.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ctx.response.unauthorized({ message: 'Missing or invalid token' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const payload = jwt.verify(token, 'SECRET_KEY') as { id: number }
    const user = await User.find(payload.id)
    if (!user) throw new Error()
    ctx.auth = { user }
    await next()
  } catch {
    return ctx.response.unauthorized({ message: 'Invalid or expired token' })
  }
}

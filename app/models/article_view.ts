import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ArticleView extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare articleId: number

  @column()
  declare entity: 'RENTAL_MOTOR' | 'RENTAL_IPHONE' | 'SEWA_APARTMENT'

  @column()
  declare ipAddress: string | null

  @column()
  declare userAgent: string | null

  @column.dateTime()
  declare viewedAt: DateTime
}
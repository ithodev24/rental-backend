import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
} from '@adonisjs/lucid/orm'

import Category from '#models/category'
import User from '#models/user'

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare content: string

  @column()
  declare status: boolean

  @column()
  declare thumbnail: string

  @column.date()
  declare publishedAt: DateTime

  @column()
  declare categoryId: number

  @column()
  declare userId: number

  @column()
  declare dihapus: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category)
  declare category: Category

  @belongsTo(() => User)
  declare user: User
}

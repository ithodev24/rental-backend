import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'articles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('CASCADE')
      table.string('title').notNullable()
      table.string('slug').notNullable().unique()
      table.text('content').notNullable()
      table.string('thumbnail').notNullable()
      table.dateTime('published_at').notNullable()
      table.boolean('status').defaultTo(false)
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.boolean('dihapus').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'article_views'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('article_id').unsigned().references('id').inTable('articles').onDelete('CASCADE')
      table.enum('entity', ['RENTAL_MOTOR', 'RENTAL_IPHONE', 'SEWA_APARTMENT']).notNullable()
      table.string('ip_address').nullable()
      table.string('user_agent').nullable()
      table.timestamp('viewed_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
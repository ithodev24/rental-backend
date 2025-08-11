import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ArticleViewsController {
  public async index({ request }: HttpContext) {
    const entity = request.input("entity");

    let query = db.from("article_views")
      .join("articles", "articles.id", "=", "article_views.article_id")
      .select("articles.id as article_id", "articles.title", "article_views.entity")
      .count("* as total_views")
      .groupBy("articles.id", "articles.title", "article_views.entity");

    if (entity) {
      query.where("article_views.entity", entity);
    }

    return await query;
  }
}

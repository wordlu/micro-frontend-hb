import Model, { attr } from '@ember-data/model';

export default class ArticleModel extends Model {
	@attr("string") title;
	@attr("string") uri;
	@attr("number") date;
	@attr("string") avatar;
}

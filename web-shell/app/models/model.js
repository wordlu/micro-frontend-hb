import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ModelModel extends Model {
	@belongsTo("project") project;
	@attr("string") name;
	@attr("string") type;
	@attr("string") location;
	@attr("string") definition;
}

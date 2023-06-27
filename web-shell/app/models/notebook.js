import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class NotebookModel extends Model {
	@attr("string") name;
	@attr("string") url;
	@attr("string") type;
	@attr("string") resource;
	@belongsTo("project") project;
}

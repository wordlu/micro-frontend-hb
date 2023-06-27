import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class WikiModel extends Model {
	@belongsTo("project") project;
	@attr("string") type;
	@attr("string") location; 
}

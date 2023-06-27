import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class AnalysisModel extends Model {
	@attr("string") name;
	@belongsTo("project") project;
}

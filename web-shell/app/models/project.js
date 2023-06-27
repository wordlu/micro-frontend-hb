import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ProjectModel extends Model {
	@attr("string") name; //项目名称,如max提数
	@attr("string") provider;
	@attr("string") owner;
	@attr("string") type;
	@attr("date") created;
	// @hasMany("model") models;
	// @hasMany("script") scripts;
	// @hasMany("dataset") datasets;
	// @belongsTo("flow") flow;
	// @belongsTo("analysis") analysis;
	// @hasMany("resource") resources;
	// @hasMany("notebook") notebooks;
	// @hasMany("dash-board") dashBoards;
	// @hasMany("wiki") wikis;
	// @attr tasks
	// @attr actions
}

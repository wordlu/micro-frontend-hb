import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class StateMachineModel extends Model {
	@attr("string") name; //项目名称,如max提数
	// @attr("string") version;
	@attr("string") project;
	// @attr("string") arn;
	@attr("string") type;
	@belongsTo("flow") flow;
	@attr("string") displayName;
	@belongsTo("stateDisplay") display;
}

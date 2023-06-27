import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ActionModel extends Model {
	@attr('string') projectID;
	@attr('string') owner;
	@attr('string') showName;
	@attr('number') time;
	@attr('number') code;
	@attr('string') jobDesc;
	@attr('string') jobCat;
	@attr('string') comments;
	@attr('string') message;
	@attr('number') date;
}

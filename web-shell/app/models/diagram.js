import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class DiagramModel extends Model {
	@attr("string") partner;
	@attr("string") name;
	@attr("string") source;
	@attr("string") rid;
	@attr("string") gid;
	@attr("string") tag;
	@attr("string") version;
	@attr("string") description;
	@attr("date") created;
	@attr("date") modified;
}

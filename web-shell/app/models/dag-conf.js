import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class DagConfModel extends Model {
	@attr("string") flowVersion
	@attr("string") jobPath
	@attr("string") jobName
	@attr("string") version
	@attr("string") dagName
	@attr("string") jobShowName
	@attr("string") inputs
	@attr("string") jobDisplayName
	@attr("string") jobId
	@attr("string") jobVersion
	@attr("string") outputs
	@attr("string") owner
	@attr("string") projectId
	@attr("string") runtime
	@attr("string") targetJobId
	@attr("string") timeout
	@attr("string") operatorParameters
}

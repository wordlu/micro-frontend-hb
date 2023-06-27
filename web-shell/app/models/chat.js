import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ChatModel extends Model {
	@belongsTo("slide") slide
}

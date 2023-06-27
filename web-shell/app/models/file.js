import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class FileModel extends Model {
    @attr("string") name;
    @attr("string") owner;
    @attr("string") extension;
    @attr("number") size;
    @attr("string") source;
    @attr labels;
    @attr("date") created;
    @attr("date") modified;
    @attr("string") version;
    @attr("string") description;
}

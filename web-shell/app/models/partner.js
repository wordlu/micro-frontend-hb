import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class PartnerModel extends Model {
    @attr("string") name;
    @attr("string") address;
    @attr("string") phoneNumber;
    @attr("string") web;
    @attr("string") pid;
    @hasMany("template") templates;
    @attr("date") created;
    @attr("date") modified;
    @hasMany("account") employees;
}

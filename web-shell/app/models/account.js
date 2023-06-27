import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class AccountModel extends Model {
    @attr("string") name;
    @attr("string") firstName;
    @attr("string") lastName;
    @attr("string") picture;
    @attr("string") wechatOpenId;
    @attr("string") password;
    @attr("string") phoneNumber;
    @attr("string") email;
    @attr("string") notification;
    @attr("date") created;
    @attr("date") modified;
    @belongsTo("partner") employer;
}

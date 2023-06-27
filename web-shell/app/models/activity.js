import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ActivityModel extends Model {
    @attr('string') title;
    @attr('string') subTitle;
    @attr('date') startDate;
    @attr('date') endDate;
    @attr('string') location;
    @attr('string') city;
    @attr('string') activityType;
    @attr('string') contentTitle;
    @attr('string') contentDesc;
    @hasMany('image') gallery;
    @hasMany("report") attachments;
    @hasMany("zone") agendas;
    @belongsTo('image') logo;
    @belongsTo('image') logoOnTime;
    @hasMany("cooperation") partners;
    @attr('number') language;
}

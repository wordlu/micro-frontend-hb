import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ProjectFileModel extends Model {
    @attr('string') smID;
    @attr('string') name;
    @attr('string') status;
    @attr('number') date;
    @attr('number') size;
    @attr('string') category; 
    @attr('string') property;
}

import _ from 'lodash';
import rest from '../../net/ajax';
// import style from './tab3.scss';
import template from './tab3.hbs';

export default class Tab3Panel {
  constructor() {
    this.template = template;
    // this.style = style;
    this.data = {};
    this.title = 'Tab 3';
  }

  render() {
    var $d = $.Deferred();
    // this.display().then(ui => {
    //   this.ui = ui;
    // });
    return $.when(template(this));
    // return $d;
  }
}

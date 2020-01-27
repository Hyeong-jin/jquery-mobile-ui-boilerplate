import _ from 'lodash';
import rest from '../../lib/ajax';
import style from './newpopup.scss';
import template from './newpopup.hbs';

export default class NewpopupPopup {
  constructor() {
    this.id = 'newpopup';
    this.template = template;
    this.style = style;
    this.data = {};
    this.title = 'newpopup Popup Title';
  }

  render() {
    var $d = $.Deferred();

    this.retrieveApi().then(response => {
      this.data = response;
      this.display().then(ui => {
        ui.popup();
        $d.resolve(ui);
      });
    });

    return $d;
  }

  retrieveApi() {
    return rest('https://jsonplaceholder.typicode.com/posts/1');
  }

  display() {
    return $.when($(template(this)).appendTo($.mobile.activePage));
  }
}

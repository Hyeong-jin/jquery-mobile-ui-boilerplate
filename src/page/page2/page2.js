import _ from 'lodash';
import rest from '../../net/ajax';
import style from './page2.scss';
import template from './page2.hbs';

export default class Page2Page {
  constructor() {
    this.template = template;
    this.style = style;
    this.data = {};
    this.title = 'Tabs';
  }

  render() {
    var $d = $.Deferred();

    this.retrieveApi().then(response => {
      this.data = response;
      this.display().then(ui => {
        this.ui = ui;
        // ui.on('tabsbeforeactivate', this.beforeActive);

        $('[data-role=navbar]', ui)
          .navbar()
          .find('li>a')
          .filter(':first')
          .addClass('ui-btn-active')
          .end()
          .on('click', this.onClickTab.bind(this));

        $d.resolve();
      });
    });

    return $d;
  }

  retrieveApi() {
    return rest('https://jsonplaceholder.typicode.com/todos/1');
  }

  display() {
    return $.when($(document.body).prepend($(template(this))));
  }

  // TODO  동적으로 페이지를 불러오는 로직 구현. 참고: page loader... index.js
  // beforeActive(event, ui) {
  //   console.log('tabs.beforeActive', event, ui);
  //   if (ui.newPanel.length === 0) {
  //     // console.log('no tab contents');
  //   }
  // }
  onClickTab(event) {
    // console.log('onclick', arguments);
    // $(this).css('color', 'red');
    var pid = $(event.target)
      .attr('href')
      .slice(1);
    if ($(`#${pid}`).length === 0) {
      this.loadTabContent(pid);
    }
    // console.log(this.ui);
  }

  loadTabContent(pid) {
    // console.log(pid, this.ui);
    var dir = '.';
    import(`${dir}/${pid}`)
      .then(module => module.default)
      .then(page => {
        new page().render().then(segment => {
          // console.log(page, segment);
          $('[data-role=tabs]', this.ui).append(segment);
        });
      });
  }
}

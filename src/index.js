/*
Innerwave jQuery Mobile starter template
*/
import _ from 'lodash';
import 'jquery';
import 'fastclick';

var app = {
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    // console.log(document.location.href, document.location.hash);
    var pid = document.location.hash.replace(/\?.*$/, '').substr(1);
    var url = document.location.href;
    this.loadPage(pid, url, {
      reverse: false,
      changeHash: true,
      fromHashChange: false,
      showLoadMsg: true,
      allowSamePageTransition: false,
      transition: 'slide'
    });
  },

  onDeviceReady: function() {
    FastClick.attach(document.body);
  },

  changePage: function(ui) {
    var url = '';
    var pid = '';
    if (typeof ui.toPage === 'string') {
      url = $.mobile.path.parseUrl(ui.toPage);
      pid = url.hash.replace(/\?.*$/, '').substr(1);
    } else if (ui.toPage[0]) {
      url = ui.toPage[0].baseURI;
      pid = ui.toPage[0].id;
    }
    var $page = $(`#${pid}`);
    // console.log('change page', $page.length, ui);
    if ($page.length === 0) {
      this.loadPage(pid, url, ui.options);
    }
  },

  loadPage: function(pid, url, options) {
    var uri = '';
    if (typeof url === 'string') {
      uri = url;
    } else {
      uri = url.href;
    }
    import(`./page/${pid}/${pid}`)
      .then(module => module.default)
      .then(page => {
        new page().render().then(() => {
          $(document.body).pagecontainer('change', uri, options);
        });
      })
      .catch(reason => {
        console.log(reason);
      });
  }
};

$(document).on('pagecontainerbeforechange', function(e, ui) {
  app.changePage(ui);
});

app.initialize();

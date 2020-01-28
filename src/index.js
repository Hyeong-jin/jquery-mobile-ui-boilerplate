/*
Innerwave jQuery Mobile starter template
*/
import _ from 'lodash';
import 'jquery';
import 'fastclick';

// import './helpers/json';

var app = {
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    $('[data-role=popup]').popup();
    $('[data-role=page]').addClass('static');
    var pid = document.location.hash.replace(/[\?\&].*$/, '').substr(1);
    var url = document.location.href;
    if (pid) {
      this.loadPage(pid, url, {
        reverse: false,
        changeHash: true,
        fromHashChange: true,
        showLoadMsg: true,
        allowSamePageTransition: true,
        transition: 'fade'
      });
    }
  },

  onDeviceReady: function() {
    FastClick.attach(document.body);
  },

  changePage: function(ui) {
    var url = '';
    var pid = '';
    if (typeof ui.toPage === 'string') {
      url = $.mobile.path.parseUrl(ui.toPage);
      pid = url.hash.replace(/[\?\&].*$/, '').substr(1);
    } else if (ui.toPage[0]) {
      url = ui.toPage[0].baseURI;
      pid = ui.toPage[0].id;
    }
    pid = pid || 'home';
    var $page = $(`#${pid}`);
    if ($page.length === 0) {
      this.loadPage(pid, url, ui.options);
    } else {
      if (ui.options.role === 'popup') {
        $(`#${pid}`)
          .appendTo($.mobile.activePage)
          .popup();
        $(`#${pid}`).popup('open');
      }
    }
  },

  loadPage: function(pid, url, options) {
    var uri = '';
    if (typeof url === 'string') {
      uri = url;
    } else {
      uri = url.href;
    }
    var dir = options.role === 'popup' ? 'popup' : 'page';
    import(`./${dir}/${pid}/${pid}`)
      .then(module => module.default)
      .then(page => {
        new page().render().then(() => {
          if (options.role === 'popup') {
            $(`#${pid}`).popup();
            $(`#${pid}`).popup('open');
          } else {
            $(document.body).pagecontainer('change', uri, options);
          }
        });
      })
      .catch(reason => {
        console.log(reason);
      });
  }
};

$(document).on('pagecontainerbeforechange', (e, ui) => {
  app.changePage(ui);
});

$(document).on('pagecontainertransition', (e, ui) => {
  if (ui.prevPage && !ui.prevPage.hasClass('static')) {
    ui.prevPage.remove();
  }
  ui.toPage.trigger('updatelayout');
});

$(document).on('popupafterclose', '.ui-popup', () => {
  $(this).remove();
});

app.initialize();

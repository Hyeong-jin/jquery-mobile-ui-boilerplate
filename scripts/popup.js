const path = require('path');
const fs = require('fs');

const [fn, name, ...options] = process.argv.slice(2);

const pathToDir = path.resolve(__dirname, '..', 'src', 'popup', name || '');

switch (fn) {
  case 'add':
    createPopup();
    break;

  case 'rm':
  case 'remove':
    deletePopup();
    break;

  case 'help':
  default:
    printHelps();
    break;
}

function printHelps() {
  console.log(`사용법: 
  npm run popup add popup-name
  npm run popup rm popup-name
  `);
}

const scripts = `import _ from 'lodash';
import rest from '../../lib/ajax';
import style from './${name}.scss';
import template from './${name}.hbs';

export default class ${name.slice(0, 1).toLocaleUpperCase()}${name.slice(1).toLocaleLowerCase()}Popup {
  constructor() {
    this.id = '${name}';
    this.template = template;
    this.style = style;
    this.data = {};
    this.title = '${name} Popup Title';
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
`;

const styles = `[data-role=popup]#${name} {
  // 페이지 내에서만 특별히 사용하는 스타일을 정의합니다.
  // 꼭 필요한 경우가 아니면 사용을 삼가하고 퍼블리시 쪽에 문의합니다.

}
`;

const htmls = `<div data-role="popup" id="${name}" data-short="${name}" data-overlay-theme="a" data-theme="a" data-dismissible="true">

  <div data-role="header" data-position="fixed">
    <h1>{{title}}</h1>
  </div>
  
  <div role="main" class="ui-content">
    <h2>{{data.title}}</h2>
    <p>{{data.body}}</p>
  </div>

</div>
`;

function createPopup() {
  fs.access(pathToDir, fs.constants.F_OK, err => {
    if (err) {
      fs.mkdir(pathToDir, { recursive: true }, err => {
        if (err) {
          console.error(err);
        } else {
          fs.writeFileSync(path.join(pathToDir, `${name}.js`), scripts);
          fs.writeFileSync(path.join(pathToDir, `${name}.scss`), styles);
          fs.writeFileSync(path.join(pathToDir, `${name}.hbs`), htmls);
        }
      });
    } else {
      console.error(`디렉토리(${pathToDir})가 이미 있습니다`);
    }
  });
}

function deletePopup() {
  fs.access(pathToDir, fs.constants.F_OK, err => {
    if (err) {
      console.error(`삭제할 디렉토리(${pathToDir})가 없습니다`);
    } else {
      fs.unlinkSync(path.join(pathToDir, `${name}.js`));
      fs.unlinkSync(path.join(pathToDir, `${name}.scss`));
      fs.unlinkSync(path.join(pathToDir, `${name}.hbs`));
      fs.rmdir(pathToDir, err => {
        if (err) {
          console.error(err);
        } else {
          console.log('팝업을 삭제하였습니다.');
        }
      });
    }
  });
}

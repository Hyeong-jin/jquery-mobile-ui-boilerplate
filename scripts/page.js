const path = require('path');
const fs = require('fs');

const [fn, name] = process.argv.slice(2);

const pathToDir = path.resolve(__dirname, '..', 'src', 'page', name || '');

switch (fn) {
  case 'add':
    createPage();
    break;

  case 'rm':
  case 'remove':
    deletePage();
    break;

  case 'help':
  default:
    printHelps();
    break;
}

function printHelps() {
  console.log(`사용법: 
  npm run page add page-name
  npm run page rm page-name
  `);
}

const scripts = `import _ from 'lodash';
import rest from '../../lib/ajax';
import style from './${name}.scss';
import template from './${name}.hbs';

export default class ${name.slice(0, 1).toLocaleUpperCase()}${name.slice(1).toLocaleLowerCase()}Page {
  constructor() {
    this.template = template;
    this.style = style;
    this.data = {};
    this.title = 'Page Title';
  }

  render() {
    var $d = $.Deferred();

    this.retrieveApi().then(response => {
      this.data = response;
      this.display().then(() => {
        $d.resolve();
      });
    });

    return $d;
  }

  retrieveApi() {
    return rest('https://jsonplaceholder.typicode.com/posts/1');
  }

  display() {
    return $.when($(document.body).prepend($(template(this))));
  }
}
`;

const styles = `[data-role=page]#${name} {
  // 페이지 내에서만 특별히 사용하는 스타일을 정의합니다.
  // 꼭 필요한 경우가 아니면 사용을 삼가하고 퍼블리시 쪽에 문의합니다.

}
`;

const htmls = `<div data-role="page" id="${name}">

  <div data-role="header" data-position="fixed">
    <h1>{{title}}</h1>
    <a href="#home" data-transition="slide" data-direction="reverse" data-icon="arrow-l" class="ui-btn-left">Home</a>
  </div>
  
  <div role="main" class="ui-content">
    <h2>{{data.title}}</h2>
    <p>{{data.body}}</p>
  </div>

</div>
`;

function createPage() {
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

function deletePage() {
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
          console.log('페이지를 삭제하였습니다.');
        }
      });
    }
  });
}

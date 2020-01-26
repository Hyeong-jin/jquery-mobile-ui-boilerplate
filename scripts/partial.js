const path = require('path');
const fs = require('fs');

const [fn, name] = process.argv.slice(2);

const pathToDir = path.resolve(__dirname, '..', 'src', 'helpers', name || '');

switch (fn) {
  case 'add':
    createPartial();
    break;

  case 'rm':
  case 'remove':
    deletePartial();
    break;

  case 'help':
  default:
    printHelps();
    break;
}

function printHelps() {
  console.log(`사용법: 
            npm run partial add partial-name
            npm run partial rm partial-name
            `);
}

const scripts = `Handlebars.registerPartial('${name}', function (text, options) {
            return text.toUpperCase();
          });
          `;

function createPartial() {
  fs.access(pathToDir, fs.constants.F_OK, err => {
    if (err) {
      fs.mkdir(pathToDir, { recursive: true }, err => {
        if (err) {
          console.error(err);
        } else {
          fs.writeFileSync(path.join(pathToDir, `${name}.js`), scripts);
        }
      });
    } else {
      console.error(`디렉토리(${pathToDir})가 이미 있습니다`);
    }
  });
}

function deletePartial() {
  fs.access(pathToDir, fs.constants.F_OK, err => {
    if (err) {
      console.log(`삭제할 디렉토리(${pathToDir})가 없습니다`);
    } else {
      fs.unlinkSync(path.join(pathToDir, `${name}.js`));
      fs.rmdir(pathToDir, err => {});
    }
  });
}

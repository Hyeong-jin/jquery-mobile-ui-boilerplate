const path = require('path');
const fs = require('fs');

const [fn, name] = process.argv.slice(2);

const pathToDir = path.resolve(__dirname, '..', 'src', 'helpers');

switch (fn) {
  case 'add':
    createDir();
    break;

  case 'rm':
  case 'remove':
    deleteHelper();
    break;

  case 'help':
  default:
    printHelps();
    break;
}

function printHelps() {
  console.log(`사용법: 
            npm run helper add helper-name
            npm run helper rm helper-name
            `);
}

const scripts = `module.exports = function (text, options) {
  return text.toUpperCase();
};
`;

function createDir() {
  fs.access(pathToDir, fs.constants.F_OK, err => {
    if (err) {
      fs.mkdir(pathToDir, { recursive: true }, err => {
        if (err) {
          console.error(err);
        } else {
          createHelper();
        }
      });
    } else {
      createHelper();
    }
  });
}
function createHelper() {
  var file = path.join(pathToDir, `${name}.js`);
  fs.writeFileSync(file, scripts);
  console.log(`
          헬퍼를 생성하였습니다.
          사용법:

          {{${name} variable }}
          {{${name} 'value for format' }}
          
          `);
}

function deleteHelper() {
  fs.access(pathToDir, fs.constants.F_OK, err => {
    if (err) {
      console.log(`삭제할 디렉토리(${pathToDir})가 없습니다`);
    } else {
      var file = path.join(pathToDir, `${name}.js`);
      fs.unlinkSync(file);
      fs.rmdir(pathToDir, err => {});
      console.log(`
      "${file}"을 삭제하였습니다.
      `);
    }
  });
}

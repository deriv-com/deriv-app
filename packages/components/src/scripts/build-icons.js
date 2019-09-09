
/**
 * Build components/icon/index.js file automatically
 */

const { EOL } = require('os');
const path = require('path');
const fs = require('fs');

const entries_object = require('./icons');

function buildIcons() {

  console.info('Build icons starting.');

  let modules = 0;
  let moduleNames = '\nexport {\n';

  const buffer = [
    '// auto-generated file. DO NOT MODIFY.', '',
  ];

  const emitModule = (file) => {
    const pathname = entries_object[file].replace('.svg', '').replace('./src/components/icon/', '');
    const name = file.replace('icons/', '');
    
    modules += 1;
    moduleNames += `\t${name},\n`;

    buffer.push(`import ${name} from './${pathname}.svg';`);
  };

  const files = Object.keys(entries_object);
  files
    .forEach(f => {
      const stats = fs.statSync(entries_object[f]);
      if (stats.isFile()) {
        emitModule(f);
      }
    });

  moduleNames += '}';
  buffer.push(moduleNames);

  fs.writeFileSync(path.join(__dirname, '../components/icon/index.js'), buffer.join(EOL) + EOL);

  console.info(`Build icons done. 'components/icon/index.js' emitted with ${modules} modules.`);
};

module.exports.buildIcons = buildIcons;

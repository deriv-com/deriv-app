const fs = require('fs');

const en = fs.readFileSync('src/translations/en/i10n.json', 'utf8');
const en1 = fs.readFileSync('src/translations/i18n/en/translation.json', 'utf8');
const enJson1 = JSON.parse(en);
const esJson2 = JSON.parse(en1);

const data = {
    ...enJson1,
    ...esJson2,
};

fs.writeFileSync('src/translations/en/i10n.json', JSON.stringify(data, null, 2));

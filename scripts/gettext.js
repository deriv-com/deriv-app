const color   = require('cli-color');
const fs      = require('fs');
const { po }  = require('gettext-parser');
const Gettext = require('node-gettext');
const Path    = require('path');
const common  = require('./common');

/* eslint-disable no-console */
Gettext.prototype.dnpgettext = function (domain, msg_txt, msg_id, msg_id_plural, count) {
    let default_translation = msg_id;
    let index;

    if (!isNaN(count) && count !== 1) {
        default_translation = msg_id_plural || msg_id;
    }

    this.emit('source-string', msg_id);
    const translation = this._getTranslation(domain, msg_txt || '', msg_id); // eslint-disable-line no-underscore-dangle

    if (translation) {
        if (typeof count === 'number') {
            const pluralsFunc = plurals[Gettext.getLanguageCode(this.locale)].pluralsFunc; // eslint-disable-line no-undef
            index             = pluralsFunc(count);
            if (typeof index === 'boolean') {
                index = index ? 1 : 0;
            }
        } else {
            index = 0;
        }

        return translation.msgstr[index] || default_translation;
    }
    // else
    return default_translation;
};

const createGettextInstance = () => {
    const translations_dir = 'src/translations/';
    const locales = [
        'en',   'ach_UG', 'de_DE', 'es_ES', 'fr_FR', 'id_ID', 'it_IT',
        'ko_KR', 'pl_PL', 'pt_PT', 'ru_RU', 'th_TH', 'vi_VN', 'zh_CN', 'zh_TW',
    ];

    const start = Date.now();
    process.stdout.write(common.messageStart('Loading .po files', true));
    const gt = new Gettext();

    locales.forEach((locale) => {
        const po_file    = Path.join(common.root_path, translations_dir, `${locale}.po`);
        const po_content = fs.readFileSync(po_file, 'utf8');

        const parsed = po.parse(po_content);
        gt.addTranslations(locale, 'messages', parsed);
        process.stdout.write('.');
    });
    process.stdout.write(common.messageEnd(Date.now() - start));

    const source_strings = [];
    gt.on('source-string', (str) => {
        if (source_strings.indexOf(str) === -1) {
            source_strings.push(str);
        }
    });

    return {
        setLang: lang => {
            const [locale] = locales.filter(l => l.toLocaleLowerCase().startsWith(lang));
            if (!locale) {
                throw new TypeError(`locale for ${lang} not found!`);
            }
            gt.setLocale(locale);
        },
        gettext: (text, ...args) => {
            let txt = text;
            for (let inx = 1; inx <= args.length; ++inx) {
                txt = txt.split(`[_${inx}]`).join(`%${inx}`);
            }
            let translation = gt.gettext(txt);
            for (let inx = 1; inx <= args.length; ++inx) {
                translation = translation.split(`%${inx}`).join(args[inx - 1]);
            }
            return translation;
        },
        update_translations: () => {
            process.stdout.write(common.messageStart('Updating translations'));

            const start_time    = Date.now();
            const messages_file = Path.join(common.root_path, translations_dir, 'messages.pot');
            const content       = fs.readFileSync(messages_file, 'utf8');
            const parsed        = po.parse(content);
            const old_strings   = Object.keys(parsed.translations['']).filter(s => s);
            const old_count     = old_strings.length;
            const new_strings   = [];

            parsed.translations[''] = {};
            source_strings.sort().forEach(entry => {
                const idx = old_strings.indexOf(entry);
                if (idx === -1) {
                    new_strings.push(entry);
                } else {
                    old_strings.splice(idx, 1);
                }
                parsed.translations[''][entry] = {
                    msgid : entry,
                    msgstr: [''],
                };
            });

            const output = po.compile(parsed, { foldLength: 0 });
            fs.writeFileSync(
                Path.join(common.root_path, translations_dir, 'messages.pot'),
                output,
                'utf8'
            );

            process.stdout.write(common.messageEnd(Date.now() - start_time, true));
            process.stdout.write(`  (messages.pot: ${source_strings.length.toLocaleString()} entries)\n`);

            printList('New strings',     new_strings, 'greenBright');
            printList('Deleted strings', old_strings, 'redBright');

            console.log(
                '\n\n',
                color.cyanBright('Summary\n'),
                color.yellowBright(`${'='.repeat(20)}\n`),
                formatValue(old_count, 'was'),
                formatValue(new_strings.length, 'added', '+'),
                formatValue(old_strings.length, 'deleted', '-'),
                color.yellowBright(`${'-'.repeat(20)}\n`),
                formatValue(Object.keys(parsed.translations['']).length, 'result'));
        },
    };
};

const printList = (title, items, color_name) => {
    console.log();
    console.log(color.yellowBright(`${title}:`), ` (${items.length} item${items.length > 1 ? 's' : ''})`);
    console.log(color.yellow('-'.repeat(title.length + 1)));
    items.forEach((s, idx) => {
        console.log(color.yellow(`  ${(idx + 1).toString().padStart(3)}.`), color[color_name](s));
    });
};

const formatValue = (value, comment, sign) => (
    `${sign ? color.cyan(` ${sign} `) : ''}${color.whiteBright(value.toLocaleString().padStart(sign ? 5 : 8))} ${` (${comment})\n`}`
);

let gt_instance = null;
exports.getInstance = () => {
    if (!gt_instance) {
        gt_instance = createGettextInstance();
    }

    return gt_instance;
};

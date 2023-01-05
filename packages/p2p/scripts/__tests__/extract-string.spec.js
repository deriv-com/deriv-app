const fs = require('fs');
const getStringsFromInput = require('../extract-string').getStringsFromInput;
const getTranslatableFiles = require('../extract-string').getTranslatableFiles;

describe('Regular expression checks', () => {
    it('should extract strings from localize() correctly', () => {
        const messages = getStringsFromInput(`
            localize('Touch/No Touch');
            localize('You have created a Deriv MT5 {{account_title}} account. To start trading, transfer funds from your Deriv account into this account.', { account_title: account_title[0].toLowerCase() + account_title.substr(1) });
            localize('You have no trading activity yet.');
        `);
        expect(messages).toEqual([
            'Touch/No Touch',
            'You have created a Deriv MT5 {{account_title}} account. To start trading, transfer funds from your Deriv account into this account.',
            'You have no trading activity yet.',
        ]);
    });

    it('should extract strings from <Localize> correctly', () => {
        const messages = getStringsFromInput(`
            <Localize
                i18n_default_text='Please accept our updated <0>terms and conditions</0> to continue.'
                components={[
                    <StaticUrl
                        key={0}
                        className='link'
                        href='terms-and-conditions/#general'
                    />,
                ]}
            />
            <Localize i18n_default_text='Keep your account secure with a password' />
            <Localize
                i18n_default_text='Want to exchange between e-wallet currencies? Try <0>bestchange.com</0>'
                components={[
                    <a
                        key={0}
                        href='https://www.bestchange.com/?p=1095016'
                        rel='noopener noreferrer'
                        target='_blank'
                        className='link'
                    />,
                ]}
            />
        `);
        expect(messages).toEqual([
            'Please accept our updated <0>terms and conditions</0> to continue.',
            'Keep your account secure with a password',
            'Want to exchange between e-wallet currencies? Try <0>bestchange.com</0>',
        ]);
    });

    it('should extract strings in files with mixed localize() and <Localize> correctly', () => {
        const messages = getStringsFromInput(`
            localize('This chart display is not ideal for tick contracts')
            const render = () => (
                <React.Fragment>
                    <Button onClick={() => window.alert(localize('Here is where you can decide if your bot should continue trading.')) } />
                    <Localize i18n_default_text='Tick {{current_tick}} - ' values={{ current_tick }} />
                    <Localize i18n_default_text='You cannot use your real money account with {{website_name}} at this time.' values={{ website_name }} />
                    <Localize i18n_default_text={'Jurisdiction and choice of law'} />
                </React.Fragment>
            );
        `);
        expect(messages).toEqual([
            'This chart display is not ideal for tick contracts',
            'Here is where you can decide if your bot should continue trading.',
            'Tick {{current_tick}} - ',
            'You cannot use your real money account with {{website_name}} at this time.',
            'Jurisdiction and choice of law',
        ]);
    });

    it('should remove escaped characters correctly', () => {
        const messages = getStringsFromInput(`
            localize('It\\'s time to win.');
            const Component = <Localize i18n_default_text='It\\'s time to {{ status }}, isn\\'t it?' values={{ status: 'win' }} />;
        `);
        expect(messages).toEqual(["It's time to win.", "It's time to {{ status }}, isn't it?"]);
    });
});

describe('Integration checks', () => {
    // Invalid string formats include:
    // 1. Concatenation or string interpolation
    // 2. Line-break (line-breaks are preserved in string when extracted) — UI/content line-break should be distinct from in-code line-break
    it('should pass localized strings in correct format', () => {
        const file_paths = getTranslatableFiles();
        const invalid_usage_regexp = /(i18n_default_text={?|localize\()\s*(['"`])\s*(.*?)(?<!\\)\2\s*(\+)?/gs;
        const errors = [];

        for (let i = 0; i < file_paths.length; i++) {
            try {
                const file = fs.readFileSync(file_paths[i], 'utf8');
                let result = invalid_usage_regexp.exec(file);

                while (result != null) {
                    if (result[2] === '`') {
                        errors.push(`Localized string interpolation is not allowed at: ${file_paths[i]}`);
                    }
                    if (result[3].includes('\n')) {
                        errors.push(`Localized string line-break is not allowed at: ${file_paths[i]}`);
                    }
                    if (result[4] === '+') {
                        errors.push(`Localized string concatenation is not allowed at: ${file_paths[i]}`);
                    }

                    result = invalid_usage_regexp.exec(file);
                }
            } catch (e) {
                /* eslint-disable no-console */
                console.log(e);
            }
        }

        const error_message = `Invalid string format passed to localize/<Localize>:\n\n\t${errors.join('\n\t')}\n\n\t`;
        /* eslint-disable-next-line no-unused-expressions */
        expect(Object.keys(errors)).toHaveLength(0);
    });
});

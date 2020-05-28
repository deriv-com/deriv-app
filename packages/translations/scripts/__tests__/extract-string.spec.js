const fs = require('fs');
const expect = require('chai').expect;
const getStringsFromInput = require('../extract-string').getStringsFromInput;
const getTranslatableFiles = require('../extract-string').getTranslatableFiles;

describe('Regular expression checks', () => {
    it('should extract strings from localize() correctly', () => {
        const messages = getStringsFromInput(`
            localize('Touch/No Touch');
            localize('You have created a DMT5 {{account_title}} account. To start trading, transfer funds from your Deriv account into this account.', { account_title: account_title[0].toLowerCase() + account_title.substr(1) });
            localize('You have no trading activity yet.');
        `);
        expect(messages).to.deep.equal([
            'Touch/No Touch',
            'You have created a DMT5 {{account_title}} account. To start trading, transfer funds from your Deriv account into this account.',
            'You have no trading activity yet.',
        ]);
    });

    it('should extract strings from <Localize> correctly', () => {
        const messages = getStringsFromInput(`
            <Localize
                i18n_default_text='Please accept our updated <0>terms and conditions</0> to continue.'
                components={[
                    <a
                        key={0}
                        className='link'
                        target='_blank'
                        rel='noopener noreferrer'
                        href={getDerivComLink('terms-and-conditions/#general')}
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
        expect(messages).to.deep.equal([
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
        expect(messages).to.deep.equal([
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
        expect(messages).to.deep.equal([
            "It's time to win.",
            "It's time to {{ status }}, isn't it?",
        ]);
    });

    it('should not contain calls to localize/<Localize> with backticks "`"', () => {
        const illegal_i18n_marker = new RegExp(/i18n_default_text=([`])(.*?)(?<!\\)\1|localize\(\s*([`])\s*(.*?)\s*(?<!\\)\3\s*/gs);
        const file_paths = getTranslatableFiles();
        const errors = [];

        for (let i = 0; i < file_paths.length; i++) {
            try {
                const file = fs.readFileSync(file_paths[i], 'utf8');
                const messages = getStringsFromInput(file, illegal_i18n_marker);

                if (messages.length) {
                    errors.push(file_paths[i]);
                }
            } catch (e) {
                console.log(e);
            }
        }

        const error_message = `The file(s) below contain(s) calls to localize/<Localize> with backticks:\n\n\t${errors.join('\n\t')}\n\n\t`;
        expect(errors, error_message).to.be.empty;
    });
});

const getCurrencies    = require('./get_currency').getCurrencies;
const BinaryPjax       = require('../../base/binary_pjax');
const Client           = require('../../base/client');
const Header           = require('../../base/header');
const BinarySocket     = require('../../base/socket');
const Dialog           = require('../../common/attach_dom/dialog');
const getCurrencyName  = require('../../common/currency').getCurrencyName;
const isCryptocurrency = require('../../common/currency').isCryptocurrency;
const localize         = require('../../../_common/localize').localize;
const State            = require('../../../_common/storage').State;
const Url              = require('../../../_common/url');

const SetCurrency = (() => {
    let is_new_account;

    const onLoad = () => {
        is_new_account = localStorage.getItem('is_new_account');
        const el = is_new_account ? 'show' : 'hide';
        $(`#${el}_new_account`).setVisibility(1);

        const { can_upgrade, type } = Client.getUpgradeInfo();
        $('#upgrade_to_mf').setVisibility(can_upgrade && type === 'financial');

        if (Client.get('currency')) {
            const has_changed_currency = localStorage.getItem('has_changed_currency');
            if (has_changed_currency) {
                const [ from, to ] = has_changed_currency.split('-');
                $('#set_currency_loading').remove();
                $('#hide_new_account').setVisibility(0);
                $('#congratulations_message').html(localize('You have successfully changed your account currency from [_1] to [_2].', [ `<strong>${from}</strong>`, `<strong>${to}</strong>` ]));
                $('#deposit_btn, #set_currency, #show_new_account').setVisibility(1);
                localStorage.removeItem('has_changed_currency');
            } else if (is_new_account) {
                $('#set_currency_loading').remove();
                $('#deposit_btn, #set_currency').setVisibility(1);
            } else {
                BinaryPjax.loadPreviousUrl();
            }
            return;
        }

        BinarySocket.wait('payout_currencies', 'landing_company').then(() => {
            const landing_company = State.getResponse('landing_company');
            let currencies        = State.getResponse('payout_currencies');

            // TODO [->svg]
            if (Client.get('landing_company_shortcode') === 'costarica' || Client.get('landing_company_shortcode') === 'svg') {
                currencies = getCurrencies(landing_company);
            }
            const $fiat_currencies  = $('<div/>');
            const $cryptocurrencies = $('<div/>');
            currencies.forEach((c) => {
                (isCryptocurrency(c) ? $cryptocurrencies : $fiat_currencies)
                    .append($('<div/>', { class: 'gr-2 gr-3-m currency_wrapper', id: c })
                        .append($('<div/>').append($('<img/>', { src: Url.urlForStatic(`images/pages/set_currency/${c.toLowerCase()}.svg`) })))
                        .append($('<div/>', { class: 'currency-name', html: (isCryptocurrency(c) ? `${getCurrencyName(c)}<br />(${c})` : c) })));
            });
            const fiat_currencies = $fiat_currencies.html();
            if (fiat_currencies) {
                $('#fiat_currencies').setVisibility(1);
                $('#fiat_currency_list').html(fiat_currencies);
            }
            const crypto_currencies = $cryptocurrencies.html();
            if (crypto_currencies) {
                $('#crypto_currencies').setVisibility(1);
                $('#crypto_currency_list').html(crypto_currencies);
            }
            const has_one_group = (!fiat_currencies && crypto_currencies) || (fiat_currencies && !crypto_currencies);
            if (has_one_group) {
                $('#set_currency_text').text(localize('Please select the currency for this account:'));
            } else {
                $('#set_currency_text').text(localize('Do you want this to be a fiat account or crypto account? Please choose one:'));
            }

            $('#set_currency_loading').remove();
            $('#set_currency, .select_currency').setVisibility(1);

            const $currency_list = $('.currency_list');
            const $error         = $('#set_currency').find('.error-msg');

            const onConfirm = () => {
                $error.setVisibility(0);
                const $selected_currency = $currency_list.find('.selected');
                if ($selected_currency.length) {
                    BinarySocket.send({ set_account_currency: $selected_currency.attr('id') }).then((response_c) => {
                        if (response_c.error) {
                            $error.text(response_c.error.message).setVisibility(1);
                        } else {
                            localStorage.removeItem('is_new_account');
                            Client.set('currency', response_c.echo_req.set_account_currency);
                            BinarySocket.send({ balance: 1 });
                            BinarySocket.send({ payout_currencies: 1 }, { forced: true });
                            Header.displayAccountStatus();

                            let redirect_url;
                            if (is_new_account) {
                                if (Client.isAccountOfType('financial')) {
                                    const get_account_status = State.getResponse('get_account_status');
                                    if (!/authenticated/.test(get_account_status.status)) {
                                        redirect_url = Url.urlFor('user/authenticate');
                                    }
                                }
                                // Do not redirect MLT clients to cashier, because they need to set self exclusion before trading
                                if (!redirect_url && /^(malta)$/i.test(Client.get('landing_company_shortcode'))) {
                                    redirect_url = Url.urlFor('user/security/self_exclusionws');
                                }
                                // Do not redirect MX clients to cashier, because they need to set max limit before making deposit
                                if (!redirect_url && !/^(iom)$/i.test(Client.get('landing_company_shortcode'))) {
                                    redirect_url = Url.urlFor('cashier');
                                }
                            } else {
                                redirect_url = BinaryPjax.getPreviousUrl();
                            }

                            if (redirect_url) {
                                window.location.href = redirect_url; // load without pjax
                            } else {
                                Header.populateAccountsList(); // update account title
                                $('.select_currency').setVisibility(0);
                                $('#deposit_btn').setVisibility(1);
                            }
                        }
                    });
                } else {
                    $error.text(localize('Please choose a currency')).setVisibility(1);
                }
            };

            $('.currency_wrapper').on('click', function () {
                const $clicked_currency = $(this);
                const currency          = $clicked_currency.attr('id');
                let localized_message   = '';
                let localized_footnote   = '';
                $error.setVisibility(0);
                $currency_list.find('> div').removeClass('selected');
                $clicked_currency.addClass('selected');
                if (isCryptocurrency(currency)) {
                    localized_message = localize('Are you sure you want to create your [_1] account now?', `<strong>${getCurrencyName(currency)} (${currency})</strong>`);
                    localized_footnote = `${localize('Note:')} ${localize('You may open one account for each supported cryptocurrency.')}`;
                } else {
                    localized_message = localize('Are you sure you want to create a fiat account in [_1]?', `${currency}`);
                    localized_footnote = `${localize('Note:')} ${localize('You are limited to one fiat account. You can change the currency of your fiat account anytime before you make a first-time deposit or create an MT5 account.')}`;
                }

                Dialog.confirm({
                    id             : 'set_currency_popup_container',
                    ok_text        : localize('Yes'),
                    cancel_text    : localize('Cancel'),
                    localized_title: localize('Create [_1] account', `${currency}`),
                    localized_message,
                    localized_footnote,
                    onConfirm,
                    onAbort        : () => $currency_list.find('> div').removeClass('selected'),
                });
            });
        });
    };

    return {
        onLoad,
    };
})();

module.exports = SetCurrency;

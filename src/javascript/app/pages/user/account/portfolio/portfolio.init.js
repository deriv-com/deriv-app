const Portfolio           = require('./portfolio').Portfolio;
const ViewPopup           = require('../../view_popup/view_popup');
const Client              = require('../../../../base/client');
const BinarySocket        = require('../../../../base/socket');
const formatMoney         = require('../../../../common/currency').formatMoney;
const GetAppDetails       = require('../../../../common/get_app_details');
const SubscriptionManager = require('../../../../../_common/base/subscription_manager').default;
const localize            = require('../../../../../_common/localize').localize;
const urlParam            = require('../../../../../_common/url').param;
const getPropertyValue    = require('../../../../../_common/utility').getPropertyValue;
const showLoadingImage    = require('../../../../../_common/utility').showLoadingImage;

const PortfolioInit = (() => {
    let values,
        currency,
        oauth_apps,
        is_initialized,
        is_first_response,
        $portfolio_loading;

    const init = () => {
        updateBalance();

        if (is_initialized) return;

        values             = {};
        currency           = '';
        oauth_apps         = {};
        $portfolio_loading = $('#portfolio-loading');
        $portfolio_loading.show();
        showLoadingImage($portfolio_loading[0]);
        is_first_response = true;
        BinarySocket.send({ portfolio: 1 }).then((response) => {
            updatePortfolio(response);
        });
        // Subscribe to transactions to auto update new purchases
        SubscriptionManager.subscribe('transaction', { transaction: 1, subscribe: 1 }, transactionResponseHandler);
        BinarySocket.send({ oauth_apps: 1 }).then((response) => {
            updateOAuthApps(response);
        });
        is_initialized = true;

        // Display ViewPopup according to contract_id in query string
        const contract_id = urlParam('contract_id');
        if (contract_id) {
            ViewPopup.init($('<div />', { contract_id }).get(0));
        }
    };

    const createPortfolioRow = (data, is_first) => {
        const new_class = is_first ? '' : 'new';
        const $div      = $('<div/>');
        $div.append($('<tr/>', { class: `tr-first ${new_class} ${data.contract_id}`, id: data.contract_id })
            .append($('<td/>', { class: 'ref' }).append($(`<span ${GetAppDetails.showTooltip(data.app_id, oauth_apps[data.app_id])} data-balloon-position="right">${data.transaction_id}</span>`)))
            .append($('<td/>', { class: 'payout' }).append($('<strong/>', { html: +data.payout ? formatMoney(data.currency, data.payout) : '-' })))
            .append($('<td/>', { class: 'details', text: data.longcode }))
            .append($('<td/>', { class: 'purchase' }).append($('<strong/>', { html: formatMoney(data.currency, data.buy_price) })))
            .append($('<td/>', { class: 'indicative' }).append($('<strong/>', { class: 'indicative_price', text: '--.--' })))
            .append($('<td/>', { class: 'button' }).append($('<button/>', { class: 'button open_contract_details nowrap', contract_id: data.contract_id, text: localize('View') }))))
            .append($('<tr/>', { class: `tr-desc ${new_class} ${data.contract_id}` }).append($('<td/>', { colspan: '6', text: data.longcode })));

        $('#portfolio-body').prepend($div.html());
    };

    const updateBalance = () => {
        const $portfolio_balance = $('#portfolio-balance');
        if ($portfolio_balance.length === 0) return;
        $portfolio_balance.html(Portfolio.getBalance(Client.get('balance'), Client.get('currency')));
        const $if_balance_zero = $('#if-balance-zero');
        if (Client.get('balance') > 0 || Client.get('is_virtual')) {
            $if_balance_zero.setVisibility(0);
        } else {
            $if_balance_zero.setVisibility(1);
        }
    };

    const updatePortfolio = (data) => {
        if (getPropertyValue(data, 'error')) {
            errorMessage(data.error.message);
            return;
        }

        let portfolio_data;
        if (data.portfolio.contracts.length !== 0) {
            /**
             * User has at least one contract
             */
            $('#portfolio-no-contract').hide();
            $.each(data.portfolio.contracts, (ci, c) => {
                // TODO: remove ico exception when all ico contracts are removed
                if (!getPropertyValue(values, c.contract_id) && c.contract_type !== 'BINARYICO') {
                    values[c.contract_id]           = {};
                    values[c.contract_id].buy_price = c.buy_price;
                    portfolio_data                  = Portfolio.getPortfolioData(c);
                    currency                        = portfolio_data.currency;
                    createPortfolioRow(portfolio_data, is_first_response);
                    setTimeout(() => {
                        $(`tr.${c.contract_id}`).removeClass('new');
                    }, 1000);
                }
            });
        }
        // no open contracts
        if (!portfolio_data) {
            $('#portfolio-no-contract').show();
            $('#portfolio-table').setVisibility(0);
        } else {
            $('#portfolio-table').setVisibility(1);
            // update footer area data
            updateFooter();

            // request "proposal_open_contract"
            BinarySocket.send({ proposal_open_contract: 1, subscribe: 1 }, { callback: updateIndicative });
        }
        // ready to show portfolio table
        $portfolio_loading.hide();
        $('#portfolio-content').setVisibility(1);
        is_first_response = false;
    };

    const transactionResponseHandler = (response) => {
        if (getPropertyValue(response, 'error')) {
            errorMessage(response.error.message);
        } else if (response.transaction.action === 'buy') {
            BinarySocket.send({ portfolio: 1 }).then((res) => {
                updatePortfolio(res);
            });
        } else if (response.transaction.action === 'sell') {
            removeContract(response.transaction.contract_id);
        }
    };

    const updateIndicative = (data) => {
        if (getPropertyValue(data, 'error') || !values) {
            return;
        }

        const proposal = Portfolio.getProposalOpenContract(data.proposal_open_contract);
        // avoid updating 'values' before the new contract row added to the table
        if (!getPropertyValue(values, proposal.contract_id)) {
            return;
        }

        // force to sell the expired contract, in order to remove from portfolio
        if (+proposal.is_settleable === 1 && !proposal.is_sold) {
            BinarySocket.send({ sell_expired: 1 });
        }
        const $td = $(`#${proposal.contract_id}`).find('td.indicative');

        const old_indicative = values[proposal.contract_id].indicative || 0.00;
        values[proposal.contract_id].indicative = proposal.bid_price;

        let status_class   = '';
        let no_resale_html = '';
        if (+proposal.is_sold === 1) {
            removeContract(proposal.contract_id);
        } else {
            if (+proposal.is_valid_to_sell !== 1) {
                no_resale_html = $('<span/>', { class: 'message', text: localize('Resale not offered') });
                $td.addClass('no_resale');
            } else {
                if (values[proposal.contract_id].indicative !== old_indicative) {
                    status_class = values[proposal.contract_id].indicative > old_indicative ? 'price_moved_up' : 'price_moved_down';
                }
                $td.removeClass('no_resale');
            }
            $td.html($('<strong/>', { class: `indicative_price ${status_class}`, html: formatMoney(proposal.currency, values[proposal.contract_id].indicative) })
                .append(no_resale_html));
        }

        updateFooter();
    };

    const updateOAuthApps = (response) => {
        oauth_apps = GetAppDetails.buildOauthApps(response);
        GetAppDetails.addTooltip(oauth_apps);
    };

    const removeContract = (contract_id) => {
        delete (values[contract_id]);
        $(`tr.${contract_id}`)
            .removeClass('new')
            .css('opacity', '0.5')
            .fadeOut(1000, function () {
                $(this).remove();
                if ($('#portfolio-body').find('tr').length === 0) {
                    $('#portfolio-table').setVisibility(0);
                    $('#cost-of-open-positions, #value-of-open-positions').text('');
                    $('#portfolio-no-contract').show();
                }
            });
        updateFooter();
    };

    const updateFooter = () => {
        $('#cost-of-open-positions').html(formatMoney(currency, Portfolio.getSumPurchase(values)));
        $('#value-of-open-positions').html(formatMoney(currency, Portfolio.getIndicativeSum(values)));
    };

    const errorMessage = (msg) => {
        const $err = $('#portfolio').find('#error-msg');
        if (msg) {
            $err.setVisibility(1).text(msg);
            $portfolio_loading.hide();
        } else {
            $err.setVisibility(0).text('');
        }
    };

    const onLoad = () => {
        init();
        ViewPopup.viewButtonOnClick('#portfolio-table');
    };

    const onUnload = () => {
        BinarySocket.send({ forget_all: ['proposal_open_contract'] });
        SubscriptionManager.forget('transaction', transactionResponseHandler);
        $('#portfolio-body').empty();
        $('#portfolio-content').setVisibility(0);
        is_initialized = false;
    };

    const onReconnect = () => {
        BinarySocket.wait('authorize', 'website_status').then(() => {
            BinarySocket.send({ forget_all: ['proposal_open_contract'] });
            SubscriptionManager.forgetAll('transaction').then(() => {
                $('#portfolio-body').empty();
                $('#portfolio-content').setVisibility(0);
                is_initialized = false;
                init();
            });
        });
    };

    return {
        onReconnect,
        updateBalance,
        onLoad,
        onUnload,
    };
})();

module.exports = PortfolioInit;

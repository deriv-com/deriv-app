const PortfolioInit         = require('./account/portfolio/portfolio.init');
const updateContractBalance = require('../trade/update_values').updateContractBalance;
const Client                = require('../../base/client');
const BinarySocket          = require('../../base/socket');
const formatMoney           = require('../../common/currency').formatMoney;
const TopUpVirtualPopup     = require('../../pages/user/account/top_up_virtual/pop_up');
const getPropertyValue      = require('../../../_common/utility').getPropertyValue;

const updateBalance = (response) => {
    if (getPropertyValue(response, 'error')) {
        return;
    }
    BinarySocket.wait('website_status').then(() => {
        const balance = response.balance.balance;
        Client.set('balance', balance);
        PortfolioInit.updateBalance();
        const currency = response.balance.currency;
        if (!currency) {
            return;
        }
        const view = formatMoney(currency, balance);
        updateContractBalance(balance);
        $('.topMenuBalance, .binary-balance').html(view)
            .css('visibility', 'visible');
        TopUpVirtualPopup.init(balance);
    });
};

module.exports = updateBalance;

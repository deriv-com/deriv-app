const Client       = require('../../../../base/client');
const BinarySocket = require('../../../../base/socket');
const formatMoney  = require('../../../../common/currency').formatMoney;
const localize     = require('../../../../../_common/localize').localize;

const TopUpVirtual = (() => {
    let $views;

    const view_ids = {
        error  : '#viewError',
        success: '#viewSuccess',
    };

    const onLoad = () => {
        $views = $('#topup_virtual .viewItem');
        $views.setVisibility(0);

        BinarySocket.send({ topup_virtual: '1' }).then((response) => {
            if (response.error) {
                showMessage(response.error.message, false);
            } else {
                showMessage(
                    localize('[_1] has been credited into your Virtual Account: [_2].', [
                        formatMoney(response.topup_virtual.currency, response.topup_virtual.amount),
                        Client.get('loginid'),
                    ]),
                    true);
            }
            $('.barspinner').setVisibility(0);
        });
    };

    const showMessage = (message, is_success) => {
        const view_id = is_success ? view_ids.success : view_ids.error;
        setActiveView(view_id);
        $(`${view_id} > p`).html(message);
    };

    const setActiveView = (view_id) => {
        $views.setVisibility(0);
        $(view_id).setVisibility(1);
    };

    return {
        onLoad,
    };
})();

module.exports = TopUpVirtual;

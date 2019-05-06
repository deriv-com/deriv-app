const BinaryPjax     = require('../../../base/binary_pjax');
const Client         = require('../../../base/client');
const BinarySocket   = require('../../../base/socket');
const AccountOpening = require('../../../common/account_opening');
const FormManager    = require('../../../common/form_manager');
const getElementById = require('../../../../_common/common_functions').getElementById;
const State          = require('../../../../_common/storage').State;

const RealAccOpening = (() => {
    const form_id = '#frm_real';

    const onLoad = () => {
        if (Client.get('residence')) {
            if (AccountOpening.redirectAccount()) return;

            BinarySocket.wait('landing_company').then(() => {
                // TODO [->svg]
                if (State.getResponse('authorize.upgradeable_landing_companies').indexOf('svg') !== -1 ||
                    State.getResponse('authorize.upgradeable_landing_companies').indexOf('costarica') !== -1) {
                    getElementById('risk_disclaimer').setVisibility(1);
                }

                AccountOpening.populateForm(form_id, getValidations, false);

                FormManager.handleSubmit({
                    form_selector       : form_id,
                    obj_request         : { new_account_real: 1 },
                    fnc_response_handler: handleResponse,
                });
            });
        } else {
            BinaryPjax.loadPreviousUrl();
        }
        AccountOpening.showHidePulser(0);
        AccountOpening.registerPepToggle();
    };

    const getValidations = () => {
        let validations = AccountOpening.commonValidations().concat(AccountOpening.selectCheckboxValidation(form_id));
        const place_of_birth = State.getResponse('get_settings.place_of_birth');
        if (place_of_birth) {
            validations = validations.concat([{ request_field: 'place_of_birth', value: place_of_birth }]);
        }
        if (/^(malta|iom)$/.test(State.getResponse('authorize.upgradeable_landing_companies'))) {
            validations = validations.concat([{ selector: '#citizen', validations: ['req'] }]);
        }
        return validations;
    };

    const handleResponse = response => (AccountOpening.handleNewAccount(response, response.msg_type));

    const onUnload = () => { AccountOpening.showHidePulser(1); };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = RealAccOpening;

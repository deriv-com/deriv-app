const moment       = require('moment');
const GTM          = require('../../_common/base/gtm');
const Login        = require('../../_common/base/login');
const localize     = require('../../_common/localize').localize;
const State        = require('../../_common/storage').State;
const TabSelector  = require('../../_common/tab_selector');
const urlFor       = require('../../_common/url').urlFor;
const BinaryPjax   = require('../../app/base/binary_pjax');
const BinarySocket = require('../../app/base/socket');
const isEuCountry  = require('../../app/common/country_base').isEuCountry;
const FormManager  = require('../../app/common/form_manager');
const isBinaryApp  = require('../../config').isBinaryApp;

const Home = (() => {
    let clients_country;

    const onLoad = () => {
        Login.initOneAll();
        TabSelector.onLoad();

        BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
            clients_country = State.getResponse('website_status.clients_country');

            // we need to initiate selector after it becoming visible
            TabSelector.repositionSelector();

            const form_id = '#frm_verify_email';
            FormManager.init(form_id, [
                { selector: '#email', validations: ['req', 'email'], request_field: 'verify_email' },
                { request_field: 'type', value: 'account_opening' },
            ]);
            FormManager.handleSubmit({
                form_selector       : form_id,
                fnc_response_handler: handler,
                fnc_additional_check: checkCountry,
            });
            if (isEuCountry()) {
                $('.mfsa_message').slideDown(300);
            }
        });
    };

    const checkCountry = (req) => {
        if ((clients_country !== 'my') || /@binary\.com$/.test(req.verify_email)) {
            return true;
        }
        $('#frm_verify_email').find('div')
            .html($('<p/>', { class: 'notice-msg center-text', html: localize('Sorry, account signup is not available in your country.') }));
        return false;
    };

    const handler = (response) => {
        if (response.error) {
            $('#signup_error').setVisibility(1).text(response.error.message);
            return;
        }
        BinarySocket.wait('time').then(({ time }) => {
            const is_binary_app = isBinaryApp();

            GTM.pushDataLayer({
                event                   : 'email_submit',
                email_submit_input      : response.echo_req.verify_email,
                email_submit_days_passed: moment(time * 1000).utc().diff(moment.utc(localStorage.getItem('date_first_contact')), 'days'),
                email_submit_source     : is_binary_app ? 'desktop app' : 'binary.com',
            });

            if (is_binary_app) {
                BinaryPjax.load(urlFor('new_account/virtualws'));
            } else {
                $('.signup-box div').replaceWith($('<p/>', { text: localize('Thank you for signing up! Please check your email to complete the registration process.'), class: 'gr-10 gr-centered center-text' }));
                $('#social-signup').setVisibility(0);
            }
        });
    };

    const onUnload = () => {
        TabSelector.onUnload();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Home;

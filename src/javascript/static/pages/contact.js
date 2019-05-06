const initPhoneNumber = require('./contact_2').initPhoneNumber;
const Elevio          = require('../../_common/base/elevio');

const Contact = (() => {
    const onLoad = () => {
        initPhoneNumber(true);
        window._elev.on('ready', embedElevioComponents); // eslint-disable-line no-underscore-dangle

        $('#contact_loading').remove();
        $('#contact').setVisibility(1);
    };

    const embedElevioComponents = () => {
        const component_types = ['menu', 'search', 'suggestions'];
        component_types.forEach((type) => {
            $(`#elevio_element_${type}`).html(Elevio.createComponent(type));
        });

        // Open support module when submit_ticket is set on query string
        if (/submit_ticket=true/.test(window.location.search)) {
            window._elev.openModule('support'); // eslint-disable-line no-underscore-dangle
        }
    };

    return {
        onLoad,
    };
})();

module.exports = Contact;

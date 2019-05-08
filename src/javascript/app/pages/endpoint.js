const getAppId     = require('../../config').getAppId;
const getSocketURL = require('../../config').getSocketURL;

const Endpoint = (() => {
    const onLoad = () => {
        const $server_url = $('#server_url');
        const $app_id     = $('#app_id');
        $server_url.val(getSocketURL().split('/')[2]);
        $app_id.val(getAppId());

        $('#frm_endpoint').on('submit', (e) => {
            e.preventDefault();
            const server_url = $server_url.val().trim().toLowerCase();
            const app_id     = $app_id.val().trim();
            if (server_url) localStorage.setItem('config.server_url', server_url);
            if (app_id && !isNaN(app_id)) localStorage.setItem('config.app_id', parseInt(app_id));
            window.location.reload();
        });

        $('#reset_endpoint').on('click', () => {
            localStorage.removeItem('config.server_url');
            localStorage.removeItem('config.app_id');
            window.location.reload();
        });
    };

    return {
        onLoad,
    };
})();

module.exports = Endpoint;

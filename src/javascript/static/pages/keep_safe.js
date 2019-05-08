const BinarySocket = require('../../app/base/socket');
const isIndonesia  = require('../../app/common/country_base').isIndonesia;
const isBinaryApp  = require('../../config').isBinaryApp;

const KeepSafe = (() => {
    const onLoad = () => {
        BinarySocket.wait('website_status').then(() => {
            $('.desktop-app').setVisibility(isIndonesia() && !isBinaryApp());
        });
    };

    return {
        onLoad,
    };
})();

module.exports = KeepSafe;

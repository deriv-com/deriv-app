const moment        = require('moment');
const urlForStatic  = require('./url').urlForStatic;
const getStaticHash = require('./utility').getStaticHash;

// only reload if it's more than 10 minutes since the last reload
const shouldForceReload = last_reload => !last_reload || +last_reload + (10 * 60 * 1000) < moment().valueOf();

// calling this method is handled by GTM tags
const checkNewRelease = () => {
    const last_reload = localStorage.getItem('new_release_reload_time');
    if (!shouldForceReload(last_reload)) return false;
    localStorage.setItem('new_release_reload_time', moment().valueOf());

    const current_hash = getStaticHash();
    const xhttp        = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
        if (+xhttp.readyState === 4 && +xhttp.status === 200) {
            const latest_hash = xhttp.responseText;
            if (latest_hash && current_hash && latest_hash !== current_hash) {
                window.location.reload(true);
            }
        }
    };
    xhttp.open('GET', urlForStatic(`version?${Math.random().toString(36).slice(2)}`), true);
    xhttp.send();

    return true;
};

module.exports = {
    shouldForceReload,
    checkNewRelease,
};

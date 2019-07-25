import { flow }            from 'mobx';
import BinarySocket        from '_common/base/socket_base';
import { localize }        from 'App/i18n';
import { redirectToLogin } from '_common/base/login';
import { WS }              from 'Services';

export const showUnavailableLocationError = flow(function* (showError) {
    const website_status = yield BinarySocket.wait('website_status');
    const residence_list = yield WS.residenceList();

    const clients_country_code = website_status.website_status.clients_country;
    const clients_country_text =
        (residence_list.residence_list.find(obj_country =>
            obj_country.value === clients_country_code) || {}).text;

    showError(
        localize('If you have an account, log in to continue.'),
        (clients_country_text ? localize('Sorry, this app is unavailable in {{clients_country}}.', { clients_country: clients_country_text }) : localize('Sorry, this app is unavailable in your current location.')),
        localize('Log in'),
        redirectToLogin,
        false,
    );
});

export const isMarketClosed = (active_symbols = [], symbol) => {
    if (!active_symbols.length) return false;
    return (active_symbols.filter(x => x.symbol === symbol)[0]) ?
        !active_symbols.filter(symbol_info => symbol_info.symbol === symbol)[0].exchange_is_open
        :
        false;
};

export const getSymbolDisplayName = (active_symbols = [], symbol) => (
    (active_symbols.find(symbol_info => symbol_info.symbol.toUpperCase() === symbol.toUpperCase()) || { display_name: '' })
        .display_name
);

import { flow }            from 'mobx';
import { WS }              from 'Services';
import { localize }        from '_common/localize';
import { redirectToLogin } from '_common/base/login';
import BinarySocket        from '_common/base/socket_base';

export const pickDefaultSymbol = (active_symbols = []) => {
    if (!active_symbols.length) return '';
    return active_symbols.filter(symbol_info => /major_pairs|random_index/.test(symbol_info.submarket))[0].symbol;
};

export const showUnavailableLocationError = flow(function* (showError) {
    const website_status = yield BinarySocket.wait('website_status');
    const residence_list = yield WS.residenceList();

    const clients_country_code = website_status.website_status.clients_country;
    const clients_country_text =
        (residence_list.residence_list.find(obj_country =>
            obj_country.value === clients_country_code) || {}).text;

    showError(
        localize('If you have an account, log in to continue.'),
        (clients_country_text ? localize('Sorry, this app is unavailable in [_1].', clients_country_text) : localize('Sorry, this app is unavailable in your current location.')),
        localize('Log in'),
        redirectToLogin,
        false,
    );
});

export const isMarketClosed = (active_symbols = [], symbol) => {
    if (!active_symbols.length) return true;
    return (active_symbols.filter(x => x.symbol === symbol)[0]) ?
        !active_symbols.filter(symbol_info => symbol_info.symbol === symbol)[0].exchange_is_open
        :
        false;
};

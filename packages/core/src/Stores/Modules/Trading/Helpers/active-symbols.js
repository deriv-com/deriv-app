import { flow }            from 'mobx';
import BinarySocket        from '_common/base/socket_base';
import { localize }        from 'deriv-translations';
import { LocalStore }      from '_common/storage';
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

export const pickDefaultSymbol = (active_symbols = []) => {
    if (!active_symbols.length) return '';
    return getFavoriteOpenSymbol(active_symbols) || getFirstOpenSymbol(active_symbols);
};

const getFavoriteOpenSymbol = (active_symbols) => {
    const chart_favorites = LocalStore.get('cq-favorites');
    if (!chart_favorites) return undefined;
    const client_favorite_markets = JSON.parse(chart_favorites)['chartTitle&Comparison'];

    const client_favorite_list = client_favorite_markets
        .map(client_fav_symbol => active_symbols
            .find(symbol_info => symbol_info.symbol === client_fav_symbol));
    if (client_favorite_list) {
        const client_first_open_symbol = client_favorite_list
            .filter(symbol => symbol).find(isSymbolOpen);
        if (client_first_open_symbol) return client_first_open_symbol.symbol;
    }
    return undefined;
};

const getFirstOpenSymbol = (active_symbols) => {
    const first_open_symbol = active_symbols
        .filter(symbol_info => /major_pairs|random_index/.test(symbol_info.submarket))
        .find(isSymbolOpen);
    if (first_open_symbol) return first_open_symbol.symbol;
    return active_symbols.find(symbol_info => symbol_info.submarket === 'major_pairs').symbol;
};

const isSymbolOpen = (symbol) => (
    symbol.exchange_is_open === 1
);

export const getSymbolDisplayName = (active_symbols = [], symbol) => (
    (active_symbols.find(symbol_info => symbol_info.symbol.toUpperCase() === symbol.toUpperCase()) || { display_name: '' })
        .display_name
);

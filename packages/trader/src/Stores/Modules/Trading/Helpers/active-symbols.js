import { flow } from 'mobx';
import { LocalStore, redirectToLogin } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';

export const showUnavailableLocationError = flow(function* (showError, is_logged_in) {
    const website_status = yield WS.wait('website_status');
    const residence_list = yield WS.residenceList();

    const clients_country_code = website_status.website_status.clients_country;
    const clients_country_text = (
        residence_list.residence_list.find(obj_country => obj_country.value === clients_country_code) || {}
    ).text;

    const header = clients_country_text
        ? localize('Sorry, this app is unavailable in {{clients_country}}.', {
              clients_country: clients_country_text,
          })
        : localize('Sorry, this app is unavailable in your current location.');

    showError({
        message: localize('If you have an account, log in to continue.'),
        header,
        redirect_label: localize('Log in'),
        redirectOnClick: () => redirectToLogin(is_logged_in, getLanguage()),
        should_show_refresh: false,
    });
});

export const isMarketClosed = (active_symbols = [], symbol) => {
    if (!active_symbols.length) return false;
    return active_symbols.filter(x => x.symbol === symbol)[0]
        ? !active_symbols.filter(symbol_info => symbol_info.symbol === symbol)[0].exchange_is_open
        : false;
};

export const pickDefaultSymbol = async (active_symbols = []) => {
    if (!active_symbols.length) return '';
    const fav_open_symbol = await getFavoriteOpenSymbol(active_symbols);
    if (fav_open_symbol) return fav_open_symbol;
    const default_open_symbol = await getDefaultOpenSymbol(active_symbols);
    return default_open_symbol;
};

const getFavoriteOpenSymbol = async active_symbols => {
    try {
        const chart_favorites = LocalStore.get('cq-favorites');
        if (!chart_favorites) return undefined;
        const client_favorite_markets = JSON.parse(chart_favorites)['chartTitle&Comparison'];

        const client_favorite_list = client_favorite_markets.map(client_fav_symbol =>
            active_symbols.find(symbol_info => symbol_info.symbol === client_fav_symbol)
        );
        if (client_favorite_list) {
            const client_first_open_symbol = client_favorite_list.filter(symbol => symbol).find(isSymbolOpen);
            if (client_first_open_symbol) {
                const is_symbol_offered = await isSymbolOffered(client_first_open_symbol);
                if (is_symbol_offered) return client_first_open_symbol.symbol;
            }
        }
        return undefined;
    } catch (error) {
        return undefined;
    }
};

const getDefaultOpenSymbol = async active_symbols => {
    const default_open_symbol =
        (await findSymbol(active_symbols, '1HZ100V')) ||
        (await findFirstSymbol(active_symbols, /random_index/)) ||
        (await findFirstSymbol(active_symbols, /major_pairs/));
    if (default_open_symbol) return default_open_symbol.symbol;
    return active_symbols.find(symbol_info => symbol_info.submarket === 'major_pairs').symbol;
};

const findSymbol = async (active_symbols, symbol) => {
    const first_symbol = active_symbols.find(symbol_info => symbol_info.symbol === symbol && isSymbolOpen(symbol_info));
    const is_symbol_offered = await isSymbolOffered(first_symbol);
    if (is_symbol_offered) return first_symbol;
    return undefined;
};

const findFirstSymbol = async (active_symbols, pattern) => {
    const first_symbol = active_symbols.find(
        symbol_info => pattern.test(symbol_info.submarket) && isSymbolOpen(symbol_info)
    );
    const is_symbol_offered = await isSymbolOffered(first_symbol);
    if (is_symbol_offered) return first_symbol;
    return undefined;
};

const isSymbolOpen = symbol => symbol.exchange_is_open === 1;

const isSymbolOffered = async symbol_info => {
    const r = await WS.storage.contractsFor(symbol_info?.symbol);
    return !['InvalidSymbol', 'InputValidationFailed'].includes(r.error?.code);
};

export const getSymbolDisplayName = (active_symbols = [], symbol) =>
    (
        active_symbols.find(symbol_info => symbol_info.symbol.toUpperCase() === symbol.toUpperCase()) || {
            display_name: '',
        }
    ).display_name;

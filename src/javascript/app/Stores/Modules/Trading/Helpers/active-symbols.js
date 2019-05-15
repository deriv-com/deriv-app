import { WS }              from 'Services';
import { localize }        from '_common/localize';
import { redirectToLogin } from '_common/base/login';
import BinarySocket        from '_common/base/socket_base';

export const pickDefaultSymbol = (active_symbols = []) => {
    if (!active_symbols.length) return '';
    return active_symbols.filter(symbol_info => /major_pairs|random_index/.test(symbol_info.submarket))[0].symbol;
};

export const showUnavailableLocationError = async (root_store) => {
    const website_status = await BinarySocket.wait('website_status');
    const residence_list = await WS.residenceList();
    const clients_country_code = website_status.website_status.clients_country;
    const clients_country_text =
        (residence_list.residence_list.find(obj_country =>
            obj_country.value === clients_country_code) || {}).text;

    root_store.common.showError(
        localize('If you have an account, log in to continue.'),
        (clients_country_text ? localize('Sorry, this app is unavailable in [_1].', clients_country_text) : localize('Sorry, this app is unavailable in your current location.')),
        localize('Log in'),
        redirectToLogin,
        false,
    );
};

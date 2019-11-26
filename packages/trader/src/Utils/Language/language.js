import { urlFor }                       from '_common/language';
import { getLanguage, getAllLanguages } from 'deriv-translations';

export const currentLanguage = getLanguage();

export const getAllowedLanguages = () => {
    const exclude_languages = [
        'ACH',
    ];
    // TODO Change language_list to const when design is ready.
    let language_list = Object.keys(getAllLanguages())
        .filter(key => !(exclude_languages.includes(key)))
        .reduce((obj, key) => {
            obj[key] = getAllLanguages()[key];
            return obj;
        }, {});

    // TODO Remove this one line below when design is ready.
    language_list = { EN: 'English' };
    return language_list;
};

export const getURL = lang => urlFor(lang);

import { get, getAll, urlFor } from '_common/language';

export const currentLanguage = get();

export const getAllowedLanguages = () => {
    const exclude_languages = [
        'ACH',
    ];
    // TODO Change language_list to const when design is ready.
    let language_list = Object.keys(getAll())
        .filter(key => !(exclude_languages.includes(key)))
        .reduce((obj, key) => {
            obj[key] = getAll()[key];
            return obj;
        }, {});

    // TODO Remove this one line below when design is ready.
    language_list = { EN: 'English' };
    return language_list;
};

export const getURL = lang => urlFor(lang);

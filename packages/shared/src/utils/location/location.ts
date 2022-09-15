type TLocationList = {
    identity: {
        services: {
            idv: object;
            onfido: object;
        };
    };
    phone_idd: string;
    text: string;
    value: string;
};

export const getLocation = (location_list: TLocationList[], value: string, type: 'text' | 'value') => {
    const location_obj = location_list.find(
        location => location[type === 'text' ? 'value' : 'text'].toLowerCase() === value.toLowerCase()
    );

    if (location_obj) return location_obj[type];
    return '';
};

// eu countries to support
const eu_countries = [
    'it',
    'de',
    'fr',
    'lu',
    'gr',
    'mf',
    'es',
    'sk',
    'lt',
    'nl',
    'at',
    'bg',
    'si',
    'cy',
    'be',
    'ro',
    'hr',
    'pt',
    'pl',
    'lv',
    'ee',
    'cz',
    'fi',
    'hu',
    'dk',
    'se',
    'ie',
    'im',
    'gb',
    'mt',
];
// check if client is from EU
export const isEuCountry = (country: string) => eu_countries.includes(country);

import { getAll as getAllLanguages } from '_common/language';

/*
 * Retrieves basename from current url
 *
 * @return {string} returns the basename of current url
 */
const getBaseName = () => {
    const regex_string = `(.*/(${Object.keys(getAllLanguages()).join('|')})(/index\\.html)?).*`;
    const basename = new RegExp(regex_string, 'ig').exec(window.location.pathname);

    if (basename && basename.length) {
        return basename[1];
    }

    return '/en/';
};

export default getBaseName;

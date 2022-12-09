import { deriv_urls } from '../url/constants';

export const alternateLinkTagChange = () => {
    const current_search_params = new URLSearchParams(location.search);
    const current_lang = current_search_params.get('lang')
        ? `${current_search_params.get('lang')?.toLowerCase()}`
        : 'en';

    const alternate_rel_link = document.querySelector("link[rel='alternate']");
    alternate_rel_link?.setAttribute('hreflang', current_lang);
    alternate_rel_link?.setAttribute('href', `${deriv_urls.DERIV_APP_PRODUCTION}${location.pathname}`);
};

export const canonicalLinkTagChange = () => {
    const canonical_rel_link = document.querySelector("link[rel='canonical']");
    canonical_rel_link?.setAttribute('href', `${deriv_urls.DERIV_APP_PRODUCTION}${location.pathname}`);
};

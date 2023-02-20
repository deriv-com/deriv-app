import { deriv_urls } from '../url/constants';

export const alternateLinkTagChange = () => {
    const current_search_params = new URLSearchParams(location.search);
    const current_lang = current_search_params.get('lang')
        ? `${current_search_params.get('lang')?.toLowerCase()}`
        : 'en';

    const alternate_rel_link = document.querySelector("link[rel='alternate']");
    alternate_rel_link?.setAttribute('hreflang', `${current_lang}-${current_lang.toUpperCase()}`);
    alternate_rel_link?.setAttribute('href', `${deriv_urls.DERIV_APP_PRODUCTION}${location.pathname}`);
};

export const canonicalLinkTagChange = () => {
    const canonical_rel_link = document.querySelector("link[rel='canonical']");
    canonical_rel_link?.setAttribute('href', `${deriv_urls.DERIV_APP_PRODUCTION}${location.pathname}`);
};

export const changeMetaTagWithOG = (og_property: string, content: string) => {
    const property = `'og:${og_property}'`;
    const og_description_meta_tag = document.querySelector(`meta[property=${property}]`);
    const current_description_content = og_description_meta_tag?.getAttribute('content') || '';
    og_description_meta_tag?.setAttribute('content', content);

    return () => {
        og_description_meta_tag?.setAttribute('content', current_description_content);
    };
};

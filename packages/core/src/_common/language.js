const Language = (() => {
    const urlForLanguage = (lang, url = window.location.href) => {
        if (/[&?]lang=(\w*)/i.test(url)) {
            return url.replace(/lang=(\w*)/, `lang=${lang?.trim().toUpperCase() || 'EN'}`);
        }

        const current_url = new URL(url);
        const params = new URLSearchParams(current_url.search.slice(1));

        params.append('lang', lang);

        return `${url.split('?')[0]}?${params.toString()}`;
    };

    return {
        urlFor: urlForLanguage,
    };
})();

module.exports = Language;

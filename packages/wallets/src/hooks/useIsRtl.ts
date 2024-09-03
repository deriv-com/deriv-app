const useIsRtl = () => {
    const i18nLanguage = localStorage.getItem('i18n_language');
    return i18nLanguage === 'AR';
};

export default useIsRtl;

import React from 'react';
import { initMoment } from '../../../shared/src/utils/date';
import i18n, { getInitialLanguage } from '../i18next/utils';

const useOnLoadTranslation = () => {
    const [is_loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        if (!i18n.language) {
            i18n.language = getInitialLanguage();
        }
        const is_english = i18n.language === 'EN';

        if (is_english) {
            setLoaded(true);
        } else {
            i18n.store.on('added', () => {
                setLoaded(true);
            });
        }

        return () => i18n.store.off('added');
    }, []);

    initMoment(i18n.language);
    return [is_loaded, setLoaded];
};

export default useOnLoadTranslation;

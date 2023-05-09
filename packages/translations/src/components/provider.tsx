import React, { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18next/utils';
import useOnLoadTranslation from '../hooks/use-onload-translation';

type TranslationProviderProps = {
    children: ReactNode;
};

const TranslationProvider = ({ children }: TranslationProviderProps) => {
    const [is_translation_loaded] = useOnLoadTranslation();

    return <I18nextProvider i18n={i18n}>{is_translation_loaded ? children : <React.Fragment />}</I18nextProvider>;
};

export default TranslationProvider;

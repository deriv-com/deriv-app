import React, { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18next/utils';

type TranslationProviderProps = {
    children: ReactNode;
};

const TranslationProvider = ({ children }: TranslationProviderProps) => {
    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationProvider;

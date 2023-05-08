import React, { ComponentProps } from 'react';
import { useTranslation, Trans } from 'react-i18next';

type TLocalize = {
    i18n_default_text: string;
    options?: Record<string, string>;
};

const Localize = ({
    i18n_default_text,
    options,
    values,
    components,
    shouldUnescape,
}: TLocalize & ComponentProps<typeof Trans>) => {
    const { i18n } = useTranslation('translation', { useSuspense: false });

    return (
        <Trans
            i18n={i18n}
            defaults={i18n_default_text}
            values={values}
            components={components}
            tOptions={options}
            shouldUnescape={shouldUnescape}
        />
    );
};

export default Localize;

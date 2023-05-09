import React, { ComponentProps } from 'react';
import { Trans } from 'react-i18next';

type TLocalize = {
    i18n_default_text: string;
    options?: Record<string, string>;
};

const Localize = ({ i18n_default_text, options, ...props }: TLocalize & ComponentProps<typeof Trans>) => {
    return (
        <Trans tOptions={options} {...props}>
            {i18n_default_text}
        </Trans>
    );
};

export default Localize;

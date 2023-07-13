import React, { ComponentProps } from 'react';
import { Trans } from 'react-i18next';

type TLocalize = {
    i18n_default_text: string;
};

const Localize = ({ i18n_default_text, ...props }: TLocalize & ComponentProps<typeof Trans>) => {
    return <Trans {...props}>{i18n_default_text}</Trans>;
};

export default Localize;

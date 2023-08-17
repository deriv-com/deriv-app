import React, { ComponentProps } from 'react';
import { Trans, Translation } from 'react-i18next';
import { useLanguageSettings } from '../hooks';

type TLocalize = {
    i18n_default_text: string;
};

const Localize = ({ i18n_default_text, components, values, ...props }: TLocalize & ComponentProps<typeof Trans>) => {
    if (Array.isArray(components) && components.length) {
        return <InterpolatedComponent i18n_default_text={i18n_default_text} components={components} {...props} />;
    }

    return <Translation>{t => <React.Fragment>{t(i18n_default_text, { ...values })}</React.Fragment>}</Translation>;
};

/**
 * For interpolation of jsx components, we have to use the <Trans /> component from i18n.
 * During the time of writing this code, it does not re-render when language is changed.
 * If any point they changed this, please remove the key props.
 */
const InterpolatedComponent = ({
    i18n_default_text,
    components,
    values,
    ...props
}: TLocalize & ComponentProps<typeof Trans>) => {
    const { current_language } = useLanguageSettings();

    return (
        <Trans key={`${current_language}_${i18n_default_text}`} values={values} components={components} {...props}>
            {i18n_default_text}
        </Trans>
    );
};

export default Localize;

import PropTypes        from 'prop-types';
import React            from 'react';
import { Trans }        from 'react-i18next';
import { i18n }         from '../i18next'

const Localize = ({ i18n_default_text, values, components, options }) => (
    <Trans
        i18n={i18n}
        defaults={i18n_default_text}
        values={values}
        components={components}
        tOptions={options}
    />
);

Localize.propTypes = {
    components       : PropTypes.arrayOf(PropTypes.node),
    i18n_default_text: PropTypes.string,
    values           : PropTypes.object,
};

export default Localize;

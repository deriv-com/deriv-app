import PropTypes        from 'prop-types';
import React            from 'react';
import { Trans }        from 'react-i18next';
// Trans needs to have the i18n instance in scope
/* eslint-disable no-unused-vars */
import i18n             from '../i18next/i18next';
/* eslint-enable no-unused-vars */

const Localize = ({ i18n_default_text, values, components, options }) => (
    <Trans
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

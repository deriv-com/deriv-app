import PropTypes        from 'prop-types';
import React            from 'react';
import { Trans }        from 'react-i18next';

const Localize = ({ i18n_default_text, values, components }) => (
    <Trans defaults={i18n_default_text} values={values} components={components} />
);

Localize.propTypes = {
    i18n_default_text: PropTypes.string,
    values           : PropTypes.object,
    components       : PropTypes.arrayOf(PropTypes.node),
};

export default Localize;

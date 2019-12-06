import PropTypes from 'prop-types';
import React     from 'react';
import { Trans } from 'react-i18next';

const Localize = ({ i18n_default_text, values, components, options, i18n }) => (
    <Trans
        i18n={i18n}
        defaults={i18n_default_text}
        values={values}
        components={components}
        tOptions={options}
    />
);

// Trans needs to have the i18n instance in scope
const withI18n = i18n => props => <Localize i18n={i18n} {...props} />;

Localize.propTypes = {
    components       : PropTypes.arrayOf(PropTypes.node),
    i18n             : PropTypes.object.isRequired,
    i18n_default_text: PropTypes.string,
    values           : PropTypes.object,
};

export default withI18n;

import PropTypes from 'prop-types';
import React     from 'react';

const MediaIcon = ({ is_enabled, enabled, disabled }) => {
    const Icon = is_enabled ? enabled : disabled;
    return <Icon className='media__icon' />;
};

MediaIcon.propTypes = {
    disabled  : PropTypes.func,
    enabled   : PropTypes.func,
    is_enabled: PropTypes.bool,
};

export { MediaIcon };

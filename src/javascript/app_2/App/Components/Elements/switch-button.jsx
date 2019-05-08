import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const SwitchButton = ({ style, toggled }) => {
    const toggle_style = style || 'switch-button';
    const icon_class = classNames(toggle_style, {
        [`${toggle_style}--toggled`]: toggled,
    });

    return (
        <div className={icon_class} />
    );
};

SwitchButton.propTypes = {
    style  : PropTypes.string,
    toggled: PropTypes.bool,
};

export default SwitchButton;

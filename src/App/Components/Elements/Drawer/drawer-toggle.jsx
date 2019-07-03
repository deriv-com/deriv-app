import PropTypes    from 'prop-types';
import React        from 'react';
import SwitchButton from '../switch-button.jsx';

const DrawerToggle = ({
    text,
    to_toggle,
    toggle,
}) => (
    <div className='drawer-item__toggle' onClick={toggle}>
        <span>{text}</span>
        <SwitchButton
            toggled={to_toggle}
        />
    </div>
);

DrawerToggle.propTypes = {
    text     : PropTypes.string,
    to_toggle: PropTypes.bool,
    toggle   : PropTypes.func,
};

export { DrawerToggle };

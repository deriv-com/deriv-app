import classNames from 'classnames';
import React      from 'react';
import Icon       from 'Assets/icon.jsx';

const AccountWrapper = ({
    children,
    header,
    is_visible,
    toggleVisibility,
}) => (
    <React.Fragment>
        <div
            className={classNames('acc-switcher', { 'acc-info--show': !is_visible })}
            onClick={toggleVisibility}
        >
            <span className='acc-switcher__list-title'>
                {header}
            </span>
            <Icon icon='IconArrow' className='acc-info__select-arrow' />
        </div>
        {is_visible &&
            <React.Fragment>
                {children}
            </React.Fragment>
        }
    </React.Fragment>
);

export default AccountWrapper;

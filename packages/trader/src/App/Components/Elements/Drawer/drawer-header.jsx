import classNames    from 'classnames';
import PropTypes     from 'prop-types';
import React         from 'react';
import { localize }  from 'deriv-translations';
import Icon          from 'Assets/icon.jsx';

export const DrawerHeader = ({
    alignment,
    closeBtn,
}) => {
    const drawer_header_class = classNames('drawer__header', alignment);
    return (
        <React.Fragment>
            {alignment && alignment === 'right' ?
                <div className={drawer_header_class}>
                    <div className='drawer__icons drawer__icons-btn-close' onClick={closeBtn}>
                        <Icon icon='IconClose' className='drawer__icons-icon-close' />
                    </div>
                    <div className='drawer__notifications'>
                        <h4 className='drawer__notifications-header'>{localize('all notifications')}</h4>
                    </div>
                </div>
                :
                <div className={drawer_header_class}>
                    <div className='drawer__icons drawer__icons-btn-close' onClick={closeBtn}>
                        <Icon icon='IconClose' className='drawer__icons-icon-close' />
                    </div>
                    <div className='drawer__icons drawer__brand-logo'>
                        <div className='drawer__image' />
                    </div>
                </div>
            }
        </React.Fragment>
    );
};

DrawerHeader.propTypes = {
    alignment: PropTypes.string,
    closeBtn : PropTypes.func,
};

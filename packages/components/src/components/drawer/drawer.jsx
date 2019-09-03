import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import { Scrollbars }    from 'tt-react-custom-scrollbars';

const IconMinimize = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path className='color1-fill' fill='#000' fillOpacity='0.8' fillRule='nonzero' d='M0 7h16v2H0z' />
    </svg>
);

const Drawer = ({
    is_open,
    title,
    toggleDrawer,
}) => {
    retun(
        <CSSTransition
            appear
            in={is_open}
            timeout={250}
            classNames={{
                appear   : 'dc-drawer__container--enter',
                enter    : 'dc-drawer__container--enter',
                enterDone: 'dc-drawer__container--enter-done',
                exit     : 'dc-drawer__container--exit',
            }}
            unmountOnExit
        >
            <div
                className={classNames(
                    'dc-drawer', { 'dc-drawer--open': is_open })}
            >
                <div className='dc-drawer__header'>
                    {title && <span className='dc-drawer__title'>{title}</span>}
                    <div
                        className='dc-drawer__icon-close'
                        onClick={toggleDrawer}
                    >
                        <IconMinimize />
                    </div>
                </div>
                <div className='dc-drawer__body'>
                    <Scrollbars
                        style={{ width: '100%', height: '100%' }}
                        autoHide
                    >
                        {children}
                    </Scrollbars>
                </div>
                {footer &&
                    <div className='dc-drawer__footer'>
                        <footer />
                    </div>
                }
            </div>
        </CSSTransition>

    );
};

Drawer.propTypes = {
    is_open     : PropTypes.bool,
    title       : PropTypes.string,
    toggleDrawer: PropTypes.func,
};

export default Drawer;

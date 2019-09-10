import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Scrollbars }    from 'tt-react-custom-scrollbars';

const Drawer = ({
    alignment,
    children,
    className,
    footer,
    header,
    is_open,
}) => {
    return (
        <CSSTransition
            appear
            in={is_open}
            timeout={250}
            classNames={{
                appear   : 'dc-drawer--enter',
                enter    : 'dc-drawer--enter',
                enterDone: 'dc-drawer--enter-done',
                exit     : 'dc-drawer--exit',
            }}
            unmountOnExit
        >
            <div className={classNames('dc-drawer',
                alignment && `dc-drawer--${alignment}`,
                is_open   && 'dc-drawer--open',
                className && `dc-drawer--${className}`)}
            >
                {header &&
                    <div className={classNames('dc-drawer__header',
                        className && `dc-drawer__header--${className}`)}
                    >
                        {header}
                    </div>
                }
                <div className={classNames('dc-drawer__content',
                    className && `dc-drawer__content--${className}`)}
                >
                    <Scrollbars
                        style={{ width: '100%', height: '100%' }}
                        autoHide
                    >
                        {children}
                    </Scrollbars>
                </div>
                {footer &&
                    <div className={classNames('dc-drawer__footer',
                        className && `dc-drawer__footer--${className}`)}
                    >
                        {footer}
                    </div>
                }
            </div>
        </CSSTransition >
    );
};

Drawer.propTypes = {
    alignment: PropTypes.string,
    children : PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    footer: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
    ]),
    header: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
    ]),
    is_open: PropTypes.bool,
};

export default Drawer;

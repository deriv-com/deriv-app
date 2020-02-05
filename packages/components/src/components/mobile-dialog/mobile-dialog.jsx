import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Icon from 'Components/icon/icon.jsx';
import Div100vhContainer from '../div100vh-container';

const MobileDialog = props => {
    const { title, visible, children, portal_element_id, wrapper_classname } = props;

    const checkVisibility = () => {
        if (props.visible) {
            document.body.style.overflow = 'hidden';
            document.getElementById(portal_element_id).style.overflow = 'hidden';
        } else {
            document.body.style.overflow = null;
            document.getElementById(portal_element_id).style.overflow = null;
        }
    };

    const scrollToElement = (parent, el) => {
        const viewport_offset = el.getBoundingClientRect();
        const hidden = viewport_offset.top + el.clientHeight + 20 > window.innerHeight;
        if (hidden) {
            const new_el_top = (window.innerHeight - el.clientHeight) / 2;
            parent.scrollTop += viewport_offset.top - new_el_top;
        }
    };

    // sometimes input is covered by virtual keyboard on mobile chrome, uc browser
    const handleClick = e => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
            const scrollToTarget = scrollToElement(e.currentTarget, e.target);
            window.addEventListener('resize', scrollToTarget, false);

            // remove listener, resize is not fired on iOS safari
            window.setTimeout(() => {
                window.removeEventListener('resize', scrollToTarget, false);
            }, 2000);
        }
    };

    checkVisibility();
    if (!document.getElementById(portal_element_id)) return null;
    return ReactDOM.createPortal(
        <CSSTransition
            in={visible}
            timeout={250}
            classNames={{
                enter: 'dc-mobile-dialog--enter',
                enterDone: 'dc-mobile-dialog--enter-done',
                exit: 'dc-mobile-dialog--exit',
            }}
            unmountOnExit
        >
            <div className='dc-mobile-dialog' onClick={handleClick}>
                <Div100vhContainer height_offset='8px'>
                    <div className='dc-mobile-dialog__header'>
                        <h2 className='dc-mobile-dialog__title'>{title}</h2>
                        <div className='icons btn-close dc-mobile-dialog__close-btn' onClick={props.onClose}>
                            <Icon icon='IcCross' className='dc-mobile-dialog__close-btn-icon' />
                        </div>
                    </div>
                    <div className='dc-mobile-dialog__content'>
                        <div
                            className={classNames({
                                [`dc-mobile-dialog__${wrapper_classname}`]: wrapper_classname,
                            })}
                        >
                            {children}
                        </div>
                    </div>
                </Div100vhContainer>
            </div>
        </CSSTransition>,
        document.getElementById(portal_element_id)
    );
};

MobileDialog.propTypes = {
    children: PropTypes.any,
    onClose: PropTypes.func,
    portal_element_id: PropTypes.string.isRequired,
    title: PropTypes.string,
    visible: PropTypes.bool,
    wrapper_classname: PropTypes.string,
};

export default MobileDialog;

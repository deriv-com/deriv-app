import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Text from '../text/text';
import Icon from '../icon/icon';
import Div100vhContainer from '../div100vh-container';

const MobileDialog = props => {
    const {
        title,
        visible,
        children,
        has_full_height,
        portal_element_id,
        renderTitle,
        wrapper_classname,
        footer,
        has_close_icon = true,
        header_classname,
    } = props;

    const footer_ref = React.useRef(false);
    const [footer_height, setHeight] = React.useState(0);
    React.useLayoutEffect(() => {
        if (footer_ref.current && !footer_height) {
            setHeight(footer_ref.current.offsetHeight);
        }
    }, [footer, footer_height]);

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
        e.stopPropagation();
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
            appear
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
                <Div100vhContainer
                    className={classNames('dc-mobile-dialog__container', {
                        'dc-mobile-dialog__container--has-scroll': props.has_content_scroll,
                    })}
                    height_offset={props.content_height_offset || '8px'}
                >
                    <div className={classNames('dc-mobile-dialog__header', header_classname)}>
                        <Text
                            as='h2'
                            size='xs'
                            color='prominent'
                            weight='bold'
                            line_height='unset'
                            className='dc-mobile-dialog__title'
                        >
                            {renderTitle ? renderTitle() : title}
                        </Text>
                        {has_close_icon && (
                            <div className='icons dc-btn-close dc-mobile-dialog__close-btn' onClick={props.onClose}>
                                <Icon icon='IcCross' className='dc-mobile-dialog__close-btn-icon' />
                            </div>
                        )}
                    </div>
                    <div
                        className={classNames('dc-mobile-dialog__content', {
                            'dc-mobile-dialog__content--is-full-height': has_full_height,
                        })}
                        style={footer_height ? { height: `calc(100% - ${footer_height}px)` } : undefined}
                    >
                        <div
                            className={classNames({
                                [`dc-mobile-dialog__${wrapper_classname}`]: wrapper_classname,
                            })}
                        >
                            {children}
                        </div>
                    </div>
                    {footer && (
                        <div ref={footer_ref} className='dc-mobile-dialog__footer'>
                            {footer}
                        </div>
                    )}
                </Div100vhContainer>
            </div>
        </CSSTransition>,
        document.getElementById(portal_element_id)
    );
};

MobileDialog.propTypes = {
    content_height_offset: PropTypes.string,
    children: PropTypes.any,
    onClose: PropTypes.func,
    has_content_scroll: PropTypes.bool,
    has_close_icon: PropTypes.bool,
    portal_element_id: PropTypes.string.isRequired,
    renderTitle: PropTypes.func,
    title: PropTypes.string,
    visible: PropTypes.bool,
    wrapper_classname: PropTypes.string,
    header_classname: PropTypes.string,
};

export default MobileDialog;

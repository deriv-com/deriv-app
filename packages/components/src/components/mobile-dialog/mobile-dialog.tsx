import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';

import Div100vhContainer from '../div100vh-container';
import Icon from '../icon/icon';
import Text from '../text/text';
import ThemedScrollbars from '../themed-scrollbars';

type TMobileDialog = {
    content_height_offset?: string;
    footer?: React.ReactNode;
    has_content_scroll?: boolean;
    has_close_icon?: boolean;
    has_full_height?: boolean;
    header_classname?: string;
    info_banner?: React.ReactNode;
    onClose?: React.MouseEventHandler;
    portal_element_id: string;
    renderTitle?: () => string;
    title?: React.ReactNode;
    visible?: boolean;
    wrapper_classname?: string;
    footer_classname?: string;
    learn_more_banner?: React.ReactNode;
};

const MobileDialog = (props: React.PropsWithChildren<TMobileDialog>) => {
    const {
        children,
        footer,
        has_close_icon = true,
        has_full_height,
        header_classname,
        info_banner,
        portal_element_id,
        renderTitle,
        title,
        visible,
        wrapper_classname,
        footer_classname,
        learn_more_banner,
    } = props;

    const footer_ref = React.useRef<HTMLDivElement>(null);
    const [footer_height, setHeight] = React.useState(0);
    React.useLayoutEffect(() => {
        if (footer_ref.current && !footer_height) {
            setHeight(footer_ref.current.offsetHeight);
        }
    }, [footer, footer_height]);

    const portal_element = document.getElementById(portal_element_id);

    const checkVisibility = () => {
        if (props.visible) {
            document.body.style.overflow = 'hidden';
            if (portal_element) portal_element.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            if (portal_element) portal_element.style.overflow = 'unset';
        }
    };

    const scrollToElement = (parent: HTMLInputElement, el: HTMLInputElement) => {
        const viewport_offset = el.getBoundingClientRect();
        const hidden = viewport_offset.top + el.clientHeight + 20 > window.innerHeight;
        if (hidden) {
            const new_el_top = (window.innerHeight - el.clientHeight) / 2;
            parent.scrollTop += viewport_offset.top - new_el_top;
        }
    };

    // sometimes input is covered by virtual keyboard on mobile chrome, uc browser
    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        if (target.tagName !== 'A') e.stopPropagation();
        if (target.tagName === 'INPUT' && target.type === 'number') {
            const scrollToTarget = () => scrollToElement(e.currentTarget, target);
            window.addEventListener('resize', scrollToTarget, false);

            // remove listener, resize is not fired on iOS safari
            window.setTimeout(() => {
                window.removeEventListener('resize', scrollToTarget, false);
            }, 2000);
        }
    };

    checkVisibility();
    if (!portal_element) return null;
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
            <div data-testid='dt_mobile_dialog' className='dc-mobile-dialog' onClick={handleClick}>
                <Div100vhContainer
                    className={classNames('dc-mobile-dialog__container', {
                        'dc-mobile-dialog__container--has-scroll': props.has_content_scroll,
                        'dc-mobile-dialog__container--has-info-banner': info_banner || learn_more_banner,
                    })}
                    height_offset={props.content_height_offset || '8px'}
                >
                    <ThemedScrollbars
                        is_bypassed={!info_banner && !learn_more_banner}
                        is_scrollbar_hidden
                        className={
                            info_banner || learn_more_banner
                                ? classNames('dc-mobile-dialog__header-wrapper', header_classname)
                                : ''
                        }
                    >
                        <div
                            className={classNames(
                                'dc-mobile-dialog__header',
                                !info_banner && !learn_more_banner && header_classname
                            )}
                        >
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
                                <div
                                    data-testid='dt_dc_mobile_dialog_close_btn'
                                    className='icons dc-btn-close dc-mobile-dialog__close-btn'
                                    onClick={props.onClose}
                                >
                                    <Icon icon='IcCross' className='dc-mobile-dialog__close-btn-icon' />
                                </div>
                            )}
                        </div>
                        {info_banner}
                        {learn_more_banner}
                    </ThemedScrollbars>
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
                        <div ref={footer_ref} className={classNames('dc-mobile-dialog__footer', footer_classname)}>
                            {footer}
                        </div>
                    )}
                </Div100vhContainer>
            </div>
        </CSSTransition>,
        portal_element
    );
};

export default MobileDialog;

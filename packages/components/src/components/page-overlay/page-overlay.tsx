import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Icon from '../icon/icon.jsx';
import { useOnClickOutside } from '../../hooks';

type PageOverlayProps = {
    children: React.ReactNode;
    header: unknown | string;
    id: unknown | string | number;
    is_close_disabled: boolean;
    is_open: boolean;
    onClickClose: () => void;
    portal_id: string;
};

const PageOverlay = ({
    children,
    header,
    id,
    is_close_disabled = false,
    is_open,
    onClickClose,
    portal_id,
}: PageOverlayProps) => {
    const page_overlay_ref = React.useRef();

    useOnClickOutside(page_overlay_ref, onClickClose, () => is_open && portal_id);

    const el_page_overlay = (
        <div
            ref={page_overlay_ref}
            id={id}
            className={classNames('dc-page-overlay', {
                'dc-page-overlay-portal': !!portal_id,
            })}
        >
            {header && (
                <div className='dc-page-overlay__header'>
                    <div className='dc-page-overlay__header-wrapper'>
                        <div className='dc-page-overlay__header-title'>{header}</div>
                        {!is_close_disabled && (
                            <div
                                className='dc-page-overlay__header-close'
                                onClick={onClickClose || window.history.back}
                            >
                                <Icon icon='IcCross' />
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className='dc-page-overlay__content'>{children}</div>
        </div>
    );

    if (portal_id) {
        return ReactDOM.createPortal(
            <CSSTransition
                appear
                in={is_open}
                timeout={250}
                classNames={{
                    appear: 'dc-page-overlay--enter',
                    enter: 'dc-page-overlay--enter',
                    enterDone: 'dc-page-overlay--enter-done',
                    exit: 'dc-page-overlay--exit',
                }}
                unmountOnExit
            >
                {el_page_overlay}
            </CSSTransition>,
            document.getElementById(portal_id)
        );
    }

    return <>{el_page_overlay}</>;
};

export default PageOverlay;

import classNames from 'classnames';
import React, { MouseEventHandler } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Icon from '../icon/icon';
import Button from '../button';
import { localize } from '@deriv/translations';

type TPageOverlay = {
    header?: React.ReactNode;
    id?: string;
    is_from_app?: boolean;
    is_open?: boolean;
    onClickClose?: (event: MouseEvent) => void;
    portal_id?: string;
    header_classname?: string;
    has_return_icon?: boolean;
    onReturn?: () => void;
    is_from_tradershub_os?: boolean;
};

const PageOverlay = ({
    children,
    header,
    id,
    is_from_app = false,
    is_open,
    onClickClose,
    portal_id,
    header_classname,
    has_return_icon,
    onReturn,
    is_from_tradershub_os = false,
}: React.PropsWithChildren<TPageOverlay>) => {
    const page_overlay_ref = React.useRef<HTMLDivElement>(null);

    const RedirectionComponent = () => {
        if (is_from_tradershub_os) {
            return (
                <Button
                    className='dc-page-overlay__header-redirect'
                    has_effect
                    onClick={onClickClose}
                    text={localize(`Back to Trader's Hub`)}
                    primary
                />
            );
        }
        return (
            <div
                data-testid='dt_page_overlay_header_close'
                className='dc-page-overlay__header-close'
                onClick={(onClickClose as unknown as MouseEventHandler<HTMLDivElement>) || window.history.back}
            >
                <Icon icon='IcCross' />
            </div>
        );
    };

    const el_page_overlay = (
        <div
            ref={page_overlay_ref}
            id={id}
            className={classNames('dc-page-overlay', {
                'dc-page-overlay-portal': !!portal_id,
            })}
        >
            {header && (
                <div
                    className={classNames('dc-page-overlay__header', {
                        'dc-page-app__header': is_from_app,
                        'dc-page-overlay__header-tradershub': is_from_tradershub_os,
                    })}
                >
                    <div className='dc-page-overlay__header-wrapper'>
                        <div className={classNames('dc-page-overlay__header-title', header_classname)}>
                            {has_return_icon && (
                                <Icon icon='IcArrowLeftBold' onClick={onReturn} className='dc-modal-header__icon' />
                            )}
                            {header}
                        </div>
                        {!is_from_app && <RedirectionComponent />}
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
            document.getElementById(portal_id) as HTMLElement
        );
    }

    return <React.Fragment>{el_page_overlay}</React.Fragment>;
};

export default PageOverlay;

import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import Icon from '../icon/icon.jsx';
import { useOnClickOutside } from '../../hooks';
import { connect } from 'Stores/connect';
import { withRouter } from 'react-router-dom';

const PageOverlay = ({ children, header, id, is_from_app = false, is_open, onClickClose, portal_id, bold_text_menu_items, clean_bold_text_menu_items }) => {
    const onClick = () => {
        clean_bold_text_menu_items();
}
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
                <div className={classNames('dc-page-overlay__header', { 'dc-page-app__header ': is_from_app })}>
                    <div className='dc-page-overlay__header-wrapper'>
                        <div className='dc-page-overlay__header-title'>{header}</div>
                        {!is_from_app && (
                            <div
                                data-testid='page_overlay_header_close'
                                className='dc-page-overlay__header-close'
                                onClick={()=> {
                                    onClick(); 
                                    onClickClose ? onClickClose() : window.history.back()
                                }}
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

PageOverlay.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_close_disabled: PropTypes.bool,
    is_open: PropTypes.bool,
    onClickClose: PropTypes.func,
    portal_id: PropTypes.string,
};

export default connect(({ menu }) => ({
    bold_text_menu_items: menu.bold_text_menu_items,
    clean_bold_text_menu_items: menu.clean_bold_text_menu_items,
}))(withRouter(PageOverlay));
;

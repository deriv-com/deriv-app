import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import Icon from 'Components/icon/icon.jsx';

class PageOverlay extends React.Component {
    ref = React.createRef();

    componentDidMount = () => {
        if (this.props.portal_id) {
            document.addEventListener('mousedown', this.handleClickOutside);
        }
    };

    componentWillUnmount = () => {
        if (this.props.portal_id) {
            document.removeEventListener('mousedown', this.handleClickOutside);
        }
    };

    handleClickOutside = event => {
        const path = event.path || (event.composedPath && event.composedPath());
        if (
            this.props.portal_id &&
            this.props.is_open &&
            this.ref.current &&
            !path.some(el => el === this.ref.current)
        ) {
            this.props.onClickClose();
        }
    };

    render() {
        const { children, header, id, onClickClose, portal_id, is_open } = this.props;

        const el_page_overlay = (
            <div
                ref={this.ref}
                id={id}
                className={classNames('dc-page-overlay', {
                    'dc-page-overlay-portal': !!portal_id,
                })}
            >
                {header && (
                    <div className='dc-page-overlay__header'>
                        <div className='dc-page-overlay__header-wrapper'>
                            <div className='dc-page-overlay__header-title'>{header}</div>
                            <div
                                className='dc-page-overlay__header-close'
                                onClick={onClickClose || window.history.back}
                            >
                                <Icon icon='IcCross' />
                            </div>
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
    }
}

PageOverlay.defaultProps = {
    has_side_note: false,
};

PageOverlay.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClickClose: PropTypes.func,
    portal_id: PropTypes.string,
    is_open: PropTypes.bool,
};

export default PageOverlay;

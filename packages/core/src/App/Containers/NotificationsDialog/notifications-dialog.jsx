import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Button, DesktopWrapper, Icon, MobileDialog, MobileWrapper, ThemedScrollbars } from '@deriv/components';
import { BinaryLink } from 'App/Components/Routes';
import { connect } from 'Stores/connect';
import { localize } from '@deriv/translations';
import { toTitleCase, isEmptyObject } from '@deriv/shared';

import { EmptyNotification } from 'App/Components/Elements/Notifications/empty-notification.jsx';

class NotificationsDialog extends React.Component {
    setWrapperRef = node => {
        this.wrapper_ref = node;
    };

    handleClickOutside = event => {
        const notifications_toggle_btn = !event.target.classList.contains('notifications-toggle__icon-wrapper');
        if (
            this.wrapper_ref &&
            !this.wrapper_ref.contains(event.target) &&
            this.props.is_visible &&
            notifications_toggle_btn
        ) {
            this.props.toggleDialog();
        }
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside, {
            passive: true,
        });
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render() {
        const notifications_list_el = (
            <React.Fragment>
                {this.props.notifications && this.props.notifications.length ? (
                    this.props.notifications.map((item, idx) => (
                        <div className='notifications-item' key={idx}>
                            <h2 className='notifications-item__title'>
                                {item.type && (
                                    <Icon
                                        icon={
                                            item.type === 'info' || item.type === 'contract_sold'
                                                ? 'IcAlertInfo'
                                                : `IcAlert${toTitleCase(item.type)}`
                                        }
                                        className={classNames('notifications-item__title-icon', {
                                            [`notifications-item__title-icon--${item.type}`]: item.type,
                                        })}
                                    />
                                )}
                                {item.header}
                            </h2>
                            <div className='notifications-item__message'>{item.message}</div>
                            <div className='notifications-item__action'>
                                {!isEmptyObject(item.action) && (
                                    <>
                                        {item.action.route ? (
                                            <BinaryLink
                                                onClick={this.props.toggleDialog}
                                                className={classNames(
                                                    'dc-btn',
                                                    'dc-btn--secondary',
                                                    'notifications-item__cta-button'
                                                )}
                                                to={item.action.route}
                                            >
                                                <span className='dc-btn__text'>{item.action.text}</span>
                                            </BinaryLink>
                                        ) : (
                                            <Button
                                                className={classNames(
                                                    'dc-btn--secondary',
                                                    'notifications-item__cta-button'
                                                )}
                                                onClick={item.action.onClick}
                                                text={item.action.text}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyNotification />
                )}
            </React.Fragment>
        );

        const is_empty = !(this.props.notifications && this.props.notifications.length);
        const notifications_dialog_el = (
            <div className='notifications-dialog' ref={this.setWrapperRef}>
                <div className='notifications-dialog__header'>
                    <h2 className='notifications-dialog__header-text'>{localize('Notifications')}</h2>
                </div>
                <div
                    className={classNames('notifications-dialog__content', {
                        'notifications-dialog__content--empty': is_empty,
                    })}
                >
                    <DesktopWrapper>
                        {is_empty ? (
                            notifications_list_el
                        ) : (
                            <ThemedScrollbars>{notifications_list_el}</ThemedScrollbars>
                        )}
                    </DesktopWrapper>
                    <MobileWrapper>{notifications_list_el}</MobileWrapper>
                </div>
            </div>
        );

        return (
            <React.Fragment>
                <MobileWrapper>
                    <MobileDialog
                        portal_element_id='modal_root'
                        title={localize('Notifications')}
                        wrapper_classname='notifications-mobile-dialog'
                        visible={this.props.is_visible}
                        onClose={this.props.toggleDialog}
                    >
                        {notifications_dialog_el}
                    </MobileDialog>
                </MobileWrapper>
                <DesktopWrapper>
                    <CSSTransition
                        in={this.props.is_visible}
                        classNames={{
                            enter: 'notifications-dialog--enter',
                            enterDone: 'notifications-dialog--enter-done',
                            exit: 'notifications-dialog--exit',
                        }}
                        timeout={150}
                        unmountOnExit
                    >
                        {notifications_dialog_el}
                    </CSSTransition>
                </DesktopWrapper>
            </React.Fragment>
        );
    }
}

NotificationsDialog.propTypes = {
    is_visible: PropTypes.bool,
    notifications: PropTypes.array,
    toggleDialog: PropTypes.func,
};

export default connect(({ ui }) => ({
    notifications: ui.notifications,
}))(NotificationsDialog);

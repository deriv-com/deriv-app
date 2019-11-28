import PropTypes             from 'prop-types';
import classNames            from 'classnames';
import React                 from 'react';
import { CSSTransition }     from 'react-transition-group';
import {
    Button,
    ThemedScrollbars }       from 'deriv-components';
import { BinaryLink }        from 'App/Components/Routes';
import { connect }           from 'Stores/connect';
import { localize }          from 'deriv-translations';
import { toTitleCase }       from '_common/string_util';
import ObjectUtils           from 'deriv-shared/utils/object';
import Icon                  from 'Assets/icon.jsx';
import { EmptyNotification } from 'App/Components/Elements/Notifications/empty-notification.jsx';

class NotificationsDialog extends React.Component {
    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        const notifications_toggle_btn = !(event.target.classList.contains('notifications-toggle__icon-wrapper'));
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)
            && this.props.is_visible && notifications_toggle_btn) {
            this.props.toggleDialog();
        }
    };

    componentDidMount() {
        document.addEventListener(
            'mousedown',
            this.handleClickOutside,
            {
                passive: true,
            },
        );
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render() {
        return (
            <CSSTransition
                in={this.props.is_visible}
                classNames={{
                    enter    : 'notifications-dialog--enter',
                    enterDone: 'notifications-dialog--enter-done',
                    exit     : 'notifications-dialog--exit',
                }}
                timeout={150}
                unmountOnExit
            >
                <div className='notifications-dialog' ref={this.setWrapperRef}>
                    <div className='notifications-dialog__header'>
                        <h2 className='notifications-dialog__header-text'>
                            {localize('Notifications')}
                        </h2>
                    </div>
                    <div className={classNames('notifications-dialog__content', {
                        'notifications-dialog__content--empty': !(this.props.notifications && this.props.notifications.length),
                    })}
                    >
                        {
                            this.props.notifications && this.props.notifications.length ?
                                <ThemedScrollbars
                                    style={{ width: '100%', height: '100%' }}
                                    autoHide
                                >
                                    {
                                        this.props.notifications.map((item, idx) => (
                                            <div className='notifications-item' key={idx}>
                                                <h2 className='notifications-item__title'>
                                                    {item.type &&
                                                        <Icon
                                                            icon={(item.type === 'info' || item.type === 'contract_sold') ?
                                                                'IconInfoBlue'
                                                                :
                                                                `Icon${toTitleCase(item.type)}`
                                                            }
                                                            className={classNames('notifications-item__title-icon', {
                                                                [`notifications-item__title-icon--${item.type}`]: item.type,
                                                            })}
                                                        />
                                                    }
                                                    {item.header}
                                                </h2>
                                                <div className='notifications-item__message'>
                                                    {item.message}
                                                </div>
                                                {!ObjectUtils.isEmptyObject(item.action) &&
                                                    <React.Fragment>
                                                        { item.action.route ?
                                                            <BinaryLink
                                                                className={classNames('btn', 'btn--secondary', 'notifications-item__cta-button')}
                                                                to={item.action.route}
                                                            >
                                                                <span className='btn__text'>{item.action.text}</span>
                                                            </BinaryLink>
                                                            :
                                                            <Button
                                                                className={classNames('btn--secondary', 'notifications-item__cta-button')}
                                                                onClick={item.action.onClick}
                                                                text={item.action.text}
                                                            />
                                                        }
                                                    </React.Fragment>
                                                }
                                            </div>
                                        ))
                                    }
                                </ThemedScrollbars>
                                :
                                <EmptyNotification />
                        }
                    </div>
                </div>
            </CSSTransition>
        );
    }
}

NotificationsDialog.propTypes = {
    is_visible   : PropTypes.bool,
    notifications: PropTypes.array,
    toggleDialog : PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        notifications: ui.notifications,
    })
)(NotificationsDialog);

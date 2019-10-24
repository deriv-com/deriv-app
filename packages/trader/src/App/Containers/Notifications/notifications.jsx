// import PropTypes             from 'prop-types';
import classNames            from 'classnames';
import React                 from 'react';
import { CSSTransition }     from 'react-transition-group';
import { connect }           from 'Stores/connect';
import { localize }          from 'App/i18n';
import { toTitleCase }       from '_common/string_util';
import Icon                  from 'Assets/icon.jsx';
import { EmptyNotification } from 'App/Components/Elements/Notifications/empty-notification.jsx';

class Notifications extends React.Component {
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
                    enter    : 'notifications__dialog--enter',
                    enterDone: 'notifications__dialog--enter-done',
                    exit     : 'notifications__dialog--exit',
                }}
                timeout={150}
                unmountOnExit
            >
                <div className='notifications__dialog' ref={this.setWrapperRef}>
                    <div className='notifications__dialog-header'>
                        <h2 className='notifications__dialog-header-text'>
                            {localize('Notifications')}
                        </h2>
                    </div>
                    <div className='notifications__dialog-content'>
                        {
                            this.props.notifications && this.props.notifications.length ?
                                this.props.notifications.map((item, idx) => (
                                    <div className='notifications__item' key={idx}>
                                        <h2 className='notifications__item-title'>
                                            {item.type &&
                                                <Icon
                                                    icon={(item.type === 'info') ?
                                                        'IconInfoBlue'
                                                        :
                                                        `Icon${toTitleCase(item.type)}`
                                                    }
                                                    className={classNames('notifications__item-title-icon', {
                                                        [`notifications__item-title-icon--${item.type}`]: item.type,
                                                    })}
                                                />
                                            }
                                            {item.header}
                                        </h2>
                                        <div className='notifications__item-message'>
                                            {item.message}
                                        </div>
                                    </div>
                                ))
                                :
                                <EmptyNotification />
                        }
                    </div>
                </div>
            </CSSTransition>
        );
    }
}

export default connect(
    ({ ui }) => ({
        notifications: ui.notifications,
    })
)(Notifications);

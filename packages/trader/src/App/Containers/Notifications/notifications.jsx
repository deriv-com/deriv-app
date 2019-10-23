// import PropTypes             from 'prop-types';
import React                 from 'react';
import { CSSTransition }     from 'react-transition-group';
import { connect }           from 'Stores/connect';
import { EmptyNotification } from 'App/Components/Elements/Notifications/empty-notification.jsx';

class Notifications extends React.Component {
    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)
            && this.props.is_visible) {
            // this.props.toggleDialog();
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
                timeout={250}
                unmountOnExit
            >
                <div className='notifications__dialog' ref={this.setWrapperRef}>
                    {
                        this.props.notifications_messages && this.props.notifications_messages.length ?
                            this.props.notifications_messages.map((item, idx) => (
                                <React.Fragment key={idx}>
                                    <span>item[idx] </span>
                                </React.Fragment>
                            ))
                            :
                            <EmptyNotification />
                    }
                </div>
            </CSSTransition>
        );
    }
}

export default connect(
    ({ client, ui }) => ({
        is_logged_in          : client.is_logged_in,
        is_visible            : ui.is_notifications_visible,
        notifications_messages: ui.notifications_messages,

    })
)(Notifications);

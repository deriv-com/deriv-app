// import PropTypes             from 'prop-types';
import React                 from 'react';
import { connect }           from 'Stores/connect';
import { EmptyNotification } from 'App/Components/Elements/Notifications/empty-notification.jsx';
import { DrawerItem }        from 'App/Components/Elements/Drawer';

class Notifications extends React.Component {
    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)
            && this.props.is_visible) {
            this.props.toggleNotifications(false);
        }
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render() {
        if (!this.props.is_logged_in) return false;
        return (
            <div className='notifications__list' ref={this.setWrapperRef}>
                {
                    this.props.notifications_list && this.props.notifications_list.length ?
                        this.props.notifications_list.map((item, idx) => (
                            <React.Fragment key={idx}>
                                <DrawerItem text={item[idx]} />
                            </React.Fragment>
                        ))
                        :
                        <EmptyNotification />
                }
            </div>
        );
    }
}

export default connect(
    ({ client }) => ({
        is_logged_in      : client.is_logged_in,
        notifications_list: client.notifications,
    })
)(Notifications);

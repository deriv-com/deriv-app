import PropTypes             from 'prop-types';
import React                 from 'react';
import { EmptyNotification } from './empty-notification.jsx';
import { DrawerItem }        from '../Drawer';

const Notifications = ({ list }) => (
    <React.Fragment>
        {
            list && list.length ?
                list.map((item, idx) => (
                    <React.Fragment key={idx}>
                        <DrawerItem text={item[idx]} />
                    </React.Fragment>
                ))
                :
                <EmptyNotification />
        }

    </React.Fragment>
);

Notifications.propTypes = {
    list: PropTypes.array,
};

export { Notifications };

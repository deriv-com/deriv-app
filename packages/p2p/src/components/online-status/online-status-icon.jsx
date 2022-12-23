import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

const OnlineStatusIcon = ({ is_online, size = '1em' }) => {
    return (
        <div
            className={classNames('online-status__icon', {
                'online-status__icon--offline': !is_online,
                'online-status__icon--online': !!is_online,
            })}
            style={{
                width: size,
                height: size,
            }}
        />
    );
};

OnlineStatusIcon.propTypes = {
    is_online: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default observer(OnlineStatusIcon);

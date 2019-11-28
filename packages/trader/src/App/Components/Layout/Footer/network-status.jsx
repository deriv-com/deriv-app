import classNames   from 'classnames';
import { Popover }  from 'deriv-components';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from 'deriv-translations';
import { connect }  from 'Stores/connect';

const NetworkStatus = ({ status }) => (
    <div className='network-status__wrapper'>
        <Popover
            classNameBubble='network-status__tooltip'
            alignment='top'
            message={localize('Network status: {{status}}', { status: (status.tooltip || localize('Connecting to server')) })}
        >
            <div className={classNames(
                'network-status__circle', {
                    'network-status__circle--offline': (status.class === 'offline'),
                    'network-status__circle--online' : (status.class === 'online'),
                    'network-status__circle--blinker': (status.class === 'blinker'),
                })}
            />
        </Popover>
    </div>
);

NetworkStatus.propTypes = {
    status: PropTypes.object,
};

export { NetworkStatus };

export default connect(
    ({ common }) => ({
        status: common.network_status,
    })
)(NetworkStatus);

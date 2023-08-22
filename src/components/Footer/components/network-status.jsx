import classNames from 'classnames';
import React from 'react';
import { api_base } from '@api-base';
import { translate } from '@i18n';
import Popover from '@components/common/popover';
import { observer as globalObserver } from '@utilities/observer';

const NetworkStatus = () => {
    const [status, setStatus] = React.useState(translate('offline'));

    React.useEffect(() => {
        api_base.api.send({ website_status: '1', subscribe: 1 }).catch(e => {
            globalObserver.emit('Error', e);
        });
        api_base.api.onMessage().subscribe(({ data }) => {
            if (data?.error?.code) {
                return;
            }
            if (data?.msg_type === 'website_status') {
                $('.web-status').trigger('notify-hide');
                const { website_status } = data;
                if (website_status?.message) {
                    $.notify(website_status.message, {
                        position: 'bottom left',
                        autoHide: false,
                        className: 'warn web-status',
                    });
                }
            }
        });

        if ('onLine' in navigator) {
            window.addEventListener('online', updateStatus);
            window.addEventListener('offline', updateStatus);
        } else {
            navigator.onLine = true;
        }

        const updateInterval = setInterval(() => updateStatus(), 10000);
        updateStatus();

        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);

            clearInterval(updateInterval);
        };
    }, []);

    const updateStatus = () => {
        if (navigator.onLine) {
            if (api_base.api.connection.readyState !== 1) {
                setStatus(translate('connecting'));
            } else {
                api_base.api
                    .send({ ping: '1' })
                    .then(() => setStatus(translate('online')))
                    .catch(e => {
                        globalObserver.emit('Error', e);
                    });
            }
        } else {
            setStatus('offline');
        }
    };

    return (
        <div id='network-status' className='network-status__wrapper'>
            <Popover content={`${translate('Network status')}: ${status}`}>
                <div
                    className={classNames('network-status__circle', {
                        'network-status__circle--offline': status === 'offline',
                        'network-status__circle--online': status === 'online',
                        'network-status__circle--blinker': status === 'connecting',
                    })}
                />
            </Popover>
        </div>
    );
};

export default NetworkStatus;

import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores/index';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';

const status_text = {
    pending: {
        text: (
            <Localize
                i18n_default_text='Need verification. <0>Verify now</0>'
                components={[<Link key={0} to='/account/proof-of-address' />]}
            />
        ),
        icon: 'IcAlertInfo',
    },
    failed: {
        text: <Localize i18n_default_text='Pending verification' />,
        icon: 'IcRedWarning',
    },
    default: {
        text: (
            <Localize i18n_default_text='Need verification. <0>Verify now</0>' components={[<Link key={0} to='' />]} />
        ),
        icon: 'IcAlertWarning',
    },
};

const StatusBadge = () => {
    const { client } = useStores();
    const { document_status } = client.authentication_status;
    const { text, icon } = status_text[document_status as keyof typeof status_text] ?? status_text.default;

    return (
        <div
            className={classNames(
                'switcher-status-badge__container',
                `switcher-status-badge__container--${document_status || 'failed'}`
            )}
        >
            <Icon icon={icon} />
            {text}
        </div>
    );
};

export default observer(StatusBadge);

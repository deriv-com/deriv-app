import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores/index';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import './switcher-status-badge.scss';

const status_text = {
    pending: {
        text: (
            <Localize
                i18n_default_text='<0>Pending verification</0>'
                components={[<Text key={0} weight='bold' size='xxxs' color='var(--text-warning)' />]}
            />
        ),
        icon: 'IcAlertWarning',
    },
    failed: {
        text: (
            <Localize
                i18n_default_text='<0>Verification failed.</0> <1>Why?</1>'
                components={[
                    <Text key={0} weight='bold' size='xxxs' color='var(--status-danger)' />,
                    <Link key={1} className='link-failed' to='' />,
                ]}
            />
        ),
        icon: 'IcRedWarning',
    },
    default: {
        text: (
            <Localize
                i18n_default_text='<0>Need verification.</0> <1>Verify now</1>'
                components={[
                    <Text key={0} weight='bold' size='xxxs' color='var(--text-info-blue)' />,
                    <Link key={1} className='link-default' to='/account/proof-of-identity' />,
                ]}
            />
        ),
        icon: 'IcAlertInfo',
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
            <div
                className={classNames(
                    'switcher-status-badge__container--icon',
                    `switcher-status-badge__container--icon${document_status || 'failed'}`
                )}
            >
                <Icon icon={icon} />
            </div>
            {text}
        </div>
    );
};

export default observer(StatusBadge);

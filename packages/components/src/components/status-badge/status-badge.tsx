import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Icon from '../icon';
import Text from '../text';
import { Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import './status-badge.scss';

type TSelectedMt5 = {
    category: string;
    type?: string;
    jurisdiction: string;
    platform?: string;
};

type TStatusBadge = {
    account_status: any;
    class_name?: string;
    openFailedVerificationModal: (from_account: string | TSelectedMt5) => void;
    selected_account_type: string | TSelectedMt5;
};

const StatusBadge = ({
    account_status,
    class_name,
    openFailedVerificationModal,
    selected_account_type,
}: TStatusBadge) => {
    const status_text = {
        pending: {
            text: (
                <Localize
                    i18n_default_text='<0>Pending verification</0>'
                    components={[<Text key={0} weight='bold' size='xxxs' color='var(--status-warning)' />]}
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
                        <Text
                            key={1}
                            className='link-verification-failed'
                            onClick={() => {
                                openFailedVerificationModal(selected_account_type);
                            }}
                        />,
                    ]}
                />
            ),
            icon: 'IcRedWarning',
        },
        need_verification: {
            text: (
                <Localize
                    i18n_default_text='<0>Need verification.</0><1>Verify now</1>'
                    components={[
                        <Text key={0} weight='bold' size='xxxs' color='var(--status-info)' />,
                        <Link key={1} className='link-need-verification' to='/account/proof-of-identity' />,
                    ]}
                />
            ),
            icon: 'IcAlertInfo',
        },
    };
    const { text, icon } = status_text[account_status as keyof typeof status_text] ?? status_text.need_verification;

    return (
        <div
            className={classNames(
                'switcher-status-badge__container',
                class_name,
                `switcher-status-badge__container--${account_status || 'failed'}`
            )}
        >
            <div
                className={classNames(
                    'switcher-status-badge__container--icon',
                    `switcher-status-badge__container--icon${account_status || 'failed'}`
                )}
            >
                <Icon icon={icon} size='11' />
            </div>
            {text}
        </div>
    );
};

export default observer(StatusBadge);

import React from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { LabelPairedChevronRightMdRegularIcon } from '@deriv/quill-icons';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import { Text, StatusBadge } from '@deriv/components';
import {
    ACCOUNTS_OS_POI_STATUS_URL,
    ACCOUNTS_OS_POI_URL,
    ACCOUNTS_OS_POA_URL,
    AUTH_STATUS_CODES,
    getSocketURL,
} from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { WebSocketUtils } from '@deriv-com/utils';
import './verification-docs-list-modal.scss';

type TListItemProps = {
    id: string;
    text: string;
    status?: string | number;
    route: string;
};

type TAuthStatusCodes = (typeof AUTH_STATUS_CODES)[keyof typeof AUTH_STATUS_CODES];

const getBadgeStatus = (status: TAuthStatusCodes) => {
    switch (status) {
        case AUTH_STATUS_CODES.VERIFIED:
            return {
                text: <Localize i18n_default_text='Verified' />,
                icon: 'IcMt5Success',
                icon_size: '18',
            };
        case AUTH_STATUS_CODES.PENDING:
            return {
                text: <Localize i18n_default_text='In review' />,
                icon: 'IcMt5Pending',
                icon_size: '12',
            };
        case AUTH_STATUS_CODES.REJECTED:
        case AUTH_STATUS_CODES.SUSPECTED:
            return {
                text: <Localize i18n_default_text='Failed' />,
                icon: 'IcMt5Failed',
                icon_size: '18',
            };
        default:
            return {
                text: '',
                icon: '',
            };
    }
};

const ListItem = observer(({ id, text, status, route }: TListItemProps) => {
    const { text: badge_text, icon: badge_icon, icon_size: badge_size } = getBadgeStatus(status);
    const { client, common, traders_hub, ui } = useStore();
    const { isMobile } = useDevice();
    const { getToken } = client;
    const { is_from_tradershub_os } = common;
    const { setVerificationModalOpen } = traders_hub;
    const history = useHistory();
    const is_document_verified = status === AUTH_STATUS_CODES.VERIFIED;
    const [shouldRedirectToAccountsOSApp, isRedirectToAccountsOSAppFFLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'redirect_to_poi_in_accounts_os',
    });

    const getFormattedURL = (url_link: string) => {
        const url = new URL(url_link);
        const urlParams = new URLSearchParams(location.search);
        const platformConfig = urlParams.get('platform') ?? window.sessionStorage.getItem('config.platform');
        const platform = platformConfig ?? (is_from_tradershub_os ? 'tradershub_os' : 'deriv_app');

        const params = {
            platform,
            appid: WebSocketUtils.getAppId(),
            lang: 'en',
            server: getSocketURL(),
            token: getToken(),
        };

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        return url.toString();
    };

    const onClickItem = () => {
        if (is_document_verified) {
            return;
        }
        setVerificationModalOpen(false);
        if (id === 'identity' && status) {
            if (isRedirectToAccountsOSAppFFLoaded && shouldRedirectToAccountsOSApp) {
                const redirect_url =
                    status === 'none' || status === 'required' ? ACCOUNTS_OS_POI_URL : ACCOUNTS_OS_POI_STATUS_URL;
                window.location.replace(getFormattedURL(redirect_url));
                return;
            }
        }
        if (id === 'address' && status) {
            localStorage.setItem('mt5_poa_status', String(status));
            if (isRedirectToAccountsOSAppFFLoaded && shouldRedirectToAccountsOSApp) {
                window.location.replace(getFormattedURL(ACCOUNTS_OS_POA_URL));
                return;
            }
        }
        if (id === 'tax') {
            ui.setFieldRefToFocus('employment-tax-section');
        }
        history.push(route);
    };

    return (
        <div
            className={classNames('verification-docs-list-modal__content-list-item', {
                'verification-docs-list-modal__content-list-item--disabled': is_document_verified,
            })}
            onClick={onClickItem}
        >
            <Text size={isMobile ? 'xxs' : 'xs'} line_height='xl' weight='bold'>
                <Localize i18n_default_text={text} />
            </Text>
            {status === AUTH_STATUS_CODES.NONE || (id === 'tax' && status === 0) ? (
                <LabelPairedChevronRightMdRegularIcon fill='var(--text-prominent)' />
            ) : (
                <div className='verification-docs-list-modal__card'>
                    <StatusBadge
                        account_status={status}
                        icon={badge_icon}
                        text={badge_text}
                        icon_size={badge_size}
                        className='verification-docs-list-modal__status-badge'
                    />
                    <LabelPairedChevronRightMdRegularIcon
                        className='verification-docs-list-modal__card--icon'
                        fill={is_document_verified ? 'var(--text-disabled-1)' : 'var(--text-prominent)'}
                    />
                </div>
            )}
        </div>
    );
});

export default ListItem;

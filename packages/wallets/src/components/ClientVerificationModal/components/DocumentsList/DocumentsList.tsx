import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useGrowthbookGetFeatureValue } from '@deriv/api-v2';
import {
    ACCOUNTS_OS_POI_STATUS_URL,
    ACCOUNTS_OS_POI_URL,
    ACCOUNTS_OS_POA_URL,
    getAppId,
    getSocketURL,
    isNavigationFromTradersHubOS,
} from '@deriv/shared';
import { useTranslations } from '@deriv-com/translations';
import { getToken } from '@deriv/utils';
import { TModifiedMT5Account, TWalletsMFAccountStatus } from '../../../../types';
import { getClientVerification } from '../../../../utils';
import { ClientVerificationStatusBadge } from '../../../ClientVerificationBadge';
import { DocumentTile } from './components';
import './DocumentsList.scss';

type TDocumentsListProps = {
    account: TModifiedMT5Account | TWalletsMFAccountStatus;
};

type TStatusBadgeProps = Record<TModifiedMT5Account['client_kyc_status']['poa_status' | 'poi_status'], JSX.Element>;

const statusBadge: TStatusBadgeProps = {
    expired: <ClientVerificationStatusBadge variant='failed' />,
    none: <></>,
    pending: <ClientVerificationStatusBadge variant='in_review' />,
    rejected: <ClientVerificationStatusBadge variant='failed' />,
    suspected: <ClientVerificationStatusBadge variant='failed' />,
    verified: <ClientVerificationStatusBadge variant='verified' />,
};

const DocumentsList: React.FC<TDocumentsListProps> = ({ account }) => {
    const history = useHistory();
    const { localize } = useTranslations();
    const { data: activeWallet } = useActiveWalletAccount();
    const { hasPoaStatus, hasPoiStatus, isPoaRequired, isPoiRequired, isTinRequired, statuses } =
        getClientVerification(account);
    const [shouldRedirectToAccountsOSApp, isRedirectToAccountsOSAppFFLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'redirect_to_poi_in_accounts_os',
    });

    const getFormattedURL = (urlLink: string) => {
        const url = new URL(urlLink);
        const urlParams = new URLSearchParams(location.search);
        const platformConfig = urlParams.get('platform') ?? window.sessionStorage.getItem('config.platform');
        const platform = platformConfig ?? (isNavigationFromTradersHubOS() ? 'tradershub_os' : 'deriv_app');

        const params = {
            appid: getAppId(),
            lang: 'en',
            platform,
            server: getSocketURL(),
            token: getToken(activeWallet?.loginid || ''),
        };

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });

        return url.toString();
    };

    return (
        <div className='wallets-documents-list'>
            {hasPoiStatus && (
                <DocumentTile
                    badge={statusBadge[statuses.poi_status]}
                    disabled={!isPoiRequired}
                    onClick={() => {
                        if (isRedirectToAccountsOSAppFFLoaded && shouldRedirectToAccountsOSApp) {
                            const { poi_status: poiStatus } = account.client_kyc_status;
                            const redirectUrl = poiStatus === 'none' ? ACCOUNTS_OS_POI_URL : ACCOUNTS_OS_POI_STATUS_URL;
                            window.location.replace(getFormattedURL(redirectUrl));
                        } else {
                            // @ts-expect-error the following link is not part of wallets routes config
                            history.push('/account/proof-of-identity');
                        }
                    }}
                    title={localize('Proof of identity')}
                />
            )}
            {hasPoaStatus && (
                <DocumentTile
                    badge={statusBadge[statuses.poa_status]}
                    disabled={!isPoaRequired}
                    onClick={() => {
                        if ('platform' in account && account?.platform === 'mt5') {
                            localStorage.setItem('mt5_poa_status', statuses.poa_status);
                        }
                        if (isRedirectToAccountsOSAppFFLoaded && shouldRedirectToAccountsOSApp) {
                            window.location.replace(getFormattedURL(ACCOUNTS_OS_POA_URL));
                        } else {
                            // @ts-expect-error the following link is not part of wallets routes config
                            history.push('/account/proof-of-address');
                        }
                    }}
                    title={localize('Proof of address')}
                />
            )}
            {isTinRequired && (
                <DocumentTile
                    // @ts-expect-error the following link is not part of wallets routes config
                    onClick={() => history.push('/account/personal-details')}
                    title={localize('Additional information')}
                />
            )}
        </div>
    );
};

export default DocumentsList;

import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslations } from '@deriv-com/translations';
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
    const { hasPoaStatus, hasPoiStatus, isPoaRequired, isPoiRequired, isTinRequired, statuses } =
        getClientVerification(account);

    return (
        <div className='wallets-documents-list'>
            {hasPoiStatus && (
                <DocumentTile
                    badge={statusBadge[statuses.poi_status]}
                    disabled={!isPoiRequired}
                    // @ts-expect-error the following link is not part of wallets routes config
                    onClick={() => history.push('/account/proof-of-identity')}
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
                        // @ts-expect-error the following link is not part of wallets routes config
                        history.push('/account/proof-of-address');
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

import React from 'react';
import { useHistory } from 'react-router-dom';
import { TModifiedMT5Account } from 'src/features/cfd/types';
import { useTranslations } from '@deriv-com/translations';
import { ClientVerificationStatusBadge } from '../../../../components';
import { getClientVerification } from '../../../../utils';
import { DocumentTile } from './components';
import './DocumentsList.scss';

type TDocumentsListProps = {
    account: TModifiedMT5Account;
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
    const {
        hasPoaStatus,
        hasPoiStatus,
        hasRequiredTin,
        hasTinStatus,
        isPoaRequired,
        isPoiRequired,
        isTinRequired,
        statuses,
    } = getClientVerification(account);

    const shouldShowTin = hasRequiredTin && hasTinStatus && isTinRequired;

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
                        localStorage.setItem('mt5_poa_status', statuses.poa_status);
                        // @ts-expect-error the following link is not part of wallets routes config
                        history.push('/account/proof-of-address');
                    }}
                    title={localize('Proof of address')}
                />
            )}
            {shouldShowTin && (
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

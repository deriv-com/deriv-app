import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslations } from '@deriv-com/translations';
import { THooks } from '../../../../../../types';
import { ClientVerificationStatusBadge } from '../../../../components';
import { getClientVerification } from '../../../../utils';
import { DocumentTile } from './components';
import './DocumentsList.scss';

type TDocumentsListProps = {
    account: THooks.SortedMT5Accounts;
};

// TODO: remove this once API types for client_kyc_status is available in deriv-api-types
type TStatuses = 'expired' | 'none' | 'pending' | 'rejected' | 'suspected' | 'verified';

type TStatusBadgeProps = Record<TStatuses, typeof ClientVerificationStatusBadge | undefined>;

const statusBadge: TStatusBadgeProps = {
    expired: <ClientVerificationStatusBadge variant='failed' />,
    pending: <ClientVerificationStatusBadge variant='in_review' />,
    rejected: <ClientVerificationStatusBadge variant='failed' />,
    suspected: <ClientVerificationStatusBadge variant='failed' />,
    verified: <ClientVerificationStatusBadge variant='verified' />,
};

const DocumentsList: React.FC<TDocumentsListProps> = ({ account }) => {
    const history = useHistory();
    const { localize } = useTranslations();
    const { hasPoaStatus, hasPoiStatus, hasTinStatus, isPoaRequired, isPoiRequired, isTinRequired, statuses } =
        getClientVerification(account);

    return (
        <div className='wallets-documents-list'>
            {hasPoiStatus && (
                <DocumentTile
                    badge={statusBadge[statuses.poi_status]}
                    disabled={!isPoiRequired}
                    onClick={() => history.push('/account/proof-of-identity')}
                    title={localize('Proof of identity')}
                />
            )}
            {hasPoaStatus && (
                <DocumentTile
                    badge={statusBadge[statuses.poa_status]}
                    disabled={!isPoaRequired}
                    onClick={() => history.push('/account/proof-of-address')}
                    title={localize('Proof of address')}
                />
            )}
            {hasTinStatus && isTinRequired && (
                <DocumentTile
                    onClick={() => history.push('/account/personal-details')}
                    title={localize('Personal Details')}
                />
            )}
        </div>
    );
};

export default DocumentsList;

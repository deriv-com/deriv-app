import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslations } from '@deriv-com/translations';
import { THooks } from '../../../../../../types';
import { ClientVerificationStatusBadge } from '../../../../components';
import { DocumentTile } from './components';
import './DocumentsList.scss';

type TDocumentsListProps = {
    statuses: THooks.SortedMT5Accounts['client_kyc_status'];
};

type TStatuses = 'expired' | 'none' | 'pending' | 'rejected' | 'suspected' | 'verified';

type TTileProps = Record<TStatuses, Pick<React.ComponentProps<typeof DocumentTile>, 'badge' | 'isDisabled'>>;

const tileProps: TTileProps = {
    expired: {
        badge: <ClientVerificationStatusBadge variant='failed' />,
        isDisabled: false,
    },
    none: {
        badge: undefined,
        isDisabled: false,
    },
    pending: {
        badge: <ClientVerificationStatusBadge variant='in_review' />,
        isDisabled: true,
    },
    rejected: {
        badge: <ClientVerificationStatusBadge variant='failed' />,
        isDisabled: false,
    },
    suspected: {
        badge: <ClientVerificationStatusBadge variant='failed' />,
        isDisabled: false,
    },
    verified: {
        badge: <ClientVerificationStatusBadge variant='verified' />,
        isDisabled: true,
    },
};

const DocumentsList: React.FC<TDocumentsListProps> = ({ statuses }) => {
    const history = useHistory();
    const { localize } = useTranslations();

    return (
        <div className='wallets-documents-list'>
            {'poi_status' in statuses && (
                <DocumentTile
                    {...tileProps[statuses.poi_status]}
                    onClick={() => history.push('/account/proof-of-identity')}
                    title={localize('Proof of identity')}
                />
            )}
            {'poa_status' in statuses && (
                <DocumentTile
                    {...tileProps[statuses.poa_status]}
                    onClick={() => history.push('/account/proof-of-address')}
                    title={localize('Proof of address')}
                />
            )}
            {'valid_tin' in statuses && !statuses.valid_tin && (
                <DocumentTile
                    onClick={() => history.push('/account/personal-details')}
                    title={localize('Personal Details')}
                />
            )}
        </div>
    );
};

export default DocumentsList;

import React from 'react';
import { useHistory } from 'react-router-dom';
import { THooks } from '../../../../../../types';
import { DocumentTile } from './components';
import './DocumentsList.scss';

type TDocumentsListProps = {
    statuses: THooks.SortedMT5Accounts['client_kyc_status'];
};

type TStatuses = 'expired' | 'none' | 'pending' | 'rejected' | 'suspected' | 'verified';

const statusBadge: Record<TStatuses, JSX.Element | null> = {
    expired: <div>Failed</div>,
    none: <div>none</div>,
    pending: <div>In review</div>,
    rejected: <div>Failed</div>,
    suspected: <div>Failed</div>,
    verified: <div>Verified</div>,
};

const DocumentsList: React.FC<TDocumentsListProps> = ({ statuses }) => {
    const history = useHistory();

    return (
        <div className='wallets-documents-list'>
            {'poi_status' in statuses && (
                <DocumentTile
                    badge={statusBadge[statuses.poi_status]}
                    onClick={() => history.push('/account/proof-of-identity')}
                    title='Proof of identity'
                />
            )}
            {'poa_status' in statuses && (
                <DocumentTile
                    badge={statusBadge[statuses.poa_status]}
                    onClick={() => history.push('/account/proof-of-address')}
                    title='Proof of address'
                />
            )}
            {'valid_tin' in statuses && !statuses.valid_tin && (
                <DocumentTile onClick={() => history.push('/account/personal-details')} title='Personal Details' />
            )}
        </div>
    );
};

export default DocumentsList;

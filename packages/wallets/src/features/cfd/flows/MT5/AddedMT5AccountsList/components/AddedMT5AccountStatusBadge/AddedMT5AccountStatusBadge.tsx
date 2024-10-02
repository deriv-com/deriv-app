import React from 'react';
import { useModal } from '../../../../../../../components/ModalProvider';
import { ClientVerificationStatusBadge } from '../../../../../components';
import { ClientVerificationModal } from '../../../../../modals';
import { TModifiedMT5Accounts } from '../../../../../types';
import { getClientVerification } from '../../../../../utils';

type TAddedMT5AccountStatusBadgeProps = {
    account: TModifiedMT5Accounts;
};

const AddedMT5AccountStatusBadge: React.FC<TAddedMT5AccountStatusBadgeProps> = ({ account }) => {
    const { show } = useModal();
    return (
        <ClientVerificationStatusBadge
            onClick={() => {
                show(<ClientVerificationModal account={account} />);
            }}
            variant='needs_verification'
        />
    );
};

export default AddedMT5AccountStatusBadge;

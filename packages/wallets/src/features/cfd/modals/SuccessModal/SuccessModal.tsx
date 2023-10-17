import React from 'react';
import { useSortedMT5Accounts } from '@deriv/api';
import { Success } from '../../screens';
import { ModalWrapper } from 'src/components';

type TSuccessModalProps = {
    marketType: Exclude<NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number]['market_type'], undefined>;
    title: string;
    description: string;
};

const SuccessModal: React.FC<TSuccessModalProps> = ({ marketType, title, description }) => {
    return (
        <ModalWrapper>
            <Success marketType={marketType} title={title} description={description} />
        </ModalWrapper>
    );
};

export default SuccessModal;

import React from 'react';
import { useDxtradeAccountsList } from '@deriv/api-v2';
import useDxtradeAccountHandler from '../../../../hooks/useDxtradeAccountHandler';
import { PlatformDetails } from '../../constants';
import AddAccountButtonsGroup from '../ButtonGroups/AddAccountButtonsGroup';
import SuccessButtonGroup from '../ButtonGroups/SuccessButtonGroup';
import DxtradeCreateAccountButton from './DxtradeCreateAccountButton';

type TDxtradePasswordFooterProps = {
    password: string;
};

const DxtradePasswordFooter = ({ password }: TDxtradePasswordFooterProps) => {
    const { data: dxtradeAccounts } = useDxtradeAccountsList();
    const { createOtherCFDAccountSuccess } = useDxtradeAccountHandler();
    const hasDxtradeAccount = dxtradeAccounts?.find(account => account.login);

    if (createOtherCFDAccountSuccess) return <SuccessButtonGroup />;

    if (hasDxtradeAccount) return <AddAccountButtonsGroup password={password} />;

    return (
        <DxtradeCreateAccountButton
            buttonText={`Create ${PlatformDetails.dxtrade.title} password`}
            password={password}
        />
    );
};
export default DxtradePasswordFooter;

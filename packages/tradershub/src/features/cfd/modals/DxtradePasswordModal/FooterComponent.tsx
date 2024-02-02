import React from 'react';
import { useDxtradeAccountsList } from '@deriv/api';
import useDxtradeAccountHandler from '../../../../hooks/useDxtradeAccountHandler';
import { PlatformDetails } from '../../constants';
import AddAccountButtonsGroup from '../ButtonGroups/AddAccountButtonsGroup';
import CreateAccountButton from '../ButtonGroups/CreateAccountButton';
import SuccessButtonGroup from '../ButtonGroups/SuccessButtonGroup';

type TFooterComponentProps = {
    password: string;
};

const FooterComponent = ({ password }: TFooterComponentProps) => {
    const { data: dxtradeAccounts } = useDxtradeAccountsList();
    const { createOtherCFDAccountSuccess } = useDxtradeAccountHandler();
    const hasDxtradeAccount = dxtradeAccounts?.find(account => account.login);

    if (createOtherCFDAccountSuccess) return <SuccessButtonGroup />;

    if (hasDxtradeAccount) return <AddAccountButtonsGroup password={password} />;

    return <CreateAccountButton buttonText={`Create ${PlatformDetails.dxtrade.title} password`} password={password} />;
};
export default FooterComponent;

import React from 'react';
import { useMT5AccountsList } from '@deriv/api';
import useMT5AccountHandler from '../../../../hooks/useMT5AccountHandler';
import AddAccountButtonsGroup from './ButtonGroups/AddAccountButtonsGroup';
import CreateAccountButton from './ButtonGroups/CreateAccountButton';
import SuccessButtonGroup from './ButtonGroups/SuccessButtonGroup';

type TFooterComponentProps = {
    password: string;
};

const FooterComponent = ({ password }: TFooterComponentProps) => {
    const { data: mt5Accounts } = useMT5AccountsList();
    const { isCreateMT5AccountSuccess } = useMT5AccountHandler();
    const hasMT5Account = mt5Accounts?.find(account => account.login);

    if (isCreateMT5AccountSuccess) return <SuccessButtonGroup />;

    if (hasMT5Account) return <AddAccountButtonsGroup password={password} />;

    return <CreateAccountButton buttonText='Create Deriv MT5 password' password={password} />;
};
export default FooterComponent;

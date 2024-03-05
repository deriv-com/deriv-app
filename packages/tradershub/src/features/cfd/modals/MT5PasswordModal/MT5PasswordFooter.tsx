import React from 'react';
import { useMT5AccountHandler } from '@/hooks';
import { PlatformDetails } from '@cfd/constants';
import { useMT5AccountsList } from '@deriv/api-v2';
import AddAccountButtonsGroup from '../ButtonGroups/AddAccountButtonsGroup';
import SuccessButtonGroup from '../ButtonGroups/SuccessButtonGroup';
import MT5CreateAccountButton from './MT5CreateAccountButton';

type TMT5PasswordFooterProps = {
    password: string;
};

const MT5PasswordFooter = ({ password }: TMT5PasswordFooterProps) => {
    const { data: mt5Accounts } = useMT5AccountsList();
    const { isCreateMT5AccountSuccess } = useMT5AccountHandler();
    const hasMT5Account = mt5Accounts?.find(account => account.login);

    if (isCreateMT5AccountSuccess) return <SuccessButtonGroup />;

    if (hasMT5Account) return <AddAccountButtonsGroup password={password} />;

    return <MT5CreateAccountButton buttonText={`Create ${PlatformDetails.mt5.title} password`} password={password} />;
};
export default MT5PasswordFooter;

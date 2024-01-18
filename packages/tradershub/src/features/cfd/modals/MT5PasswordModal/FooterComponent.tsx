import React from 'react';
import { useCreateMT5Account, useMT5AccountsList } from '@deriv/api';
import AddAccountButtonsGroup from './ButtonGroups/AddAccountButtonsGroup';
import CreateAccountButton from './ButtonGroups/CreateAccountButton';
import SuccessButtonGroup from './ButtonGroups/SuccessButtonGroup';

type TProps = {
    password: string;
};

const FooterComponent = ({ password }: TProps) => {
    const { data: mt5Accounts } = useMT5AccountsList();
    const { isSuccess } = useCreateMT5Account();

    const hasMT5Account = mt5Accounts?.find(account => account.login);

    if (isSuccess) return <SuccessButtonGroup />;

    if (hasMT5Account) return <AddAccountButtonsGroup password={password} />;

    return <CreateAccountButton password={password} />;
};
export default FooterComponent;

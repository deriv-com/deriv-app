import React from 'react';
import { useMT5AccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import AddAccountButtonsGroup from './ButtonGroups/AddAccountButtonsGroup';
import CreateAccountButton from './ButtonGroups/CreateAccountButton';
import SuccessButtonGroup from './ButtonGroups/SuccessButtonGroup';

type TProps = {
    password: string;
};

const FooterComponent = ({ password }: TProps) => {
    const { getCFDState } = Provider.useCFDContext();
    const { data: mt5Accounts } = useMT5AccountsList();
    const isSuccess = getCFDState('isSuccess');

    const hasMT5Account = mt5Accounts?.find(account => account.login);

    if (isSuccess) return <SuccessButtonGroup />;

    if (hasMT5Account) return <AddAccountButtonsGroup password={password} />;

    return <CreateAccountButton password={password} />;
};
export default FooterComponent;

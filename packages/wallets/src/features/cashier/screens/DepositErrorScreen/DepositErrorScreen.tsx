import React from 'react';
import { useHistory } from 'react-router-dom';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletsErrorScreen } from '../../../../components';

type TProps = {
    error: TSocketError<'cashier'>['error'];
    title?: string;
};

const DepositErrorScreen: React.FC<TProps> = ({ error, title }) => {
    const history = useHistory();

    return (
        <WalletsErrorScreen
            buttonText='OK'
            buttonVariant='contained'
            message={error.message}
            onClick={() => (error.code === 'CashierForwardError' ? window.location.reload() : history.push('/wallets'))}
            title={title}
        />
    );
};

export default DepositErrorScreen;

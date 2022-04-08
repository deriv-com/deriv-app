import React from 'react';
import { MainComponentProps } from '@deriv/ui';
import { localize } from '@deriv/translations';
import CreateWallet from 'Components/create-wallet';
import { WizardContext } from '../context';

const WalletStep = ({ onSubmit }: MainComponentProps) => {
    const [should_show_fiat, setShouldShowFiat] = React.useState(false);
    const context = React.useContext(WizardContext);
    const { selected_wallet } = context;

    const handleSubmit = (wallet: string) => {
        context.selected_wallet = wallet;
        onSubmit({ wallet }, [{ step_title: localize('Currency'), should_be_disabled: true }]);
    };

    return (
        <CreateWallet
            dark={false}
            should_show_fiat={should_show_fiat}
            setShouldShowFiat={setShouldShowFiat}
            setSeletedWallet={handleSubmit}
            selected_wallet={selected_wallet}
        />
    );
};

export default WalletStep;

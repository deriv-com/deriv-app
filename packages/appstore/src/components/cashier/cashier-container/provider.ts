import { localize } from '@deriv/translations';
import DepositIconLight from 'Assets/svgs/cashier/ic-deposit-light.svg';
import WithdrawIconLight from 'Assets/svgs/cashier/ic-withdraw-light.svg';
import TransferIconLight from 'Assets/svgs/cashier/ic-transfer-light.svg';
import TransactionIconLight from 'Assets/svgs/cashier/ic-transactions-light.svg';
import DepositIconDark from 'Assets/svgs/cashier/ic-deposit-dark.svg';
import WithdrawIconDark from 'Assets/svgs/cashier/ic-withdraw-dark.svg';
import TransferIconDark from 'Assets/svgs/cashier/ic-transfer-dark.svg';
import TransactionIconDark from 'Assets/svgs/cashier/ic-transactions-dark.svg';

export const CASHIER_OPTIONS = [
    { title: localize('Deposit'), light_icon: DepositIconLight, dark_icon: DepositIconDark },
    { title: localize('Withdraw'), light_icon: WithdrawIconLight, dark_icon: WithdrawIconDark },
    { title: localize('Transfer'), light_icon: TransferIconLight, dark_icon: TransferIconDark },
    { title: localize('Transactions'), light_icon: TransactionIconLight, dark_icon: TransactionIconDark },
    { title: localize('Reset balance'), light_icon: DepositIconLight, dark_icon: DepositIconDark },
];

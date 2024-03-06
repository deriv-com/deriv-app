import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown } from '@deriv-com/ui';
import { useTransfer } from '../../../../provider';
import { getTransferValidationSchema } from '../../../../utils';
import { TransferAccountTile } from './components/TransferAccountTile';
import styles from './TransferFormAccountSelection.module.scss';

const getInitialToAccount = (
    accounts: TExtendedTransferAccount['accounts'],
    activeAccount: TExtendedTransferAccount['activeAccount']
) => {
    if (!accounts || !activeAccount) return;

    if (activeAccount.loginid !== accounts[0].loginid) return accounts[0];

    return accounts[1];
};

const getValidationSchema = (fromAccount, toAccount) => {
    return getTransferValidationSchema({
        fromAccount: {
            balance: parseFloat(fromAccount?.balance ?? '0'),
            currency: fromAccount?.currency,
            fractionalDigits: fromAccount?.currencyConfig?.fractional_digits,
            limits: {
                max: 1000,
                min: 1,
            },
        },
        toAccount: {
            currency: toAccount?.currency,
            fractionalDigits: toAccount?.currencyConfig?.fractional_digits,
        },
    });
};

const TransferFormAccountSelection = ({ setValidationSchema }) => {
    const { setValues } = useFormikContext();
    const { accounts, activeAccount, isLoading } = useTransfer();

    useEffect(() => {
        if (!isLoading) {
            const fromAccount = activeAccount;
            const toAccount = getInitialToAccount(accounts, activeAccount);
            setValues({
                fromAccount,
                toAccount,
            });
            setValidationSchema(getValidationSchema(activeAccount, toAccount));
        }
    }, [isLoading]);

    return (
        <div className={styles.container}>
            <Dropdown
                dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                list={[
                    {
                        text: <TransferAccountTile />,
                        value: 'opt1',
                    },
                ]}
                name='transferFromDropdown'
                value='opt1'
            />
            <Dropdown
                dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                list={[
                    {
                        text: <div>yalla</div>,
                        value: 'yalla',
                    },
                ]}
                name='transferToDropdown'
            />
        </div>
    );
};

export default TransferFormAccountSelection;

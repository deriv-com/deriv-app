import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown } from '@deriv-com/ui';
import { useTransfer } from '../../../../provider';
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

const TransferFormAccountSelection = () => {
    const { setValues } = useFormikContext();
    const { accounts, activeAccount, isLoading } = useTransfer();

    useEffect(() => {
        if (!isLoading)
            setValues({
                fromAccount: activeAccount,
                toAccount: getInitialToAccount(accounts, activeAccount),
            });
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

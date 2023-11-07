import React from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletButton, WalletTextField } from '../../../../../../components/Base';
import { WalletsPercentageSelector } from '../../../../../../components/WalletsPercentageSelector';
import { WithdrawalCryptoAmountConverter } from './components/WithdrawalCryptoAmountConverter';
import './WithdrawalCryptoForm.scss';

const MIN_ADDRESS_LENGTH = 25;
const MAX_ADDRESS_LENGTH = 64;

const validateCryptoAddress = (address: string) => {
    if (!address) return 'This field is required.';

    if (address.length < MIN_ADDRESS_LENGTH || address.length > MAX_ADDRESS_LENGTH) {
        return 'Your wallet address should have 25 to 64 characters.';
    }

    return undefined;
};

const WithdrawalCryptoForm = () => {
    const { data: activeWallet } = useActiveWalletAccount();

    return (
        <Formik
            initialValues={{
                address: '',
            }}
        >
            <form action='' autoComplete='off' className='wallets-withdrawal-crypto-form'>
                <div className='wallets-withdrawal-crypto-address'>
                    <Field name='crypto-address' validate={validateCryptoAddress}>
                        {({ field }: FieldProps<string>) => (
                            <WalletTextField
                                {...field}
                                label='Your BTC Wallet address'
                                name='wallets-withdrawal-crypto-address-textfield'
                            />
                        )}
                    </Field>
                </div>
                <WalletsPercentageSelector
                    amount={200}
                    balance={activeWallet?.balance}
                    // onChangePercentage={per => console.log(per)}
                />
                <WithdrawalCryptoAmountConverter />
                <div className='wallets-withdrawal-crypto__submit'>
                    <WalletButton size='lg' text='Withdraw' type='submit' />
                </div>
            </form>
        </Formik>
    );
};

export default WithdrawalCryptoForm;

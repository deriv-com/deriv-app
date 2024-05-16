import React, { useEffect, useRef } from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { useHover } from 'usehooks-ts';
import {
    Tooltip,
    WalletButton,
    WalletCheckbox,
    WalletsPriorityCryptoWithdrawLoader,
    WalletTextField,
} from '../../../../../../components';
import InfoIcon from '../../../../../../public/images/ic-info-outline.svg';
import { useWithdrawalCryptoContext } from '../../provider';
import { validateCryptoAddress } from '../../utils';
import { WithdrawalCryptoAmountConverter } from './components/WithdrawalCryptoAmountConverter';
import { WithdrawalCryptoPercentageSelector } from './components/WithdrawalCryptoPercentageSelector';
import { WithdrawalCryptoPriorityFeeInfo } from './components/WithdrawalCryptoPriorityFeeInfo';
import './WithdrawalCryptoForm.scss';

const WithdrawalCryptoForm: React.FC = () => {
    const {
        activeWallet,
        cryptoEstimationsError,
        cryptoEstimationsFeeUniqueId,
        fractionalDigits,
        getCryptoEstimations,
        isLoadingCryptoEstimationFee,
        requestCryptoWithdrawal,
        setError,
    } = useWithdrawalCryptoContext();
    const hoverRef = useRef(null);
    const isHovered = useHover(hoverRef);

    useEffect(() => {
        if (cryptoEstimationsError) {
            setError(cryptoEstimationsError);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cryptoEstimationsError]);

    return (
        <Formik
            initialValues={{
                cryptoAddress: '',
                cryptoAmount: '',
                fiatAmount: '',
                priorityWithdrawal: false,
            }}
            onSubmit={values =>
                requestCryptoWithdrawal({
                    address: values.cryptoAddress,
                    amount: parseFloat(parseFloat(values.cryptoAmount).toFixed(fractionalDigits.crypto)),
                    estimated_fee_unique_id: values.priorityWithdrawal ? cryptoEstimationsFeeUniqueId : undefined,
                })
            }
        >
            {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => {
                return (
                    <form autoComplete='off' className='wallets-withdrawal-crypto-form' onSubmit={handleSubmit}>
                        <div className='wallets-withdrawal-crypto-address'>
                            <Field name='cryptoAddress' validate={validateCryptoAddress}>
                                {({ field }: FieldProps<string>) => (
                                    <WalletTextField
                                        {...field}
                                        data-testid='dt_withdrawal_crypto_address_input'
                                        errorMessage={touched.cryptoAddress && errors.cryptoAddress}
                                        isInvalid={touched.cryptoAddress && Boolean(errors?.cryptoAddress)}
                                        label={`Your ${activeWallet?.currency_config?.name} cryptocurrency wallet address`}
                                        showMessage
                                    />
                                )}
                            </Field>
                        </div>
                        <WithdrawalCryptoPercentageSelector />
                        <WithdrawalCryptoAmountConverter />
                        <div className='wallets-withdrawal-crypto-form-checkbox'>
                            <WalletCheckbox
                                checked={values.priorityWithdrawal}
                                label={'Priority withdrawal'}
                                labelFontSize='md'
                                name='priorityWithdrawal'
                                onChange={e => {
                                    if (!values.priorityWithdrawal) {
                                        getCryptoEstimations(activeWallet?.currency ?? '');
                                    }
                                    handleChange(e);
                                }}
                            />
                            <Tooltip
                                alignment='top'
                                isVisible={isHovered}
                                message='Pay a small fee to prioritise your withdrawal, this fee will be deducted from the withdrawal amount.'
                            >
                                <div ref={hoverRef}>
                                    <InfoIcon />
                                </div>
                            </Tooltip>
                        </div>
                        {isLoadingCryptoEstimationFee && <WalletsPriorityCryptoWithdrawLoader />}
                        {!isLoadingCryptoEstimationFee && values.priorityWithdrawal && (
                            <WithdrawalCryptoPriorityFeeInfo cryptoAmount={values.cryptoAmount} />
                        )}
                        <div className='wallets-withdrawal-crypto-form__submit'>
                            <WalletButton
                                disabled={Object.keys(errors).length !== 0 || !values.cryptoAmount || isSubmitting}
                                isLoading={isSubmitting}
                                size='lg'
                                type='submit'
                            >
                                Withdraw
                            </WalletButton>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default WithdrawalCryptoForm;

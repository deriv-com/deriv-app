import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { Tooltip } from '@deriv-com/ui';
import { WalletCheckbox, WalletsPriorityCryptoWithdrawLoader } from '../../../../../../../../components';
import InfoIcon from '../../../../../../../../public/images/ic-info-outline.svg';
import { useWithdrawalCryptoContext } from '../../../../provider';
import { WithdrawalCryptoPriorityFeeInfo } from '../WithdrawalCryptoPriorityFeeInfo';
import './WithdrawalCryptoPriority.scss';

const WithdrawalCryptoPriority = () => {
    const { handleChange, values } = useFormikContext<{
        cryptoAmount: string;
        priorityWithdrawal: boolean;
    }>();

    const {
        activeWallet,
        cryptoEstimationsError,
        getCryptoEstimations,
        isLoadingCryptoEstimationFee,
        setCurrencyCode,
        setError,
        unsubscribeCryptoEstimations,
    } = useWithdrawalCryptoContext();

    useEffect(() => {
        if (cryptoEstimationsError) {
            setError(cryptoEstimationsError);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cryptoEstimationsError]);

    useEffect(() => {
        return () => {
            unsubscribeCryptoEstimations();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className='wallets-crypto-form-checkbox'>
                <WalletCheckbox
                    checked={values.priorityWithdrawal}
                    label={'Priority withdrawal'}
                    labelFontSize='md'
                    name='priorityWithdrawal'
                    onChange={e => {
                        if (!values.priorityWithdrawal) {
                            setCurrencyCode(activeWallet?.currency ?? '');
                            getCryptoEstimations({
                                payload: {
                                    currency_code: activeWallet?.currency ?? '',
                                },
                            });
                        }
                        handleChange(e);
                    }}
                />
                <Tooltip
                    as='div'
                    tooltipContent='Pay a small fee to prioritise your withdrawal, this fee will be deducted from the withdrawal amount.'
                    tooltipPosition='top'
                >
                    <InfoIcon />
                </Tooltip>
            </div>
            {isLoadingCryptoEstimationFee && <WalletsPriorityCryptoWithdrawLoader />}
            {!isLoadingCryptoEstimationFee && values.priorityWithdrawal && (
                <WithdrawalCryptoPriorityFeeInfo cryptoAmount={values.cryptoAmount} />
            )}
        </>
    );
};

export default WithdrawalCryptoPriority;

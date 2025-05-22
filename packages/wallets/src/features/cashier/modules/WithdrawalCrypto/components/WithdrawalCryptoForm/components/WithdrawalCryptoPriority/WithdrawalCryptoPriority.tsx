import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { LegacyInfo1pxIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Checkbox, Tooltip } from '@deriv-com/ui';
import { WalletsPriorityCryptoWithdrawLoader } from '../../../../../../../../components';
import { useWithdrawalCryptoContext } from '../../../../provider';
import { WithdrawalCryptoPriorityFeeInfo } from '../WithdrawalCryptoPriorityFeeInfo';
import './WithdrawalCryptoPriority.scss';

const WithdrawalCryptoPriority = () => {
    const { localize } = useTranslations();

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
        <React.Fragment>
            <div className='wallets-crypto-form-checkbox'>
                <Checkbox
                    checked={values.priorityWithdrawal}
                    label={localize('Priority withdrawal')}
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
                    tooltipContent={localize(
                        'Pay a small fee to prioritise your withdrawal, this fee will be deducted from the withdrawal amount.'
                    )}
                    tooltipPosition='top'
                >
                    <LegacyInfo1pxIcon width={16} />
                </Tooltip>
            </div>
            {isLoadingCryptoEstimationFee && <WalletsPriorityCryptoWithdrawLoader />}
            {!isLoadingCryptoEstimationFee && values.priorityWithdrawal && (
                <WithdrawalCryptoPriorityFeeInfo cryptoAmount={values.cryptoAmount} />
            )}
        </React.Fragment>
    );
};

export default WithdrawalCryptoPriority;

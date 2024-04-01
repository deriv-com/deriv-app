import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { AdCreateEditErrorModal, AdCreateEditSuccessModal } from '@/components/Modals';
import { DUMMY_COUNTRIES, MY_ADS_URL } from '@/constants';
import { useFloatingRate } from '@/hooks';
import { p2p, useActiveAccount } from '@deriv/api-v2';
import { AdWizard } from '../../components';

const STEPS = [
    { header: { title: 'Set ad type and amount' } },
    { header: { title: 'Set payment details' } },
    { header: { title: 'Set ad conditions' } },
];

const CreateEditAd = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const { rateType } = useFloatingRate();
    const { data: activeAccount } = useActiveAccount();
    const { data: p2pSettings } = p2p.settings.useGetSettings();
    const { order_payment_period: orderPaymentPeriod } = p2pSettings ?? {};
    const { error, isError, isSuccess, mutate } = p2p.advert.useCreate();
    const history = useHistory();
    const methods = useForm({
        defaultValues: {
            'ad-type': 'buy',
            amount: '',
            instructions: '',
            'max-order': '',
            'min-completion-rate': '',
            'min-join-days': '',
            'min-order': '',
            'order-completion-time': `${orderPaymentPeriod ? (orderPaymentPeriod * 60).toString() : '3600'}`,
            'payment-method': '',
            'preferred-countries': Object.keys(DUMMY_COUNTRIES),
            'rate-value': '-0.01',
        },
        mode: 'all',
    });

    const shouldNotShowArchiveMessageAgain = localStorage.getItem('should_not_show_auto_archive_message_again');
    const { getValues, handleSubmit } = methods;
    const onSubmit = () => {
        const payload = {
            amount: Number(getValues('amount')),
            eligible_countries: getValues('preferred-countries'),
            max_order_amount: Number(getValues('max-order')),
            min_order_amount: Number(getValues('min-order')),
            rate: Number(getValues('rate-value')),
            type: getValues('ad-type') as 'buy' | 'sell',
        };

        if (getValues('ad-type') === 'buy') {
            payload.payment_method_names = getValues('payment-method');
        } else {
            payload.payment_method_ids = getValues('payment-method');
        }
        if (getValues('instructions')) {
            payload.description = getValues('instructions');
        }
        if (getValues('min-completion-rate')) {
            payload.min_completion_rate = Number(getValues('min-completion-rate'));
        }
        if (getValues('min-join-days')) {
            payload.min_join_days = Number(getValues('min-join-days'));
        }
        mutate(payload);
    };

    useEffect(() => {
        if (isSuccess) {
            // TODO: Show success modal and other 2 visibility modals after modal manager implementation or update ad impelementation
            // Redirect to the ad list page
            if (shouldNotShowArchiveMessageAgain !== 'true') {
                setIsSuccessModalOpen(true);
            } else {
                history.push(MY_ADS_URL);
            }
        } else if (isError) {
            setIsModalOpen(true);
        }
    }, [isSuccess, history, shouldNotShowArchiveMessageAgain, isError]);

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <AdWizard
                        currency={activeAccount?.currency ?? 'USD'}
                        localCurrency={p2pSettings?.localCurrency}
                        rateType={rateType}
                        steps={STEPS}
                    />
                </form>
            </FormProvider>
            {isModalOpen && (
                <AdCreateEditErrorModal
                    errorCode={error?.error?.code}
                    isModalOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                />
            )}
            {isSuccessModalOpen && (
                <AdCreateEditSuccessModal
                    advertsArchivePeriod={orderPaymentPeriod}
                    isModalOpen={isSuccessModalOpen}
                    onRequestClose={() => setIsSuccessModalOpen(false)}
                />
            )}
        </>
    );
};

export default CreateEditAd;

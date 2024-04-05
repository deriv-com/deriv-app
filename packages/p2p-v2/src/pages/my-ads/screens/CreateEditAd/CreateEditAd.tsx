import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { THooks } from 'types';
import { AdCancelCreateEditModal, AdCreateEditErrorModal, AdCreateEditSuccessModal } from '@/components/Modals';
import { MY_ADS_URL } from '@/constants';
import { useFloatingRate, useQueryString } from '@/hooks';
import { p2p, useActiveAccount } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { AdWizard } from '../../components';

const getSteps = (isEdit = false) => {
    const text = isEdit ? 'Edit' : 'Set';
    const steps = [
        { header: { title: `${text} ad type and amount` } },
        { header: { title: `${text} payment details` } },
        { header: { title: `${text} ad conditions` } },
    ];
    return steps;
};
type FormValues = {
    'ad-type': 'buy' | 'sell';
    amount: string;
    'contact-details': string;
    instructions: string;
    'max-order': string;
    'min-completion-rate': string;
    'min-join-days': string;
    'min-order': string;
    'order-completion-time': string;
    'payment-method': number[] | string[];
    'preferred-countries': string[];
    'rate-value': string;
};

const CreateEditAd = () => {
    const { queryString } = useQueryString();
    const { advertId = '' } = queryString;
    const { data: advertInfo, isLoading } = p2p.advert.useGet(
        { id: advertId },
        { enabled: !!advertId, refetchOnWindowFocus: false }
    );
    const isEdit = !!advertId;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const { data: countryList = {} } = p2p.countryList.useGet();
    const { data: paymentMethodList = [] } = p2p.paymentMethods.useGet();
    const { rateType } = useFloatingRate();
    const { data: activeAccount } = useActiveAccount();
    const { data: p2pSettings } = p2p.settings.useGetSettings();
    const { order_payment_period: orderPaymentPeriod } = p2pSettings ?? {};
    const { error, isError, isSuccess, mutate } = p2p.advert.useCreate();
    const {
        error: updateError,
        isError: isUpdateError,
        isSuccess: isUpdateSuccess,
        mutate: updateMutate,
    } = p2p.advert.useUpdate();
    const history = useHistory();
    const methods = useForm<FormValues>({
        defaultValues: {
            'ad-type': 'buy',
            amount: '',
            'contact-details': '',
            instructions: '',
            'max-order': '',
            'min-completion-rate': '',
            'min-join-days': '',
            'min-order': '',
            'order-completion-time': `${orderPaymentPeriod ? (orderPaymentPeriod * 60).toString() : '3600'}`,
            'payment-method': [],
            'preferred-countries': Object.keys(countryList),
            'rate-value': '-0.01',
        },
        mode: 'all',
    });

    const {
        formState: { isDirty },
        getValues,
        handleSubmit,
        setValue,
    } = methods;
    useEffect(() => {
        if (Object.keys(countryList).length > 0 && getValues('preferred-countries').length === 0) {
            setValue('preferred-countries', Object.keys(countryList));
        }
    }, [countryList, getValues, setValue]);

    const shouldNotShowArchiveMessageAgain = localStorage.getItem('should_not_show_auto_archive_message_again');

    const onSubmit = () => {
        const payload = {
            amount: Number(getValues('amount')),
            eligible_countries: getValues('preferred-countries'),
            max_order_amount: Number(getValues('max-order')),
            min_order_amount: Number(getValues('min-order')),
            rate: Number(getValues('rate-value')),
            rate_type: rateType,
            type: getValues('ad-type'),
        };

        if (getValues('ad-type') === 'buy') {
            payload.payment_method_names = getValues('payment-method');
        } else {
            payload.contact_info = getValues('contact-details');
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

        if (isEdit) {
            delete payload.amount;
            delete payload.type;
            updateMutate({ id: advertId, ...payload });
            return;
        }
        mutate(payload);
    };

    useEffect(() => {
        if (isSuccess || isUpdateSuccess) {
            // TODO: Show success modal and other 2 visibility modals after modal manager implementation or update ad impelementation
            // Redirect to the ad list page
            if (shouldNotShowArchiveMessageAgain !== 'true') {
                setIsSuccessModalOpen(true);
            } else {
                history.push(MY_ADS_URL);
            }
        } else if (isError || isUpdateError) {
            setIsModalOpen(true);
        }
    }, [isSuccess, history, shouldNotShowArchiveMessageAgain, isError, isUpdateSuccess, isUpdateError]);

    const setFormValues = useCallback(
        (advertInfo: THooks.Advert.Get) => {
            setValue('ad-type', advertInfo.type);
            setValue('amount', advertInfo.amount);
            setValue('instructions', advertInfo.description);
            setValue('max-order', advertInfo.max_order_amount);
            setValue('min-completion-rate', advertInfo.min_completion_rate);
            setValue('min-join-days', advertInfo.min_join_days);
            setValue('min-order', advertInfo.min_order_amount);
            setValue('rate-value', advertInfo.rate);
            setValue('preferred-countries', advertInfo.eligible_countries ?? Object.keys(countryList));
            setValue('order-completion-time', `${advertInfo.order_expiry_period}`);
            if (advertInfo.type === 'sell') {
                setValue('contact-details', advertInfo.contact_info);
                setValue('payment-method', Object.keys(advertInfo.payment_method_details ?? {}).map(Number));
            } else {
                const paymentMethodNames = advertInfo?.payment_method_names;
                const paymentMethodKeys = paymentMethodNames?.map(
                    name => paymentMethodList.find(method => method.display_name === name)?.id
                );
                setValue('payment-method', paymentMethodKeys);
            }
        },
        [setValue, countryList, paymentMethodList]
    );

    useEffect(() => {
        if (advertInfo && isEdit) {
            setFormValues(advertInfo);
        }
    }, [advertInfo, isEdit, setFormValues]);

    if ((isLoading && isEdit) || (isEdit && !advertInfo)) {
        return <Loader />;
    }

    const onClickCancel = () => {
        if (isDirty) setIsCancelModalOpen(true);
        else history.push(MY_ADS_URL);
    };

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <AdWizard
                        countryList={countryList}
                        currency={activeAccount?.currency ?? 'USD'}
                        localCurrency={p2pSettings?.localCurrency}
                        onCancel={onClickCancel}
                        rateType={rateType}
                        steps={getSteps(isEdit)}
                    />
                </form>
            </FormProvider>
            {isModalOpen && (
                <AdCreateEditErrorModal
                    errorCode={error?.error?.code || updateError?.error?.code}
                    errorMessage={(error?.error?.message || updateError?.error?.message) ?? 'Something’s not right'}
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
            {isCancelModalOpen && (
                <AdCancelCreateEditModal
                    isModalOpen={isCancelModalOpen}
                    onRequestClose={() => setIsCancelModalOpen(false)}
                />
            )}
        </>
    );
};

export default CreateEditAd;

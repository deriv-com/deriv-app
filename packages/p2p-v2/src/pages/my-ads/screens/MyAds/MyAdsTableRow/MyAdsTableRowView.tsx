import React, { memo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    AdErrorTooltipModal,
    AdRateSwitchModal,
    ErrorModal,
    MyAdsDeleteModal,
    ShareAdsModal,
} from '@/components/Modals';
import { AD_ACTION, MY_ADS_URL } from '@/constants';
import { useFloatingRate, useModalManager } from '@/hooks';
import { getVisibilityErrorCodes } from '@/utils';
import { p2p } from '@deriv/api-v2';
import { TMyAdsTableRowRendererProps } from '../MyAdsTable/MyAdsTable';
import MyAdsTableRow from './MyAdsTableRow';

const MyAdsTableRowView = ({
    balanceAvailable,
    dailyBuyLimit,
    dailySellLimit,
    isListed,
    ...rest
}: TMyAdsTableRowRendererProps) => {
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { rateType: currentRateType, reachedTargetDate } = useFloatingRate();
    const { error: updateError, isError: isErrorUpdate, mutate } = p2p.advert.useUpdate();
    const { error, isError, mutate: deleteAd } = p2p.advert.useDelete();
    const history = useHistory();

    const {
        account_currency: accountCurrency,
        id = '',
        rate_type: rateType,
        remaining_amount: remainingAmount,
        type,
        visibility_status: visibilityStatus = [],
    } = rest;

    useEffect(() => {
        if (isError && error?.error?.message) {
            showModal('MyAdsDeleteModal');
        }
    }, [error?.error?.message, isError]);

    useEffect(() => {
        if (isErrorUpdate && updateError?.error?.message) {
            showModal('ErrorModal');
        }
    }, [updateError?.error?.message]);

    const onClickIcon = (action: string) => {
        switch (action) {
            case AD_ACTION.ACTIVATE:
                mutate({ id, is_active: 1 });
                break;
            case AD_ACTION.DEACTIVATE:
                mutate({ id, is_active: 0 });
                break;
            case AD_ACTION.DELETE: {
                showModal('MyAdsDeleteModal');
                break;
            }
            case AD_ACTION.SHARE: {
                showModal('ShareAdsModal');
                break;
            }
            case AD_ACTION.EDIT: {
                history.push(`${MY_ADS_URL}/adForm?formAction=edit&advertId=${id}`);
                break;
            }
            default:
                break;
        }
    };
    const onClickDelete = () => {
        deleteAd({ id });
        hideModal();
    };
    return (
        <>
            <MyAdsTableRow
                currentRateType={currentRateType}
                isListed={isListed}
                onClickIcon={onClickIcon}
                showModal={showModal}
                {...rest}
            />
            <AdErrorTooltipModal
                accountCurrency={accountCurrency}
                advertType={type}
                balanceAvailable={balanceAvailable}
                dailyBuyLimit={dailyBuyLimit}
                dailySellLimit={dailySellLimit}
                isModalOpen={!!isModalOpenFor('AdErrorTooltipModal')}
                onRequestClose={hideModal}
                remainingAmount={remainingAmount}
                visibilityStatus={getVisibilityErrorCodes(visibilityStatus, rateType !== currentRateType, isListed)}
            />
            <MyAdsDeleteModal
                error={error?.error?.message}
                id={id}
                isModalOpen={!!isModalOpenFor('MyAdsDeleteModal') || !!error?.error?.message}
                onClickDelete={onClickDelete}
                onRequestClose={hideModal}
            />
            <ShareAdsModal id={id} isModalOpen={!!isModalOpenFor('ShareAdsModal')} onRequestClose={hideModal} />
            <AdRateSwitchModal
                isModalOpen={!!isModalOpenFor('AdRateSwitchModal')}
                onClickSet={() => onClickIcon(AD_ACTION.EDIT)}
                onRequestClose={hideModal}
                rateType={currentRateType}
                reachedEndDate={reachedTargetDate}
            />
            <ErrorModal
                isModalOpen={!!isModalOpenFor('ErrorModal')}
                message={updateError?.error?.message}
                onRequestClose={hideModal}
            />
        </>
    );
};

export default memo(MyAdsTableRowView);

import React, { ReactNode, useEffect } from 'react';
import Modal from 'react-modal';
import { ADVERT_TYPE, ERROR_CODES } from '@/constants';
import { AdRateError } from '@/pages/my-ads/components';
import { Button, Text } from '@deriv-com/ui';
import { customStyles } from '../helpers';
import './AdErrorTooltipModal.scss';

type TAdErrorTooltipModal = {
    accountCurrency: string;
    advertType: string;
    balanceAvailable: number;
    dailyBuyLimit: string;
    dailySellLimit: string;
    isModalOpen: boolean;
    onRequestClose: () => void;
    remainingAmount: number;
    visibilityStatus: string[];
};

const getAdErrorMessage = (
    errorCode: string,
    accountCurrency: string,
    remainingAmount: number,
    balanceAvailable: number,
    advertType: string,
    dailyBuyLimit: string,
    dailySellLimit: string
): string => {
    const errorMessages: { [key: string]: ReactNode | string } = {
        [ERROR_CODES.ADVERT_INACTIVE]: <AdRateError />,
        [ERROR_CODES.ADVERT_MAX_LIMIT]: `This ad is not listed on Buy/Sell because its minimum order is higher than the maximum amount per order ${accountCurrency}.`,
        [ERROR_CODES.ADVERT_MIN_LIMIT]:
            'This ad is not listed on Buy/Sell because its maximum order is lower than the minimum amount you can specify for orders in your ads.',
        [ERROR_CODES.ADVERT_REMAINING]: `This ad is not listed on Buy/Sell because its minimum order is higher than the ad’s remaining amount (${remainingAmount} ${accountCurrency}).`,
        [ERROR_CODES.ADVERTISER_ADS_PAUSED]: 'This ad is not listed on Buy/Sell because you have paused all your ads.',
        [ERROR_CODES.AD_EXCEEDS_BALANCE]: `This ad is not listed on Buy/Sell because its minimum order is higher than your Deriv P2P available balance (${balanceAvailable} ${accountCurrency}).`,
        [ERROR_CODES.AD_EXCEEDS_DAILY_LIMIT]: `This ad is not listed on Buy/Sell because its minimum order is higher than your remaining daily limit (${
            advertType.toLowerCase() === ADVERT_TYPE.BUY.toLowerCase() ? dailyBuyLimit : dailySellLimit
        } ${accountCurrency}).`,
        [ERROR_CODES.ADVERTISER_TEMP_BAN]: `You’re not allowed to use Deriv P2P to advertise. Please contact us via live chat for more information.`,
    };

    return (errorMessages[errorCode] as string) ?? 'Your ad is not listed';
};

const AdErrorTooltipModal = ({
    accountCurrency,
    advertType,
    balanceAvailable,
    dailyBuyLimit,
    dailySellLimit,
    isModalOpen,
    onRequestClose,
    remainingAmount,
    visibilityStatus = [],
}: TAdErrorTooltipModal) => {
    useEffect(() => {
        Modal.setAppElement('#v2_modal_root');
    }, []);

    const getMultipleErrorMessages = (errorStatuses: string[]) =>
        errorStatuses.map((status, index) => (
            <div className='my-5' key={status}>
                {index + 1}.{' '}
                {getAdErrorMessage(
                    status,
                    accountCurrency,
                    remainingAmount,
                    balanceAvailable,
                    advertType,
                    dailyBuyLimit,
                    dailySellLimit
                )}
            </div>
        ));

    return (
        <Modal
            className='p2p-v2-ad-error-tooltip-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >
            <div className='p2p-v2-ad-error-tooltip-modal__content'>
                <Text size='sm'>
                    {visibilityStatus.length === 1 ? (
                        getAdErrorMessage(
                            visibilityStatus[0],
                            accountCurrency,
                            remainingAmount,
                            balanceAvailable,
                            advertType,
                            dailyBuyLimit,
                            dailySellLimit
                        )
                    ) : (
                        <>
                            Your ad isn’t listed on Buy/Sell due to the following reason(s):
                            {getMultipleErrorMessages(visibilityStatus)}
                        </>
                    )}
                </Text>
            </div>
            <div className='flex justify-end gap-[1rem]'>
                <Button onClick={onRequestClose} size='lg' textSize='sm'>
                    OK
                </Button>
            </div>
        </Modal>
    );
};

export default AdErrorTooltipModal;

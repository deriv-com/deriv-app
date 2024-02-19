import React from 'react';
import { Modal } from '@/components';
import { THooks, TPlatforms } from '@/types';
import { CFDPlatforms, MarketType, MarketTypeDetails, PlatformDetails } from '@cfd/constants';
import { useIsEuRegion, useMT5Deposit, useOtherCFDPlatformsDeposit } from '@deriv/api';
import { Button, Text } from '@deriv-com/ui';

type TTopUpModalProps = {
    account: THooks.CtraderAccountsList | THooks.DxtradeAccountsList | THooks.MT5AccountsList;
    platform: TPlatforms.All;
};

const TopUpModal = ({ account, platform }: TTopUpModalProps) => {
    const { data: isEuRegion } = useIsEuRegion();
    const { mutateAsync: MT5Deposit } = useMT5Deposit();
    const { mutateAsync: OtherCFDPlatformsDeposit } = useOtherCFDPlatformsDeposit();

    const topUpVirtual = async () => {
        if (platform === CFDPlatforms.MT5) {
            await MT5Deposit({
                to_mt5: account?.login ?? '',
            });
        } else {
            await OtherCFDPlatformsDeposit({
                platform,
                to_account: (account as THooks.CtraderAccountsList | THooks.DxtradeAccountsList).account_id ?? '',
            });
        }
    };

    const platformTitle = PlatformDetails[platform].title;
    const marketTypeDetails = MarketTypeDetails(isEuRegion)[account.market_type ?? MarketType.ALL];
    const marketTypeTitle = marketTypeDetails?.title ?? '';
    const title = platform === CFDPlatforms.MT5 ? `${platformTitle} ${marketTypeTitle}` : platformTitle;

    const balance =
        platform === CFDPlatforms.CTRADER
            ? (account as THooks.CtraderAccountsList)?.formatted_balance
            : account?.display_balance;

    return (
        <Modal className='max-w-[330px] md:max-w-[440px]'>
            <Modal.Header title='Fund top up' />
            <Modal.Content className='flex flex-col items-center justify-center p-24 space-y-24 sm:p-24'>
                <Text weight='bold'>{title} Demo account</Text>
                <div className='text-center'>
                    <Text size='sm' weight='bold'>
                        Balance
                    </Text>
                    <Text className='text-6xl text-status-light-success lg:text-2xl' weight='bold'>
                        {balance}
                    </Text>
                </div>
                <Text className='text-center' size='sm'>
                    You can top up your demo account with an additional 10,000.00 USD if you balance is 1,000.00 USD or
                    less.
                </Text>
                <div>
                    <Button
                        className='px-16 rounded-xs'
                        disabled={Number(account?.balance) > 1000}
                        onClick={topUpVirtual}
                    >
                        Top up 10,000 USD
                    </Button>
                </div>
            </Modal.Content>
        </Modal>
    );
};

export default TopUpModal;

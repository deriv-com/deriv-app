import React from 'react';
import { useIsEuRegion, useMT5Deposit, useOtherCFDPlatformsDeposit } from '@deriv/api';
import { Button, Heading, Text, useBreakpoint } from '@deriv/quill-design';
import { Modal } from '../../../../components/Modal';
import { THooks, TPlatforms } from '../../../../types';
import { CFDPlatforms, MarketType, MarketTypeDetails, PlatformDetails } from '../../constants';

type TTopUpModalProps = {
    account: THooks.CtraderAccountsList | THooks.DxtradeAccountsList | THooks.MT5AccountsList;
    platform: TPlatforms.All;
};

const TopUpModal = ({ account, platform }: TTopUpModalProps) => {
    const { isDesktop } = useBreakpoint();
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

    const HeadingTag = isDesktop ? Heading.H3 : Heading.H2;
    const balance =
        platform === CFDPlatforms.CTRADER
            ? (account as THooks.CtraderAccountsList)?.formatted_balance
            : account?.display_balance;

    return (
        <Modal className='max-w-[330px] md:max-w-[440px]'>
            <Modal.Header title='Fund top up' />
            <Modal.Content className='flex flex-col items-center justify-center space-y-1200 p-1200 sm:p-1200'>
                <Text bold>{title} Demo account</Text>
                <div className='text-center'>
                    <Text bold size='sm'>
                        Balance
                    </Text>
                    <HeadingTag className='text-status-light-success'>{balance}</HeadingTag>
                </div>
                <Text className='text-center' size='sm'>
                    You can top up your demo account with an additional 10,000.00 USD if you balance is 1,000.00 USD or
                    less.
                </Text>
                <div>
                    <Button
                        className='rounded-200 px-800'
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

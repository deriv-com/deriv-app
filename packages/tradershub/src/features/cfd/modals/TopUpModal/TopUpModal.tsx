import React from 'react';
import { useQueryParams, useRegulationFlags } from '@/hooks';
import { useCFDContext } from '@/providers';
import { THooks } from '@/types';
import { CFDPlatforms, MarketType, MarketTypeDetails, PlatformDetails } from '@cfd/constants';
import { useMT5Deposit, useOtherCFDPlatformsDeposit } from '@deriv/api-v2';
import { Button, Modal, Text } from '@deriv-com/ui';

const TopUpModal = () => {
    const { isEU } = useRegulationFlags();
    const { mutateAsync: MT5Deposit } = useMT5Deposit();
    const { mutateAsync: OtherCFDPlatformsDeposit } = useOtherCFDPlatformsDeposit();
    const { cfdState } = useCFDContext();
    const { isModalOpen, closeModal } = useQueryParams();

    const { account, platform } = cfdState;

    if (!account || !platform) return null;

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
    const marketTypeDetails = MarketTypeDetails(isEU)[account.market_type ?? MarketType.ALL];
    const marketTypeTitle = marketTypeDetails?.title ?? '';
    const title = platform === CFDPlatforms.MT5 ? `${platformTitle} ${marketTypeTitle}` : platformTitle;

    const balance =
        platform === CFDPlatforms.CTRADER
            ? (account as THooks.CtraderAccountsList)?.formatted_balance
            : account?.display_balance;

    return (
        <Modal isOpen={isModalOpen('TopUpModal')} onRequestClose={closeModal}>
            <Modal.Header onRequestClose={closeModal}>
                <Text weight='bold'>Fund top up</Text>
            </Modal.Header>
            <Modal.Body className='flex flex-col items-center justify-center p-24 space-y-24 max-w-[440px] '>
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
            </Modal.Body>
        </Modal>
    );
};

export default TopUpModal;

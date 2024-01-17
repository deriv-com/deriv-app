import React, { useCallback } from 'react';
import { useIsEuRegion } from '@deriv/api';
import { Button, Heading, Text, useBreakpoint } from '@deriv/quill-design';
import { Modal } from '../../../../components/Modal';
import { THooks, TPlatforms } from '../../../../types';
import {
    CFDPlatforms,
    getCTraderCompanies,
    getDxCompanies,
    getMT5Companies,
    MarketType,
    MarketTypeDetails,
    PlatformDetails,
} from '../../constants';

type TTradeModalProps = {
    account: THooks.CtraderAccountsList | THooks.DxtradeAccountsList | THooks.MT5AccountsList;
    platform: TPlatforms.All;
};

const TopUpModal = ({ account, platform }: TTradeModalProps) => {
    const { isDesktop } = useBreakpoint();
    const { data: isEuRegion } = useIsEuRegion();

    const ctraderCompanies = getCTraderCompanies();
    const dxtradeCompanies = getDxCompanies();
    const mt5Companies = getMT5Companies(isEuRegion);

    const platformTitle = PlatformDetails[platform].title;

    const marketTypeDetails = MarketTypeDetails(isEuRegion)[account.market_type ?? MarketType.ALL];

    const marketTypeTitle = marketTypeDetails?.title ?? '';

    const title = platform === CFDPlatforms.MT5 ? `${platformTitle} ${marketTypeTitle}` : platformTitle;

    const HeadingTag = isDesktop ? Heading.H3 : Heading.H2;

    const getAccountTitle = useCallback(() => {
        let title = '';
        if ((!mt5Companies && !dxtradeCompanies && !ctraderCompanies) || !account) return '';

        switch (platform) {
            case CFDPlatforms.MT5:
                title =
                    mt5Companies[account.is_virtual ? 'demo' : 'real'][
                        account.market_type as keyof typeof mt5Companies['demo' | 'real']
                    ].title;
                break;
            case CFDPlatforms.CTRADER:
                title =
                    ctraderCompanies[account.is_virtual ? 'demo' : 'real'][
                        account.market_type as keyof typeof ctraderCompanies['demo' | 'real']
                    ].title;
                break;
            case CFDPlatforms.DXTRADE:
                title =
                    dxtradeCompanies[account.is_virtual ? 'demo' : 'real'][
                        account.market_type as keyof typeof dxtradeCompanies['demo' | 'real']
                    ].title;
                break;
            default:
                break;
        }

        return title;
    }, [mt5Companies, dxtradeCompanies, account, ctraderCompanies, platform]);

    return (
        <Modal className='max-w-[330px] md:max-w-[440px]'>
            <Modal.Header title='Fund top up' />
            <Modal.Content className='flex flex-col items-center justify-center space-y-1200 p-1200'>
                <Text bold>{title} Demo account</Text>
                <Text bold>{getAccountTitle()} Demo account</Text>
                <div className='text-center'>
                    <Text bold size='sm'>
                        Balance
                    </Text>
                    <HeadingTag className='text-status-light-success'>{account?.display_balance}</HeadingTag>
                </div>
                <Text className='text-center' size='sm'>
                    You can top up your demo account with an additional 10,000.00 USD if you balance is 1,000.00 USD or
                    less.
                </Text>
                <div>
                    <Button className='rounded-200 px-800' disabled={Number(account?.balance) > 1000}>
                        Top up 10,000 USD
                    </Button>
                </div>
            </Modal.Content>
        </Modal>
    );
};

export default TopUpModal;

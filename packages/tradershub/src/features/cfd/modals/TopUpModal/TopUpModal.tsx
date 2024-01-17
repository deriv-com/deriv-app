import React from 'react';
import { Button, Heading, qtMerge, Text, useBreakpoint } from '@deriv/quill-design';
import { Modal } from '../../../../components/Modal';
import { THooks, TPlatforms } from '../../../../types';

type TTradeModalProps = {
    account?: THooks.CtraderAccountsList | THooks.DxtradeAccountsList | THooks.MT5AccountsList;
    platform: TPlatforms.All;
};

const TopUpModal = ({ account, platform }: TTradeModalProps) => {
    // const { hide } = Provider.useModal();

    const { isDesktop } = useBreakpoint();
    const HeadingTag = isDesktop ? Heading.H3 : Heading.H2;

    // const getAccountTitle = useCallback(() => {
    //     let title = '';
    //     if ((!mt5_companies && !dxtrade_companies) || !current_account) return '';

    //     switch (platform) {
    //         case CFD_PLATFORMS.MT5:
    //             title =
    //                 mt5_companies[current_account.category as keyof TMtCompanies][
    //                     current_account.type as keyof TMtCompanies['demo' | 'real']
    //                 ].title;
    //             break;
    //         case CFD_PLATFORMS.CTRADER:
    //             title =
    //                 ctrader_companies[current_account.category as keyof TCTraderCompanies][
    //                     current_account.type as keyof TCTraderCompanies['demo' | 'real']
    //                 ].title;
    //             break;
    //         case CFD_PLATFORMS.DXTRADE:
    //             title =
    //                 dxtrade_companies[current_account.category as keyof TDxCompanies][
    //                     current_account.type as keyof TDxCompanies['demo' | 'real']
    //                 ].title;
    //             break;
    //         default:
    //             break;
    //     }

    //     return title;
    // }, [mt5_companies, dxtrade_companies, current_account, ctrader_companies, platform]);

    return (
        <Modal>
            <Modal.Header title='Fund top up' />
            <Modal.Content>
                <Text bold>{account?.name} Demo account</Text>
                <Text bold size='sm'>
                    Balance
                </Text>
                <HeadingTag
                    className={qtMerge(
                        'decoration-dotted decoration-system-light-less-prominent-text underline-offset-8 text-status-light-success'
                    )}
                >
                    {account?.display_balance}
                </HeadingTag>
                <Text size='sm'>
                    You can top up your demo account with an additional 10,000.00 USD if you balance is 1,000.00 USD or
                    less.
                </Text>
                <div className='flex justify-end gap-400'>
                    <Button colorStyle='black' disabled={Number(account?.balance) > 1000} variant='secondary'>
                        Top up 10,000 USD
                    </Button>
                </div>
            </Modal.Content>
        </Modal>
    );
};

export default TopUpModal;

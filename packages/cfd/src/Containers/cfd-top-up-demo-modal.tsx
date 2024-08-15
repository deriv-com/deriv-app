import React from 'react';
import SuccessDialog from '../Components/success-dialog';
import { getTopUpConfig } from '../Helpers/constants';
import { Icon, Modal, Button, Money, Text } from '@deriv/components';
import { getCFDPlatformLabel } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import {
    getCTraderCompanies,
    TCTraderCompanies,
    TDxCompanies,
    TMtCompanies,
} from '../Stores/Modules/CFD/Helpers/cfd-config';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';
import { CFD_PLATFORMS } from '../Helpers/cfd-config';

type TCFDTopUpDemoModalProps = {
    platform: string;
};

const CFDTopUpDemoModal = observer(({ platform }: TCFDTopUpDemoModalProps) => {
    const { ui } = useStore();

    const {
        is_top_up_virtual_open,
        is_top_up_virtual_in_progress,
        is_top_up_virtual_success,
        closeTopUpModal,
        closeSuccessTopUpModal,
    } = ui;

    const { current_account, dxtrade_companies, mt5_companies, topUpVirtual } = useCfdStore();

    const ctrader_companies = getCTraderCompanies();

    const getAccountTitle = React.useCallback(() => {
        let title = '';
        if ((!mt5_companies && !dxtrade_companies) || !current_account) return '';

        switch (platform) {
            case CFD_PLATFORMS.MT5:
                title =
                    mt5_companies[current_account.category as keyof TMtCompanies][
                        current_account.type as keyof TMtCompanies['demo' | 'real']
                    ].title;
                break;
            case CFD_PLATFORMS.CTRADER:
                title =
                    ctrader_companies[current_account.category as keyof TCTraderCompanies][
                        current_account.type as keyof TCTraderCompanies['demo' | 'real']
                    ].title;
                break;
            case CFD_PLATFORMS.DXTRADE:
                title =
                    dxtrade_companies[current_account.category as keyof TDxCompanies][
                        current_account.type as keyof TDxCompanies['demo' | 'real']
                    ].title;
                break;
            default:
                break;
        }

        return title;
    }, [mt5_companies, dxtrade_companies, current_account, ctrader_companies, platform]);

    const onCloseSuccess = () => {
        closeSuccessTopUpModal();
    };

    const has_sub_title = platform === CFD_PLATFORMS.CTRADER;

    const platform_title = getCFDPlatformLabel(platform, has_sub_title);

    if ((!mt5_companies && !dxtrade_companies && !getCTraderCompanies()) || !current_account) return null;
    const { minimum_amount, additional_amount } = getTopUpConfig();

    return (
        <React.Fragment>
            <Modal
                toggleModal={closeTopUpModal}
                is_open={is_top_up_virtual_open}
                className='top-up-virtual'
                title={localize('Fund top up')}
                width='384px'
            >
                <div className='dc-modal__container_top-up-virtual__body'>
                    <Text
                        as='p'
                        align='center'
                        size='xxs'
                        line_height='xs'
                        className='dc-modal__container_top-up-virtual__description'
                        data-testid='dt_top_up_virtual_description'
                    >
                        <Localize
                            i18n_default_text='You can top up your demo account with an additional <0></0> if your balance is <1></1> or less.'
                            components={[
                                <Money
                                    key={0}
                                    amount={additional_amount}
                                    currency={current_account.currency}
                                    show_currency
                                />,
                                <Money
                                    key={1}
                                    amount={minimum_amount}
                                    currency={current_account.currency}
                                    show_currency
                                />,
                            ]}
                        />
                    </Text>
                    <h4 className='dc-modal__container_top-up-virtual--h4'>
                        <Localize
                            i18n_default_text='{{ platform }} {{ account_title }} account'
                            values={{
                                platform: platform_title,
                                account_title: getAccountTitle(),
                            }}
                        />
                    </h4>
                    <div>
                        <Text as='p' align='center' size='xxs'>
                            <Localize i18n_default_text='Current balance' />
                        </Text>
                        <div className='dc-modal__container_top-up-virtual--balance'>
                            <Money
                                amount={current_account.display_balance}
                                currency={current_account.currency}
                                has_sign={(current_account.balance as number) < 0}
                            />
                        </div>
                    </div>
                    <div className='dc-modal__container_top-up-virtual--button'>
                        <Button
                            is_disabled={(current_account.balance as number) > 1000 || is_top_up_virtual_in_progress}
                            type='button'
                            is_loading={is_top_up_virtual_in_progress}
                            onClick={() => topUpVirtual(platform)}
                            primary
                            large
                        >
                            {!is_top_up_virtual_in_progress && (
                                <Localize
                                    i18n_default_text='Top up &nbsp;<0></0>'
                                    components={[
                                        <Money
                                            key={0}
                                            amount={additional_amount}
                                            currency={current_account.currency}
                                            show_currency
                                        />,
                                    ]}
                                />
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
            <SuccessDialog
                is_open={is_top_up_virtual_success}
                toggleModal={onCloseSuccess}
                has_close_icon
                title={localize('Fund top up')}
                icon={<Icon icon='IcCashierWallet' size={128} />}
                heading={
                    <h3 className='cfd-success-topup__heading'>
                        <Localize
                            i18n_default_text='<0></0> has been credited into your {{platform}} {{title}} account.'
                            values={{ platform: platform_title, title: getAccountTitle() }}
                            components={[
                                <Money
                                    key={0}
                                    amount={additional_amount}
                                    currency={current_account.currency}
                                    show_currency
                                />,
                            ]}
                        />
                    </h3>
                }
                message={
                    <div className='cfd-success-topup__description'>
                        <p>
                            <Localize i18n_default_text='New current balance' />
                        </p>
                        <div className='dc-modal__container_top-up-virtual--balance'>
                            <Money amount={current_account.balance} currency={current_account.currency} />
                        </div>
                    </div>
                }
                icon_size='large'
                has_cancel={false}
                has_submit={false}
                width='384px'
            />
        </React.Fragment>
    );
});

export default CFDTopUpDemoModal;

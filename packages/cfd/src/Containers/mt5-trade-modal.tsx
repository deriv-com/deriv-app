import React from 'react';

import { Div100vhContainer, Modal, PageOverlay, UILoader } from '@deriv/components';
import { useIsEnabledNakala } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';

import { CFDDerivNakalaLinkAccount } from './account-nakala-modal/account-nakala-modal';
import CTraderDerivXTradeModal from './ctrader-derivx-trade-modal';
import DMT5TradeModal from './dmt5-trade-modal';
import { TCFDPasswordReset } from './props.types';

type TMT5TradeModalProps = {
    is_eu_user: boolean;
    is_open: boolean;
    onPasswordManager: (
        arg1: string | undefined,
        arg2: string,
        group: TCFDPasswordReset['account_group'],
        arg4: string,
        arg5: string | undefined
    ) => void;
    toggleModal: () => void;
    is_demo: string;
};

const MT5TradeModal = observer(
    ({ is_eu_user, is_open, onPasswordManager, toggleModal, is_demo }: TMT5TradeModalProps) => {
        const { isDesktop } = useDevice();
        const {
            traders_hub,
            common,
            modules: { cfd },
        } = useStore();
        const { is_nakala_banner_visible } = cfd;

        const { show_eu_related_content, combined_cfd_mt5_accounts } = traders_hub;
        const { platform } = common;

        const { mt5_trade_account, dxtrade_tokens, ctrader_tokens, product } = useCfdStore();

        const mt5Account = combined_cfd_mt5_accounts.filter(
            account => account.product === 'standard' && account.action_type !== 'get'
        );

        const { nakalaServerInfo, loginId } = useIsEnabledNakala(mt5Account);

        const CFDTradeModal = () => {
            if (platform === 'mt5') {
                return (
                    <DMT5TradeModal
                        mt5_trade_account={mt5_trade_account}
                        show_eu_related_content={show_eu_related_content}
                        onPasswordManager={onPasswordManager}
                        toggleModal={toggleModal}
                        product={product}
                        is_demo={is_demo}
                    />
                );
            }
            return (
                <CTraderDerivXTradeModal
                    ctrader_derivx_trade_account={mt5_trade_account}
                    is_eu_user={is_eu_user}
                    onPasswordManager={onPasswordManager}
                    toggleModal={toggleModal}
                    is_demo={is_demo}
                    platform={platform}
                    ctrader_tokens={ctrader_tokens}
                    dxtrade_tokens={dxtrade_tokens}
                    is_mobile={!isDesktop}
                />
            );
        };

        return (
            <React.Suspense fallback={<UILoader />}>
                {isDesktop ? (
                    <Modal
                        is_open={is_open}
                        title={is_nakala_banner_visible ? localize('Deriv Nakala') : localize('Trade')}
                        toggleModal={toggleModal}
                        should_header_stick_body={false}
                        width={is_nakala_banner_visible ? '485px' : '600px'}
                        exit_classname='cfd-modal--custom-exit'
                    >
                        {is_nakala_banner_visible ? (
                            <CFDDerivNakalaLinkAccount nakalaInfo={{ loginId, serverName: nakalaServerInfo }} />
                        ) : (
                            <CFDTradeModal />
                        )}
                    </Modal>
                ) : (
                    <PageOverlay
                        is_open={is_open}
                        portal_id='deriv_app'
                        header={is_nakala_banner_visible ? 'Deriv Nakala' : 'Trade'}
                        onClickClose={toggleModal}
                        header_classname='cfd-trade-modal__mobile-title'
                    >
                        <Div100vhContainer className='cfd-trade-modal__mobile-view-wrapper' height_offset='80px'>
                            {is_nakala_banner_visible ? (
                                <CFDDerivNakalaLinkAccount nakalaInfo={{ loginId, serverName: nakalaServerInfo }} />
                            ) : (
                                <CFDTradeModal />
                            )}
                        </Div100vhContainer>
                    </PageOverlay>
                )}
            </React.Suspense>
        );
    }
);

export default MT5TradeModal;

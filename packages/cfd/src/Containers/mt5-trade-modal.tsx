import React from 'react';
import { useDevice } from '@deriv-com/ui';

import { Div100vhContainer, Modal, PageOverlay, UILoader } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';

import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';

import DMT5TradeModal from './dmt5-trade-modal';
import { TCFDPasswordReset } from './props.types';
import CTraderDerivXTradeModal from './ctrader-derivx-trade-modal';

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
        const { traders_hub, common } = useStore();

        const { show_eu_related_content } = traders_hub;
        const { platform } = common;

        const { mt5_trade_account, dxtrade_tokens, ctrader_tokens, product } = useCfdStore();

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
                        title={localize('Trade')}
                        toggleModal={toggleModal}
                        should_header_stick_body={false}
                        width='600px'
                        exit_classname='cfd-modal--custom-exit'
                    >
                        <CFDTradeModal />
                    </Modal>
                ) : (
                    <PageOverlay
                        is_open={is_open}
                        portal_id='deriv_app'
                        header='Trade'
                        onClickClose={toggleModal}
                        header_classname='cfd-trade-modal__mobile-title'
                    >
                        <Div100vhContainer className='cfd-trade-modal__mobile-view-wrapper' height_offset='80px'>
                            <CFDTradeModal />
                        </Div100vhContainer>
                    </PageOverlay>
                )}
            </React.Suspense>
        );
    }
);

export default MT5TradeModal;

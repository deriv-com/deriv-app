import React from 'react';
import { DesktopWrapper, Div100vhContainer, Modal, MobileWrapper, PageOverlay, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import DMT5TradeModal from './dmt5-trade-modal';
import DerivXTradeModal from './derivx-trade-modal';
import { observer, useStore } from '@deriv/stores';
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
};

const MT5TradeModal = ({ is_eu_user, is_open, onPasswordManager, toggleModal }: TMT5TradeModalProps) => {
    const {
        modules: {
            cfd: { dxtrade_tokens, mt5_trade_account },
        },
        traders_hub: { show_eu_related_content, is_demo },
        common: { platform },
    } = useStore();

    const CFDTradeModal = () => {
        if (platform === 'mt5') {
            return (
                <DMT5TradeModal
                    mt5_trade_account={mt5_trade_account}
                    show_eu_related_content={show_eu_related_content}
                    onPasswordManager={onPasswordManager}
                    toggleModal={toggleModal}
                    dxtrade_tokens={dxtrade_tokens}
                />
            );
        }
        return (
            <DerivXTradeModal
                mt5_trade_account={mt5_trade_account}
                is_eu_user={is_eu_user}
                onPasswordManager={onPasswordManager}
                toggleModal={toggleModal}
                dxtrade_tokens={dxtrade_tokens}
                is_demo={is_demo}
            />
        );
    };

    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
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
            </DesktopWrapper>
            <MobileWrapper>
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
            </MobileWrapper>
        </React.Suspense>
    );
};

export default observer(MT5TradeModal);

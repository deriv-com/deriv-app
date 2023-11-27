import React from 'react';
import { useMT5AccountsList, useDxtradeServiceToken, useCtraderServiceToken } from '@deriv/api';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { DesktopWrapper, Div100vhContainer, Modal, MobileWrapper, PageOverlay, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { TCFDPasswordReset } from 'Containers/props.types';
import OtherCFDsTradeModal from './other-cfds-trade-modal';
import MT5TradeModal from './mt5-trade-modal';

type TCFDTradeModalProps = {
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

type TTokens = {
    demo: string;
    real: string;
};

const CFDTradeModal = observer(
    ({ is_eu_user, is_open, onPasswordManager, toggleModal, is_demo }: TCFDTradeModalProps) => {
        const { traders_hub, common, ui } = useStore();

        const { show_eu_related_content } = traders_hub;
        const { platform } = common;
        const { is_mobile } = ui;

        const { data: mt5_trade_account } = useMT5AccountsList();
        const { data: dxtrade_tokens } = useDxtradeServiceToken();
        const { data: ctrader_tokens } = useCtraderServiceToken();

        const CFDTradeModal = () => {
            if (platform === 'mt5') {
                return (
                    <MT5TradeModal
                        mt5_trade_account={mt5_trade_account as unknown as DetailsOfEachMT5Loginid}
                        show_eu_related_content={show_eu_related_content}
                        onPasswordManager={onPasswordManager}
                        toggleModal={toggleModal}
                    />
                );
            }
            return (
                <OtherCFDsTradeModal
                    mt5_trade_account={mt5_trade_account as unknown as Required<DetailsOfEachMT5Loginid>}
                    is_eu_user={is_eu_user}
                    onPasswordManager={onPasswordManager}
                    toggleModal={toggleModal}
                    is_demo={is_demo}
                    platform={platform}
                    ctrader_tokens={ctrader_tokens as unknown as TTokens}
                    dxtrade_tokens={dxtrade_tokens as unknown as TTokens}
                    is_mobile={is_mobile}
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
    }
);

export default CFDTradeModal;

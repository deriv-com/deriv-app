import React from 'react';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

type MarketUnavailableModalProps = {
    disableApp: () => void;
    enableApp: () => void;
    is_loading: boolean;
    is_visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

const MarketUnavailableModal = ({
    disableApp,
    enableApp,
    is_loading,
    is_visible,
    onCancel,
    onConfirm,
}: MarketUnavailableModalProps) => (
    <Dialog
        className='market-unavailable-modal'
        title={localize('We’re working on it')}
        confirm_button_text={localize('Stay on DTrader')}
        cancel_button_text={localize('Go to SmartTrader')}
        onConfirm={onConfirm}
        onCancel={onCancel}
        is_mobile_full_width={false}
        is_visible={is_visible}
        disableApp={disableApp}
        enableApp={enableApp}
        is_loading={is_loading}
    >
        <Localize i18n_default_text='This market is not yet available on DTrader, but it is on SmartTrader.' />
    </Dialog>
);

export default connect(({ ui }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_loading: ui.is_loading,
}))(MarketUnavailableModal);

import React from 'react';
import { Div100vhContainer } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import MT5MigrationFrontSideContent from './mt5-migration-front-side-content';
import MT5MigrationBackSideContent from './mt5-migration-back-side-content';
import { observer, useStore } from '@deriv/stores';

type TMT5MigrationModalProps = {
    show_modal_front_side: boolean;
    setShowModalFrontSide: (show_modal_front_side: boolean) => void;
};

const MT5MigrationModalContent = observer(
    ({ show_modal_front_side, setShowModalFrontSide }: TMT5MigrationModalProps) => {
        const { ui } = useStore();
        const { is_mobile } = ui;
        return (
            <Div100vhContainer
                className='mt5-migration-modal__mobile-container'
                height_offset='150px'
                is_bypassed={!is_mobile}
            >
                {show_modal_front_side ? (
                    <MT5MigrationFrontSideContent setShowModalFrontSide={setShowModalFrontSide} />
                ) : (
                    <MT5MigrationBackSideContent setShowModalFrontSide={setShowModalFrontSide} />
                )}
            </Div100vhContainer>
        );
    }
);

export default MT5MigrationModalContent;

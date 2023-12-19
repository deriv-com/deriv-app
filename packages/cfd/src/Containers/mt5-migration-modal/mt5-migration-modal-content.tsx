import React from 'react';
import { Div100vhContainer } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import MT5MigrationFrontSideContent from './mt5-migration-front-side-content';
/* Temperory commented out these components because the new design is not ready yet */
// import MT5MigrationBackSideContent from './mt5-migration-back-side-content';
// import { useMT5MigrationModalContext } from './mt5-migration-modal-context';

const MT5MigrationModalContent = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    // const { show_modal_front_side } = useMT5MigrationModalContext();
    return (
        <Div100vhContainer
            className='mt5-migration-modal__mobile-container'
            height_offset='150px'
            is_bypassed={!is_mobile}
        >
            <MT5MigrationFrontSideContent />
            {/* {show_modal_front_side ? <MT5MigrationFrontSideContent /> : <MT5MigrationBackSideContent />} */}
        </Div100vhContainer>
    );
});

export default MT5MigrationModalContent;

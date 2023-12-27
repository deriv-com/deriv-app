import React from 'react';
import { Div100vhContainer } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import MT5MigrationFrontSideContent from './mt5-migration-front-side-content';

const MT5MigrationModalContent = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    return (
        <Div100vhContainer
            className='mt5-migration-modal__mobile-container'
            height_offset='150px'
            is_bypassed={!is_mobile}
        >
            <MT5MigrationFrontSideContent />
        </Div100vhContainer>
    );
});

export default MT5MigrationModalContent;

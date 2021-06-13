import React from 'react';
import { Modal, ThemedScrollbars } from '@deriv/components';

const WelcomeModalMF = () => {
    return (
        <Modal width='760px' className='welcome' is_open has_close_icon={false} has_outer_content>
            <ThemedScrollbars height={700}>hi</ThemedScrollbars>
        </Modal>
    );
};

export default WelcomeModalMF;

import React from 'react';
import { Modal, Popover, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

export const ComplaintsPolicy = ({ standpoint }) => {
    const [should_show_modal, showModal] = React.useState(false);

    return (
        <div className='footer__link'>
            <a onClick={() => showModal(true)}>
                <Popover alignment='bottom' message={localize('Complaints policy')}>
                    <Icon icon='IcComplaintsPolicy' className='footer__icon ic-deriv__icon' />
                </Popover>
            </a>
            <Modal
                is_open={should_show_modal}
                small
                has_close_icon
                toggleModal={() => showModal(false)}
                title={localize('Complaints policy')}
            >
                <div>Complaints policy</div>
            </Modal>
        </div>
    );
};

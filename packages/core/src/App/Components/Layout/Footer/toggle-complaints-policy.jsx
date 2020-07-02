import React from 'react';
import { Icon, Modal, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { makeLazyLoader } from '_common/lazy-load';

const ComplaintsPolicyContent = makeLazyLoader(() =>
    import(
        /* webpackChunkName: "complaints-policy-content" */ 'Modules/ComplaintsPolicy/Components/complaints-policy-content.jsx'
    )
)();

const ToggleComplaintsPolicy = ({ landing_company_shortcode } = {}) => {
    const [is_modal_visible, setModalVisibility] = React.useState(false);

    if (!landing_company_shortcode) return null;

    return (
        <React.Fragment>
            <Popover className='footer__link' alignment='top' message={localize('Complaints policy')}>
                <a id='dt_complaints-policy_toggle' onClick={() => setModalVisibility(true)}>
                    <Icon icon='IcComplaintsPolicy' className='footer__icon' />
                </a>
            </Popover>
            <Modal
                id='dt_complaints-policy_modal'
                className='complaints-policy'
                is_open={is_modal_visible}
                title={localize('Complaints policy')}
                toggleModal={() => setModalVisibility(false)}
            >
                <ComplaintsPolicyContent />
            </Modal>
        </React.Fragment>
    );
};

export { ToggleComplaintsPolicy };

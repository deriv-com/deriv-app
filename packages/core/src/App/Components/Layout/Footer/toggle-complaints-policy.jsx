import React from 'react';
import Loadable from 'react-loadable';
import { Icon, Modal, Popover, Loading } from '@deriv/components';
import { localize } from '@deriv/translations';

const handleLoading = props => {
    // 200ms default
    if (props.pastDelay) {
        return <Loading />;
    }
    return null;
};

const lazyLoadComplaintsPolicyContent = () => {
    return Loadable.Map({
        loader: {
            ComplaintsPolicyContent: () =>
                import(
                    /* webpackChunkName: "complaints-policy-content" */ 'Modules/ComplaintsPolicy/Components/complaints-policy-content.jsx'
                ),
        },
        render(loaded, props) {
            const ComplaintsPolicyContentLazy = loaded.ComplaintsPolicyContent.default;
            return <ComplaintsPolicyContentLazy {...props} />;
        },
        loading: handleLoading,
    });
};

const ComplaintsPolicyContent = lazyLoadComplaintsPolicyContent();

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
                height='616px'
                width='904px'
            >
                <ComplaintsPolicyContent />
            </Modal>
        </React.Fragment>
    );
};

export { ToggleComplaintsPolicy };

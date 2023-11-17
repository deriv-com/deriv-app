import React from 'react';
import { Div100vhContainer } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import ProofOfAddressContainer from '@deriv/account/src/Sections/Verification/ProofOfAddress/proof-of-address-container';
import ProofOfIdentityContainer from '@deriv/account/src/Sections/Verification/ProofOfIdentity/proof-of-identity-container';
import { observer, useStore } from '@deriv/stores';

type TVerificationModalContent = {
    onFinish: () => void;
};

type TItemsState = {
    body: typeof ProofOfIdentityContainer | typeof ProofOfAddressContainer;
};

const VerificationModalContent = observer((props: TVerificationModalContent) => {
    const [step, setStep] = React.useState(0);
    const [form_error, setFormError] = React.useState('');
    const state_index = step;
    let is_mounted = React.useRef(true).current;

    const { client, notifications } = useStore();

    const { authentication_status, fetchStatesList } = client;
    const { refreshNotifications } = notifications;

    const poi_config: TItemsState = {
        body: ProofOfIdentityContainer,
    };

    const poa_config: TItemsState = {
        body: ProofOfAddressContainer,
    };

    const should_show_poi = !['pending', 'verified'].includes(authentication_status.identity_status);
    const should_show_poa = !['pending', 'verified'].includes(authentication_status.document_status);

    const verification_configs = [...(should_show_poi ? [poi_config] : []), ...(should_show_poa ? [poa_config] : [])];

    const [items, setItems] = React.useState<TItemsState[]>(verification_configs);

    const clearError = () => {
        setFormError('');
    };

    React.useEffect(() => {
        refreshNotifications();
    }, [items, refreshNotifications]);

    React.useEffect(() => {
        fetchStatesList();
    }, [fetchStatesList]);

    const unmount = () => {
        is_mounted = false;
        props.onFinish();
    };

    const saveFormData = () => {
        if (!is_mounted) return; // avoiding state update on unmounted component
        const cloned_items: TItemsState[] = [...items];
        setItems(cloned_items);
    };

    const nextStep = () => {
        clearError();
        if (step + 1 < items.length) {
            saveFormData();
            setStep(step + 1);
        } else unmount();
    };

    const prevStep = () => {
        if (step - 1 >= 0) {
            setStep(step - 1);
            setFormError('');
        } else unmount();
    };

    const getCurrent = (key?: keyof TItemsState) => {
        return key ? items[state_index][key] : items[state_index];
    };

    const onStateChange = () => {
        saveFormData();
        nextStep();
    };

    const BodyComponent = getCurrent('body');

    return (
        <Div100vhContainer
            className='proof-of-identity'
            id='verification_modal_content'
            is_disabled={isDesktop()}
            height_offset='40px'
        >
            <div className='proof-of-identity__main-container' data-testid='dt_verification_modal_body'>
                <BodyComponent
                    index={state_index}
                    onSubmit={nextStep}
                    onStateChange={onStateChange}
                    height='auto'
                    onCancel={prevStep}
                    onSave={saveFormData}
                    form_error={form_error}
                />
            </div>
        </Div100vhContainer>
    );
});

export default VerificationModalContent;

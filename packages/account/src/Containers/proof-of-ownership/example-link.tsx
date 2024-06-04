import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import SampleCreditCardModal from '../../Components/sample-credit-card-modal';

/**
 * Renders Text with link to Example Credit card modal
 * @name ExampleLink
 * @returns React Component
 */
const ExampleLink = () => {
    const [is_sample_modal_open, setIsSampleModalOpen] = React.useState(false);

    return (
        <React.Fragment>
            <Text className='proof-of-ownership__card-open-desc-link' onClick={() => setIsSampleModalOpen(true)}>
                <Localize i18n_default_text='See example' />
            </Text>
            <SampleCreditCardModal
                is_open={is_sample_modal_open}
                onClose={() => {
                    setIsSampleModalOpen(false);
                }}
            />
        </React.Fragment>
    );
};

export default ExampleLink;

import React from 'react';
import { FormikValues } from 'formik/dist/types';
import ProofOfAddressForm from '@deriv/account/src/Sections/Verification/ProofOfAddress/proof-of-address-form';
import IconMessageContent from '@deriv/account/src/Components/icon-message-content';
import { Localize } from '@deriv/translations';
import { Button, Text, Icon } from '@deriv/components';

type TCFDPOA = {
    index: number;
    onSave: (index: number, values: FormikValues) => void;
    onSubmit: (index: number, values: FormikValues) => void;
};

const CFDPOA = ({ index, onSave, onSubmit }: TCFDPOA) => {
    const [has_submitted_duplicate_poa, setHasSubmittedDuplicatePOA] = React.useState(false);
    const onSubmitForCFDModal = (values: FormikValues, has_submitted_duplicate_poa = false) => {
        if (has_submitted_duplicate_poa) {
            setHasSubmittedDuplicatePOA(has_submitted_duplicate_poa);
        } else {
            onSave(index, values);
            onSubmit(index, values);
        }
    };

    return (
        <React.Fragment>
            {has_submitted_duplicate_poa ? (
                <IconMessageContent
                    message={<Localize i18n_default_text='We could not verify your proof of address' />}
                    text={<Localize i18n_default_text='Proof of address documents upload failed' />}
                    icon={<Icon icon='IcPoaError' size={128} />}
                >
                    <Button
                        onClick={() => setHasSubmittedDuplicatePOA(false)}
                        has_effect
                        primary
                        large
                        className='upload_error_btn'
                    >
                        <Text className='dc-btn__text' size='xs' weight='bold' as='p'>
                            <Localize i18n_default_text='Try again' />
                        </Text>
                    </Button>
                </IconMessageContent>
            ) : (
                <div className='cfd-proof-of-address'>
                    <ProofOfAddressForm
                        is_for_cfd_modal
                        onSubmitForCFDModal={onSubmitForCFDModal}
                        className='cfd-proof-of-address__form'
                    />
                </div>
            )}
        </React.Fragment>
    );
};

export default CFDPOA;

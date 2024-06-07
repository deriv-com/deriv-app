import React from 'react';
import { FormikValues } from 'formik/dist/types';
import ProofOfAddressForm from '@deriv/account/src/Sections/Verification/ProofOfAddress/proof-of-address-form';
import { IconMessageContent } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TCFDPOA = {
    index: number;
    onSave: (index: number, values: FormikValues) => void;
    onSubmit: (index: number, values: FormikValues) => void;
};

const CFDPOA = ({ index, onSave, onSubmit }: TCFDPOA) => {
    const [has_submitted_duplicate_poa, setHasSubmittedDuplicatePOA] = React.useState(false);
    const onSubmitForCFDModal = (index: number, values: FormikValues, has_submitted_duplicate_poa = false) => {
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
                    title=<Localize i18n_default_text='Proof of address documents upload failed' />
                    description=<Localize i18n_default_text='It seems you’ve submitted this document before. Upload a new document.' />
                    button_text=<Localize i18n_default_text='Try again' />
                    onClick={() => setHasSubmittedDuplicatePOA(false)}
                />
            ) : (
                <div className='cfd-proof-of-address'>
                    <ProofOfAddressForm
                        step_index={index}
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

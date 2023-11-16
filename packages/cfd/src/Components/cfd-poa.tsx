import React from 'react';
import { FormikValues } from 'formik/dist/types';
import ProofOfAddressForm from '@deriv/account/src/Sections/Verification/ProofOfAddress/proof-of-address-form';

type TCFDPOA = {
    index: number;
    onSave: (index: number, values: FormikValues) => void;
    onSubmit: (index: number, values: FormikValues) => void;
};

const CFDPOA = ({ index, onSave, onSubmit }: TCFDPOA) => {
    const onSubmitForCFDModal = (index: number, values: FormikValues) => {
        onSave(index, values);
        onSubmit(index, values);
    };

    return (
        <div className='cfd-proof-of-address'>
            <ProofOfAddressForm
                step_index={index}
                is_for_cfd_modal
                onSubmitForCFDModal={onSubmitForCFDModal}
                className='cfd-proof-of-address__form'
            />
        </div>
    );
};

export default CFDPOA;

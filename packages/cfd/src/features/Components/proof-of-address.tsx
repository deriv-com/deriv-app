import React from 'react';
import { FormikValues } from 'formik/dist/types';
import ProofOfAddressForm from '@deriv/account/src/Sections/Verification/ProofOfAddress/proof-of-address-form';

type TProofOfAddress = {
    index: number;
    onSave: (index: number, values: FormikValues) => void;
    onSubmit: (index: number, values: FormikValues) => void;
};

const ProofOfAddress = ({ index, onSave, onSubmit }: TProofOfAddress) => {
    const onSubmitForCFDModal = (index: number, values: FormikValues) => {
        onSave(index, values);
        onSubmit(index, values);
    };

    return (
        <div className='cfd-proof-of-address'>
            <ProofOfAddressForm step_index={index} is_for_cfd_modal onSubmitForCFDModal={onSubmitForCFDModal} />
        </div>
    );
};

export default ProofOfAddress;

import React from 'react';
import ProofOfAddressForm from '@deriv/account/src/Sections/Verification/ProofOfAddress/proof-of-address-form';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';
import { observer } from '@deriv/stores';
import { FormikValues } from 'formik/dist/types';

type TCFDPOA = {
    index: number;
    onSave: (index: number, values: FormikValues) => void;
    onSubmit: (index: number, values: FormikValues) => void;
};

const CFDPOA = observer(({ index, onSave, onSubmit }: TCFDPOA) => {
    const { toggleJurisdictionModal, toggleCFDVerificationModal } = useCfdStore();

    const onBack = () => {
        toggleCFDVerificationModal();
        toggleJurisdictionModal();
    };

    const onSubmitForCFDModal = (index: number, values: FormikValues) => {
        onSave(index, values);
        onSubmit(index, values);
    };

    return (
        <div className='cfd-proof-of-address'>
            <ProofOfAddressForm
                step_index={index}
                is_for_cfd_modal
                onCancel={onBack}
                onSubmitForCFDModal={onSubmitForCFDModal}
            />
        </div>
    );
});

export default CFDPOA;

import React from 'react';
import { FormikValues } from 'formik/dist/types';
import ProofOfAddressForm from '@deriv/account/src/Sections/Verification/ProofOfAddress/proof-of-address-form';
import { observer } from '@deriv/stores';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';

type TCFDPOA = {
    index: number;
    onSave: (index: number, values: FormikValues) => void;
    onSubmit: (index: number, values: FormikValues) => void;
};

const CFDPOA = observer(({ index, onSave, onSubmit }: TCFDPOA) => {
    const {
        is_for_cfd_modal_poa,
        setIsForCFDModalPOA,
        toggleJurisdictionModal,
        toggleCFDVerificationModal,
        toggleCompareAccountsModal,
    } = useCfdStore();

    const setIsNotForCFDModal = () => {
        setIsForCFDModalPOA({ is_for_compare_accounts: false, is_for_account_signup: false });
    };

    const onBack = () => {
        toggleCFDVerificationModal();
        if (is_for_cfd_modal_poa?.is_for_account_signup) {
            toggleJurisdictionModal();
        } else if (is_for_cfd_modal_poa?.is_for_compare_accounts) {
            toggleCompareAccountsModal();
        }
        setIsNotForCFDModal();
    };

    const onSubmitForCFDModal = (index: number, values: FormikValues) => {
        onSave(index, values);
        onSubmit(index, values);
        setIsNotForCFDModal();
    };

    return (
        <div className='cfd-proof-of-address'>
            <ProofOfAddressForm
                step_index={index}
                is_for_cfd_modal_poa={is_for_cfd_modal_poa}
                onCancel={onBack}
                onSubmitForCFDModal={onSubmitForCFDModal}
            />
        </div>
    );
});

export default CFDPOA;

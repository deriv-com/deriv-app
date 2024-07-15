import React, { useMemo } from 'react';
import { Formik } from 'formik';
import { useDocumentUpload, useInvalidateQuery, useSettings, useStatesList } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { ModalStepWrapper, WalletButton } from '../../../../components';
import { AddressSection, DocumentSubmission } from './components';
import { poaValidationSchema } from './poaValidationSchema';
import { TAddressDetails, TPoaDocument } from './types';
import './Poa.scss';

type TPoaProps = {
    onCompletion?: () => void;
};
type TPoaValues = TAddressDetails & TPoaDocument;

const Poa: React.FC<TPoaProps> = ({ onCompletion }) => {
    const {
        data: settings,
        isLoading: isSettingsLoading,
        isSuccess: isSettingsUpdateSuccess,
        update: updateSettings,
    } = useSettings();
    const country = settings?.country_code ?? '';
    const { data: statesList, isLoading: isStatesListLoading } = useStatesList(country);
    const {
        isLoading: isDocumentUploading,
        isSuccess: isDocumentUploadSuccess,
        upload: documentUpload,
    } = useDocumentUpload();
    const invalidate = useInvalidateQuery();

    const initialValues = useMemo(
        () => ({
            firstLine: settings.address_line_1,
            poaDocument: undefined,
            secondLine: settings.address_line_2,
            stateProvinceLine: settings.address_state,
            townCityLine: settings.address_city,
            zipCodeLine: settings.address_postcode,
        }),
        [
            settings.address_city,
            settings.address_line_1,
            settings.address_line_2,
            settings.address_postcode,
            settings.address_state,
        ]
    );

    const initalStatus = useMemo(
        () => ({
            statesList,
        }),
        [statesList]
    );

    const onSubmit = (values: TPoaValues) => {
        const isFormDirty =
            values.firstLine !== settings.address_line_1 ||
            values.secondLine !== settings.address_line_2 ||
            values.stateProvinceLine !== settings.address_state ||
            values.townCityLine !== settings.address_city ||
            values.zipCodeLine !== settings.address_postcode;

        const isDocumentSelected = values.poaDocument;

        if (isFormDirty) {
            // update address details using set_settings
            updateSettings({
                address_city: values.townCityLine,
                address_line_1: values.firstLine,
                address_line_2: values.secondLine,
                address_postcode: values.zipCodeLine,
                address_state: values.stateProvinceLine,
            });
        }

        if (isDocumentSelected) {
            // upload POA document using document_upload
            documentUpload({
                document_issuing_country: settings?.country_code ?? undefined,
                document_type: 'proofaddress',
                file: values.poaDocument,
            });
        }
    };

    const Footer = ({ disabled, handleSubmit }: { disabled: boolean; handleSubmit: () => void }) => {
        return (
            <WalletButton disabled={disabled} onClick={handleSubmit}>
                Next
            </WalletButton>
        );
    };

    if (isDocumentUploading || isSettingsLoading || isStatesListLoading) return <Loader />;

    if (isDocumentUploadSuccess && isSettingsUpdateSuccess) {
        invalidate('get_settings');
    }

    return (
        <Formik
            initialStatus={initalStatus}
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={poaValidationSchema}
        >
            {({ handleSubmit, isValid }) => {
                return (
                    <ModalStepWrapper
                        renderFooter={() => <Footer disabled={!isValid} handleSubmit={handleSubmit} />}
                        title='Add a real MT5 account'
                    >
                        <div className='wallets-poa'>
                            <AddressSection />
                            <DocumentSubmission />
                        </div>
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default Poa;

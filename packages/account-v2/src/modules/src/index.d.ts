/* eslint-disable one-var */
import React from 'react';
import type { TSupportedDocuments } from '../../types';

type TManualForm = {
    document_expiry: string;
    document_number: string;
};

type TManualDocumentTypes = 'driving_licence' | 'national_identity_card' | 'nimc_slip' | 'passport';

type TManualFormProps = {
    onSubmit: (values: TManualForm) => void;
    selectedDocument: TManualDocumentTypes;
};

type TIDVFormProps = {
    allowDefaultValue?: boolean;
    allowIDVSkip?: boolean;
    countryCode: string;
    supportedDocuments: TSupportedDocuments;
};

type TOnfidoContainer = {
    countryCode?: string;
    isEnabledByDefault?: boolean;
    onOnfidoSubmit?: () => void;
    selectedDocument?: TManualDocumentTypes;
};

export declare const ManualForm: ({ onSubmit, selectedDocument }: TManualFormProps) => React.JSX.Element;

export declare const POAFormContainer: () => React.JSX.Element | null;

export declare const IDVForm: (props: TIDVFormProps) => React.JSX.Element;

export declare const AddressFields: () => React.JSX.Element;

export declare const IDVService: () => React.JSX.Element;

export declare const OnfidoContainer: (props: TOnfidoContainer) => React.JSX.Element;

export {};

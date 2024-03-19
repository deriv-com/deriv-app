/* eslint-disable one-var */
import React from 'react';
import { useResidenceList } from '@deriv/api-v2';

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
    allowIDVSkip?: boolean;
    selectedCountry: Exclude<
        NonNullable<NonNullable<ReturnType<typeof useResidenceList>['data'][0]['identity']>['services']>['idv'],
        undefined
    >;
};

export declare const ManualForm: ({ onSubmit, selectedDocument }: TManualFormProps) => React.JSX.Element;

export declare const POAFormContainer: () => React.JSX.Element | null;

export declare const IDVForm: ({ allowIDVSkip, selectedCountry }: TIDVFormProps) => React.JSX.Element;

export declare const AddressFields: () => React.JSX.Element;

export declare const DummyComponent: () => React.JSX.Element;

export {};

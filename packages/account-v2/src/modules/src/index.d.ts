import { useKycAuthStatus } from '@deriv/api-v2';

export type TSupportedDocuments = Exclude<
    Exclude<ReturnType<typeof useKycAuthStatus>['kyc_auth_status'], undefined>['identity']['supported_documents'],
    undefined
>['idv'];

type TManualDocumentTypes = 'driving_licence' | 'national_identity_card' | 'nimc_slip' | 'passport';

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

declare const ManualUpload: ({ countryCode }: { countryCode: string }) => JSX.Element,
    POAFormContainer: () => JSX.Element | null,
    IDVForm: (props: TIDVFormProps) => JSX.Element,
    AddressFields: () => JSX.Element,
    IDVService: () => JSX.Element,
    OnfidoContainer: (props: TOnfidoContainer) => JSX.Element,
    FinancialAssessmentFields: () => JSX.Element;

export {
    AddressFields,
    FinancialAssessmentFields,
    IDVForm,
    IDVService,
    ManualUpload,
    OnfidoContainer,
    POAFormContainer,
};

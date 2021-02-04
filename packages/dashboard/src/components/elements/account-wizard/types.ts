import { GetSettings } from '@deriv/api-types';

export type TWizardItemConfig = {
    header: {
        active_title: string;
        title: string;
    };
    body: React.FC<any>;
    form_value?: {
        [x: string]: unknown;
    };
    props: {
        validate?: () => boolean;
        [x: string]: unknown;
    };
    passthrough: string[];
    icon?: string;
};

export type TAccountWizard = {
    fetchResidenceList?: () => void;
    fetchStatesList?: () => void;
    fetchFinancialAssessment?: () => void;
    needs_financial_assessment?: () => boolean;
    has_currency?: () => boolean;
    has_real_account?: () => boolean;
    account_settings?: GetSettings;
    onCancel: () => void;
    real_account_signup_target: string;
    has_wallet_account: boolean;
    [x: string]: any;
};

import { FormikValues } from 'formik';
import * as React from 'react';

export type TSelfExclusionContext = {
    handleSubmit: () => void;
    is_app_settings?: boolean;
    is_wrapper_bypassed?: boolean;
    toggleArticle?: () => void;
    backFromConfirmLimits?: () => void;
    currency: string;
    currency_display?: string;
    exclusion_texts?: Record<string, string>;
    is_eu?: boolean;
    is_uk?: boolean;
    state?: FormikValues;
    overlay_ref: HTMLDivElement;
    validateFields?: () => void;
    getMaxLength?: (value: string) => void;
    is_mlt?: boolean;
    is_mx?: boolean;
    is_mf?: boolean;
    is_tablet?: boolean;
    footer_ref?: React.RefObject<HTMLElement>;
    session_duration_digits?: boolean;
    goToConfirm?: (value: FormikValues) => void;
    is_appstore?: boolean;
};

const SelfExclusionContext = React.createContext<TSelfExclusionContext>({
    overlay_ref: document.createElement('div'),
    currency: '',
    handleSubmit: () => null,
});

export default SelfExclusionContext;

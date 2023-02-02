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
};

const SelfExclusionContext = React.createContext<TSelfExclusionContext>({
    overlay_ref: document.createElement('div'),
    currency: '',
    handleSubmit: () => null,
});

export default SelfExclusionContext;

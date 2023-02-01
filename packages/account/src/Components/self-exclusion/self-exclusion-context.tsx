import { FormikValues } from 'formik';
import * as React from 'react';

export type TSelfExclusionContext = {
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
};

const SelfExclusionContext = React.createContext<TSelfExclusionContext>({
    overlay_ref: document.createElement('div'),
    currency: '',
});

export default SelfExclusionContext;

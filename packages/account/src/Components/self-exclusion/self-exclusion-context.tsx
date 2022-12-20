import { FormikValues } from 'formik';
import * as React from 'react';

type TSelfExclusionContext = {
    footer_ref?: React.RefObject<HTMLElement>;
    goToConfirm?: () => void;
    toggleArticle?: () => void;
    is_app_settings?: boolean;
    is_wrapper_bypassed?: boolean;
    is_eu?: boolean;
    is_uk?: boolean;
    backToReview?: () => void;
    backFromConfirmLimits?: () => void;
    currency?: string;
    currency_display?: string;
    exclusion_texts?: string;
    state?: FormikValues;
};

const SelfExclusionContext = React.createContext<TSelfExclusionContext>({});

export default SelfExclusionContext;

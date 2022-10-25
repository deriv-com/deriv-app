import React from 'react';

export type TMultiStepRefProps = {
    // TODO: Remove the type defined in MT5 and reference this one instead
    goNextStep: () => void;
    goPrevStep: () => void;
};

export type TMultiStepProps = {
    className?: string;
    lbl_previous?: string;
    steps: Array<{ component: React.ReactElement }>;
};

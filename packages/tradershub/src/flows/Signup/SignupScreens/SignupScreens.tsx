import React, { Dispatch } from 'react';
import { CitizenshipModal } from '../CitizenshipModal';
import { PasswordSettingModal } from '../PasswordSettingModal';

type TSignupScreens = {
    setStep: Dispatch<React.SetStateAction<number>>;
    step: number;
};

const SignupScreens = ({ step, setStep }: TSignupScreens) => {
    switch (step) {
        case 1:
            return <CitizenshipModal onClickNext={() => setStep(prev => prev + 1)} />;
        case 2:
            return <PasswordSettingModal />;
        default:
            return null;
    }
};

export default SignupScreens;

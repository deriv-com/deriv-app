import React, { Dispatch } from 'react';
import { CitizenshipModal } from '../CitizenshipModal';

type TSignupScreens = {
    setStep: Dispatch<React.SetStateAction<number>>;
    step: number;
};

const SignupScreens = ({ step, setStep }: TSignupScreens) => {
    switch (step) {
        case 1:
            return <CitizenshipModal onClickNext={() => setStep(prev => prev + 1)} />;
        case 2:
            return (
                <div className='max-w-[328px] lg:max-w-[440px] bg-system-light-primary-background rounded-default p-16 space-y-16 lg:space-y-24 lg:p-24'>
                    Screen 2
                </div>
            );
        default:
            return null;
    }
};

export default SignupScreens;

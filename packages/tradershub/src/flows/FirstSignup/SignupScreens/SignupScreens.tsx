import React, { Dispatch } from 'react';
import { Modal } from '@/components';
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
                <Modal className='max-w-[328px] lg:max-w-[440px]'>
                    <Modal.Content className='p-16 lg:p-24'>Screen 2</Modal.Content>
                </Modal>
            );
        default:
            return null;
    }
};

export default SignupScreens;

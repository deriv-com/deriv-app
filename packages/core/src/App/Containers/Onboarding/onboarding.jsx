import React from 'react';
import { connect } from 'Stores/connect';
import Platforms from './platforms.jsx';
import AccountSignup from './account-signup.jsx';
import Welcome from './welcome.jsx';

const Onboarding = ({ should_show_cr_onboarding }) => {
    const [step, setStep] = React.useState('signup');

    return (
        <>
            {step === 'signup' && <AccountSignup onNext={() => setStep('welcome')} />}
            {step === 'welcome' && should_show_cr_onboarding && <Welcome onNext={() => setStep('platforms')} />}
            {step === 'platforms' && <Platforms />}
        </>
    );
};

export default connect(({ client }) => ({
    should_show_cr_onboarding: client.should_show_cr_onboarding,
}))(Onboarding);

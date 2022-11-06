import React from 'react';
import { localize } from '@deriv/translations';
import { isMobile, isDesktop, routes, PlatformContext } from '@deriv/shared';
import { Button, Text, Icon, ProgressBarOnboarding } from '@deriv/components';
import WalletIcon from 'Assets/svgs/wallet';
import { trading_hub_contents } from 'Constants/trading-hub-content';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';

type TOnboardingProps = {
    contents: Record<
        string,
        {
            component: React.ReactNode;
            footer_header: string;
            footer_text: string;
            next_content?: string;
            has_next_content: boolean;
        }
    >;
};

const Onboarding = ({ contents = trading_hub_contents }: TOnboardingProps) => {
    const history = useHistory();
    const number_of_steps = Object.keys(contents);
    const { tradinghub } = useStores();
    const { toggleIsTourOpen } = tradinghub;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // TODO: remove this after PlatformContext is converted to TS
    const { setIsPreAppStore } = React.useContext(PlatformContext);
    const [step, setStep] = React.useState<number>(1);

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const nextStep = () => {
        if (step < number_of_steps.length) setStep(step + 1);
        if (step === number_of_steps.length) {
            history.push(routes.trading_hub);
            setIsPreAppStore(true);
            toggleIsTourOpen(true);
        }
    };

    const onboarding_step = number_of_steps[step - 1];

    return (
        <div className='onboarding-wrapper'>
            <div className='onboarding-header'>
                <WalletIcon icon={'DerivLogo'} />
                <Icon
                    icon='IcCross'
                    custom_color='var(--general-main-1)'
                    className='onboarding-header__cross-icon'
                    onClick={() => {
                        toggleIsTourOpen(false);
                        history.push(routes.trading_hub);
                    }}
                />
            </div>
            <div className='onboarding-body'>
                <Text as='h2' weight='bold' align='center' color='white'>
                    {contents[onboarding_step]?.component}
                </Text>
            </div>
            <div className='onboarding-footer'>
                <div className='onboarding-footer-wrapper'>
                    <Text as='h2' weight='bold' size='sm' align='center' className='onboarding-footer-header'>
                        {contents[onboarding_step]?.footer_header}
                    </Text>
                    <Text as='p' size='xs' align='center' className='onboarding-footer-text'>
                        {contents[onboarding_step]?.footer_text}
                    </Text>
                    {isDesktop() && (
                        <div className='onboarding-footer-buttons'>
                            <Button secondary onClick={prevStep} style={step === 1 ? { visibility: 'hidden' } : {}}>
                                {localize('Back')}
                            </Button>
                            <ProgressBarOnboarding step={step} amount_of_steps={number_of_steps} setStep={setStep} />
                            <Button primary onClick={nextStep} className='onboarding-footer-buttons--full-size'>
                                {contents[onboarding_step]?.has_next_content
                                    ? contents[onboarding_step]?.next_content
                                    : localize('Next')}
                            </Button>
                        </div>
                    )}
                    {isMobile() && (
                        <React.Fragment>
                            <div className='onboarding-footer__progress-bar'>
                                <ProgressBarOnboarding
                                    step={step}
                                    amount_of_steps={number_of_steps}
                                    setStep={setStep}
                                />
                            </div>
                            <div
                                className='onboarding-footer-buttons'
                                style={step === 1 ? { justifyContent: 'start' } : {}}
                            >
                                <Button
                                    secondary
                                    className={step !== 1 ? 'onboarding-footer-buttons--mobile' : ''}
                                    onClick={prevStep}
                                    style={step === 1 ? { display: 'none' } : {}}
                                >
                                    {localize('Back')}
                                </Button>
                                <Button
                                    primary
                                    onClick={nextStep}
                                    className={
                                        step === 1
                                            ? 'onboarding-footer-buttons--full-size'
                                            : 'onboarding-footer-buttons--mobile'
                                    }
                                >
                                    {contents[onboarding_step]?.has_next_content
                                        ? contents[onboarding_step]?.next_content
                                        : localize('Next')}
                                </Button>
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    );
};

export default observer(Onboarding);

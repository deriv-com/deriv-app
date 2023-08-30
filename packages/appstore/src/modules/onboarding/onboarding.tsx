import React from 'react';
import { localize } from '@deriv/translations';
import { isDesktop, routes, ContentFlag } from '@deriv/shared';
import { Button, Text, Icon, ProgressBarOnboarding } from '@deriv/components';
import TradingPlatformIconProps from 'Assets/svgs/trading-platform';
import { getTradingHubContents } from 'Constants/trading-hub-content';
import { useHistory } from 'react-router-dom';
import EmptyOnboarding from './empty-onboarding';
import { useStore, observer } from '@deriv/stores';

type TOnboardingProps = {
    contents: Record<
        string,
        {
            component: React.ReactNode;
            eu_footer_header?: string;
            footer_header: string;
            eu_footer_text?: string;
            footer_text: string;
            next_content?: string;
            has_next_content: boolean;
        }
    >;
};

const Onboarding = observer(({ contents = getTradingHubContents() }: TOnboardingProps) => {
    const history = useHistory();
    const number_of_steps = Object.keys(contents);
    const { traders_hub, client, ui } = useStore();
    const { is_eu_country, is_landing_company_loaded, is_logged_in, prev_account_type, setPrevAccountType } = client;
    const { is_mobile } = ui;
    const { content_flag, is_demo_low_risk, selectAccountType, toggleIsTourOpen } = traders_hub;
    const [step, setStep] = React.useState<number>(1);

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const nextStep = () => {
        if (step < number_of_steps.length) setStep(step + 1);
        if (step === number_of_steps.length) {
            toggleIsTourOpen(true);
            history.push(routes.traders_hub);
            if (is_demo_low_risk) {
                selectAccountType('real');
                setPrevAccountType('demo');
            }
        }
    };

    const handleCloseButton = async () => {
        toggleIsTourOpen(false);
        history.push(routes.traders_hub);
        await selectAccountType(prev_account_type);
    };

    const eu_user =
        content_flag === ContentFlag.LOW_RISK_CR_EU ||
        content_flag === ContentFlag.EU_REAL ||
        content_flag === ContentFlag.EU_DEMO;

    const is_eu_user = (is_logged_in && eu_user) || (!is_logged_in && is_eu_country);
    const onboarding_step = number_of_steps[step - 1];

    const footer_header = contents[onboarding_step]?.footer_header;
    const footer_text = contents[onboarding_step]?.footer_text;

    const eu_footer_header = contents[onboarding_step]?.eu_footer_header || footer_header;
    const eu_footer_text = contents[onboarding_step]?.eu_footer_text || footer_text;

    const footer_header_text = is_eu_user ? eu_footer_header : footer_header;

    const footer_description = is_eu_user ? eu_footer_text : footer_text;

    if (!is_logged_in || !is_landing_company_loaded) {
        return <EmptyOnboarding />;
    }

    return (
        <div className='onboarding-wrapper'>
            <div className='onboarding-header'>
                <div className='onboarding-header--deriv-logo'>
                    <TradingPlatformIconProps icon='DerivLogo' />
                </div>
                <Icon
                    icon='IcCross'
                    custom_color='var(--text-general)'
                    className='onboarding-header__cross-icon'
                    onClick={handleCloseButton}
                />
            </div>
            <div className='onboarding-body'>
                <div>{contents[onboarding_step]?.component}</div>
            </div>
            <div className='onboarding-footer'>
                <div className='onboarding-footer-wrapper'>
                    <div className='onboarding-footer-description'>
                        <Text
                            as='h2'
                            weight='bold'
                            size={is_mobile ? 's' : 'sm'}
                            align='center'
                            className='onboarding-footer-description__header'
                        >
                            {footer_header_text}
                        </Text>
                        <Text
                            as='p'
                            size={is_mobile ? 'xxs' : 'xs'}
                            align='center'
                            className='onboarding-footer-description__text'
                        >
                            {footer_description}
                        </Text>
                    </div>
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
                    {is_mobile && (
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
});

export default Onboarding;

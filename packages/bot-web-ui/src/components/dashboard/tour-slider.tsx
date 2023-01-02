import React from 'react';
import { ProgressBarOnboarding, Text, Accordion } from '@deriv/components';
import { localize } from '@deriv/translations';
import { BOT_BUILDER_MOBILE } from './joyride-config';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import classNames from 'classnames';

type TTourButton = {
    children?: React.ReactNode;
    type?: string;
    onClick: () => void;
};

type TTourSlider = {
    setOnBoardTourRunState: (param: boolean) => void;
    setTourActive: (param: boolean) => void;
    setTourDialogVisibility: (param: boolean) => void;
    setHasTourEnded: (param: boolean) => void;
    has_started_onboarding_tour: boolean;
};

const TourButton = ({ children, type = '', ...props }: TTourButton) => {
    return (
        <button className={type} {...props}>
            <Text align='center' weight='bold' as='span' line_height='s' size='xs'>
                {children}
            </Text>
        </button>
    );
};

const TourSlider = ({
    setOnBoardTourRunState,
    setTourActive,
    setTourDialogVisibility,
    setHasTourEnded,
    has_started_onboarding_tour,
}: TTourSlider) => {
    const [step, setStep] = React.useState<number>(1);
    const [slider_content, setContent] = React.useState<string>('');
    const [slider_header, setheader] = React.useState<string>('');
    const [slider_image, setimg] = React.useState<string>('');

    const onCloseTour = () => {
        setOnBoardTourRunState(false);
        setTourActive(false);
    };

    const onTourEnd = () => {
        if (step === 7) {
            onCloseTour();
            setHasTourEnded(true);
            setTourDialogVisibility(true);
        }
    };

    const onChange = (param: string) => {
        if (param === 'inc' && step < Object.keys(BOT_BUILDER_MOBILE).length) setStep(step + 1);
        else if (param === 'dec' && step > 1) setStep(step - 1);
    };

    return (
        <>
            <div
                className={classNames('dbot-slider', {
                    'dbot-slider__bot-builder-tour': !has_started_onboarding_tour,
                })}
            >
                {has_started_onboarding_tour && (
                    <div className='dbot-slider__navbar'>
                        <Text weight='less-prominent' line_height='s' size='xxs'>{`${step}/7`}</Text>
                        <Text weight='less-prominent' line_height='s' size='xxs' onClick={onCloseTour}>
                            Exit Tour
                        </Text>
                    </div>
                )}

                {has_started_onboarding_tour && slider_header && (
                    <Text
                        weight='bold'
                        align='center'
                        className='dbot-slider__title'
                        as='span'
                        line_height='s'
                        size='xs'
                    >
                        {slider_header}
                    </Text>
                )}
                {has_started_onboarding_tour && slider_image && (
                    <div className='dbot-slider__image'>
                        <img src={slider_image} />
                    </div>
                )}
                {has_started_onboarding_tour && slider_content && (
                    <Text align='center' className='dbot-slider__content' as='span' line_height='s' size='xxs'>
                        {slider_content}
                    </Text>
                )}
                {!has_started_onboarding_tour && (
                    <Accordion
                        className='dbot-slider__accordion'
                        list={BOT_BUILDER_MOBILE.filter(({ key }) => {
                            return key === step;
                        })}
                        icon_close='IcChevronDownBold'
                        icon_open='IcChevronUpBold'
                    />
                )}
                <div className='dbot-slider__status'>
                    <div className='dbot-slider__progress-bar'>
                        <ProgressBarOnboarding
                            step={step}
                            amount_of_steps={Object.keys(!has_started_onboarding_tour && BOT_BUILDER_MOBILE)}
                            setStep={setStep}
                        />
                    </div>
                    <div className='dbot-slider__button-group'>
                        {step !== 1 && (
                            <TourButton
                                type='default'
                                onClick={() => {
                                    onChange('dec');
                                }}
                            >
                                {localize('Previous')}
                            </TourButton>
                        )}
                        <TourButton
                            type='danger'
                            onClick={() => {
                                onChange('inc');
                                onTourEnd();
                            }}
                        >
                            {localize('Next')}
                        </TourButton>
                    </div>
                </div>
            </div>
        </>
    );
};

export default connect(({ dashboard }: RootStore) => ({
    setActiveTab: dashboard.setActiveTab,
    has_started_onboarding_tour: dashboard.has_started_onboarding_tour,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    setTourActive: dashboard.setTourActive,
    setTourDialogVisibility: dashboard.setTourDialogVisibility,
    setHasTourEnded: dashboard.setHasTourEnded,
}))(TourSlider);

import React from 'react';
import { ProgressBarOnboarding, Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { DBOT_ONBOARDING_MOBILE } from './joyride-config';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';

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
}: TTourSlider) => {
    const [step, setStep] = React.useState<number>(1);
    const [slider_content, setContent] = React.useState<string>('');
    const [slider_header, setheader] = React.useState<string>('');
    const [slider_image, setimg] = React.useState<string>('');

    const onCloseTour = () => {
        setOnBoardTourRunState(false);
        setTourActive(false);
    };

    const onTourClose = () => {
        if (step === 7) {
            onCloseTour();
            setHasTourEnded(true);
            setTourDialogVisibility(true);
        }
    };

    const onChange = (param: string) => {
        if (param === 'inc' && step < Object.keys(DBOT_ONBOARDING_MOBILE).length) setStep(step + 1);
        else if (param === 'dec' && step > 1) setStep(step - 1);
    };

    React.useEffect(() => {
        Object.values(DBOT_ONBOARDING_MOBILE).forEach(data => {
            if (data.key === step) {
                setContent(data?.content);
                setheader(data?.header);
                setimg(data?.img);
            }
        });
    }, [step]);

    return (
        <>
            <div className='dbot-slider'>
                <div className='dbot-slider__navbar'>
                    <Text weight='less-prominent' line_height='s' size='xxs'>{`${step}/7`}</Text>
                    <Text weight='less-prominent' line_height='s' size='xxs' onClick={onCloseTour}>
                        Exit Tour
                    </Text>
                </div>
                {slider_header && (
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
                {slider_image && (
                    <div className='dbot-slider__image'>
                        <img src={slider_image} />
                    </div>
                )}
                {slider_content && (
                    <Text align='center' className='dbot-slider__content' as='span' line_height='s' size='xxs'>
                        {slider_content}
                    </Text>
                )}
                <div className='dbot-slider__status'>
                    <div className='dbot-slider__progress-bar'>
                        <ProgressBarOnboarding
                            step={step}
                            amount_of_steps={Object.keys(DBOT_ONBOARDING_MOBILE)}
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
                                onTourClose();
                            }}
                        >
                            {localize('Next')}
                        </TourButton>
                    </div>
                    x
                </div>
            </div>
        </>
    );
};

export default connect(({ dashboard }: RootStore) => ({
    setActiveTab: dashboard.setActiveTab,
    active_tab: dashboard.active_tab,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    setTourActive: dashboard.setTourActive,
    setTourDialogVisibility: dashboard.setTourDialogVisibility,
    setHasTourEnded: dashboard.setHasTourEnded,
}))(TourSlider);

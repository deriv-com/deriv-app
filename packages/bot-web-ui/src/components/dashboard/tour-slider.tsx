import React from 'react';
import classNames from 'classnames';
import { Icon, ProgressBarOnboarding, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { BOT_BUILDER_MOBILE, DBOT_ONBOARDING_MOBILE, TStepMobile } from './joyride-config';

type TTourButton = {
    type?: string;
    onClick: () => void;
    label: string;
};

type TAccordion = {
    content_data: TStepMobile;
    expanded: boolean;
};

const TourButton = ({ label, type = 'default', ...props }: TTourButton) => {
    return (
        <button className={type} {...props}>
            <Text color='prominent' align='center' weight='bold' as='span' line_height='s' size='xs'>
                {label}
            </Text>
        </button>
    );
};

const Accordion = ({ content_data, expanded = false, ...props }: TAccordion) => {
    const [is_open, setOpen] = React.useState(expanded);
    const { content, header } = content_data;

    return (
        <div className='dbot-accordion' {...props}>
            <div>
                <div className='dbot-accordion__navbar' onClick={() => setOpen(!is_open)}>
                    <div className='dbot-accordion__header'>
                        <Text as='span' size='xs' weight='bold'>
                            {localize(header)}
                        </Text>
                    </div>
                    <div className='dbot-accordion__icon'>
                        <Icon icon={is_open ? 'IcChevronDownBold' : 'IcChevronUpBold'} />
                    </div>
                </div>
                <div
                    className={classNames('dbot-accordion__content', {
                        'dbot-accordion__content--open': is_open,
                    })}
                >
                    <Text as='span' size='xxs' line_height='s'>
                        {localize(content)}
                    </Text>
                </div>
            </div>
        </div>
    );
};

type TTourData = TStepMobile & {
    img: string;
    step_key: number;
};

const default_tour_data = {
    content: [],
    header: '',
    img: '',
    step_key: 0,
};

const TourSlider = observer(() => {
    const { dashboard, load_modal } = useDBotStore();
    const { has_started_bot_builder_tour, has_started_onboarding_tour, onCloseTour, onTourEnd, setTourActiveStep } =
        dashboard;
    const { toggleTourLoadModal } = load_modal;
    const [step, setStep] = React.useState<number>(1);
    const [tour_data, setTourData] = React.useState<TTourData>(default_tour_data);
    const get_tour_config = !has_started_onboarding_tour ? BOT_BUILDER_MOBILE : DBOT_ONBOARDING_MOBILE;
    const { content, header, img, step_key } = tour_data;

    React.useEffect(() => {
        setTourActiveStep(step);
        Object.values(get_tour_config).forEach(data => {
            if (data.key === step) setTourData(data);
        });
        const el_ref = document.querySelector('.toolbar__group-btn svg:nth-child(2)');
        if (has_started_bot_builder_tour && step === 1) {
            //component does not rerender
            el_ref?.classList.add('dbot-tour-blink');
        } else {
            el_ref?.classList.remove('dbot-tour-blink');
        }

        if (has_started_bot_builder_tour && step === 2) toggleTourLoadModal(true);
        else toggleTourLoadModal(false);
    }, [step]);

    const content_data = BOT_BUILDER_MOBILE.find(({ key }) => key === step);

    const bot_tour_text = !has_started_onboarding_tour && step === 3 ? localize('Finish') : localize('Next');

    const tour_button_text = has_started_onboarding_tour && step_key === 0 ? localize('Start') : bot_tour_text;

    const botBuilderTour = () => {
        return (
            <div
                className={classNames('dbot-slider', {
                    'dbot-slider__bot-builder-tour': !has_started_onboarding_tour,
                })}
            >
                {content_data && <Accordion content_data={content_data} expanded />}
                <div className='dbot-slider__status'>
                    <div className='dbot-slider__progress-bar'>
                        {
                            <ProgressBarOnboarding
                                step={step}
                                amount_of_steps={Object.keys(
                                    !has_started_onboarding_tour ? BOT_BUILDER_MOBILE : DBOT_ONBOARDING_MOBILE
                                )}
                                setStep={setStep}
                            />
                        }
                    </div>
                    <div className='dbot-slider__button-group'>
                        {step !== 1 && (
                            <TourButton
                                onClick={() => {
                                    setStep(step - 1);
                                }}
                                label={localize('Previous')}
                            />
                        )}
                        <TourButton
                            type='danger'
                            onClick={() => {
                                setStep(step + 1);
                                onTourEnd(step, false);
                            }}
                            label={tour_button_text}
                        />
                    </div>
                </div>
            </div>
        );
    };
    const onBoardTour = () => {
        return (
            <div
                className={classNames('dbot-slider', {
                    //'dbot-slider__bot-builder-tour': !has_started_onboarding_tour,
                    'dbot-slider--active': step === 1,
                })}
            >
                {step_key !== 0 && (
                    <div className='dbot-slider__navbar'>
                        <Text
                            color='less-prominent'
                            weight='less-prominent'
                            line_height='s'
                            size='xxs'
                        >{`${step_key}/6`}</Text>
                        <Text
                            color='prominent'
                            weight='--text-less-prominent'
                            line_height='s'
                            size='xxs'
                            onClick={onCloseTour}
                        >
                            {localize('Exit Tour')}
                        </Text>
                    </div>
                )}

                {header && (
                    <Text
                        color='prominent'
                        weight='bold'
                        align='center'
                        className='dbot-slider__title'
                        as='span'
                        line_height='s'
                        size='xs'
                    >
                        {localize(header)}
                    </Text>
                )}
                {img && (
                    <div className='dbot-slider__image'>
                        <img src={img} />
                    </div>
                )}
                {content && (
                    <>
                        {content.map(data => {
                            return (
                                <Text
                                    key={data}
                                    align='center'
                                    color='prominent'
                                    className='dbot-slider__content'
                                    as='div'
                                    line_height='s'
                                    size='xxs'
                                >
                                    {localize(data)}
                                </Text>
                            );
                        })}
                    </>
                )}
                {/* {!has_started_onboarding_tour && content_data && <Accordion content_data={content_data} expanded />} */}
                <div className='dbot-slider__status'>
                    <div className='dbot-slider__progress-bar'>
                        {step !== 1 && (
                            <ProgressBarOnboarding
                                step={step}
                                amount_of_steps={Object.keys(DBOT_ONBOARDING_MOBILE)}
                                setStep={setStep}
                            />
                        )}
                    </div>
                    <div className='dbot-slider__button-group'>
                        {step === 1 && (
                            <TourButton
                                onClick={() => {
                                    onCloseTour();
                                }}
                                label={localize('Skip')}
                            />
                        )}
                        {step !== 1 && step !== 2 && (
                            <TourButton
                                onClick={() => {
                                    setStep(step - 1);
                                }}
                                label={localize('Previous')}
                            />
                        )}
                        <TourButton
                            type='danger'
                            onClick={() => {
                                setStep(step + 1);
                                onTourEnd(step, true);
                            }}
                            label={tour_button_text}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = has_started_onboarding_tour ? onBoardTour : botBuilderTour;

    return <>{renderContent()}</>;
});

export default TourSlider;

import React from 'react';
import classNames from 'classnames';
import { Icon, ProgressBarOnboarding, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { BOT_BUILDER_MOBILE, DBOT_ONBOARDING_MOBILE, TStepMobile } from './joyride-config';

type TTourButton = {
    type?: string;
    onClick: () => void;
    label: string;
};

type TTourSlider = {
    has_started_bot_builder_tour: boolean;
    has_started_onboarding_tour: boolean;
    onCloseTour: () => void;
    onTourEnd: (step: number, has_started_onboarding_tour: boolean) => void;
    setTourActiveStep: (param: number) => void;
    toggleTourLoadModal: (toggle: boolean) => void;
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
                    <Text as='span' size='xxs' line_height='s' color='colored-background'>
                        {localize(content)}
                    </Text>
                </div>
            </div>
        </div>
    );
};

const TourSlider = ({
    onCloseTour,
    onTourEnd,
    has_started_onboarding_tour,
    has_started_bot_builder_tour,
    setTourActiveStep,
    toggleTourLoadModal,
}: TTourSlider) => {
    const [step, setStep] = React.useState<number>(1);
    const [slider_content, setContent] = React.useState<string | string[]>('');
    const [slider_header, setheader] = React.useState<string>('');
    const [slider_image, setimg] = React.useState<string>('');
    const [step_key, setStepKey] = React.useState<number>(0);

    React.useEffect(() => {
        setTourActiveStep(step);
        Object.values(!has_started_onboarding_tour ? BOT_BUILDER_MOBILE : DBOT_ONBOARDING_MOBILE).forEach(data => {
            if (data.key === step) {
                setContent(data?.content);
                setheader(data?.header);
                setimg(data?.img);
                setStepKey(data?.step_key);
            }
        });
        const el_ref = document.querySelector('.toolbar__group-btn svg:nth-child(2)');
        if (has_started_bot_builder_tour && step === 1) {
            //component does not rerender
            el_ref?.classList.add('dbot-tour-blink');
        } else {
            el_ref?.classList.remove('dbot-tour-blink');
        }
        if (has_started_bot_builder_tour && step === 2) {
            toggleTourLoadModal(true);
        } else toggleTourLoadModal(false);
    }, [step]);

    const onChange = React.useCallback(
        (param: string) => {
            const MOBILE_TOUR = !has_started_onboarding_tour ? BOT_BUILDER_MOBILE : DBOT_ONBOARDING_MOBILE;
            if (param === 'inc' && step < Object.keys(MOBILE_TOUR).length) setStep(step + 1);
            else if (param === 'dec' && step > 1) setStep(step - 1);
            else if (param === 'skip') onCloseTour();
        },
        [step]
    );

    const content_data = BOT_BUILDER_MOBILE.find(({ key }) => key === step);
    const onClickNext = React.useCallback(() => {
        onChange('inc');
        onTourEnd(step, has_started_onboarding_tour);
    }, [step]);

    const bot_tour_text = !has_started_onboarding_tour && step === 3 ? localize('Finish') : localize('Next');

    const tour_button_text = has_started_onboarding_tour && step_key === 0 ? localize('Start') : bot_tour_text;

    return (
        <>
            <div
                className={classNames('dbot-slider', {
                    'dbot-slider__bot-builder-tour': !has_started_onboarding_tour,
                    'dbot-slider--active': has_started_onboarding_tour && step === 1,
                    'dbot-slider--tour-position': has_started_onboarding_tour && step_key !== 0,
                })}
            >
                {has_started_onboarding_tour && slider_header && step_key !== 0 && (
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

                {has_started_onboarding_tour && slider_header && (
                    <Text
                        color='prominent'
                        weight='bold'
                        align='center'
                        className='dbot-slider__title'
                        as='span'
                        line_height='s'
                        size='xs'
                    >
                        {localize(slider_header)}
                    </Text>
                )}
                {has_started_onboarding_tour && slider_image && (
                    <div className='dbot-slider__image'>
                        <img src={slider_image} />
                    </div>
                )}
                {has_started_onboarding_tour && slider_content && (
                    <>
                        {slider_content.map(data => {
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
                {!has_started_onboarding_tour && content_data && <Accordion content_data={content_data} expanded />}
                <div className='dbot-slider__status'>
                    <div className='dbot-slider__progress-bar'>
                        {(!has_started_onboarding_tour || (has_started_onboarding_tour && step !== 1)) && (
                            <ProgressBarOnboarding
                                step={step}
                                amount_of_steps={Object.keys(
                                    !has_started_onboarding_tour ? BOT_BUILDER_MOBILE : DBOT_ONBOARDING_MOBILE
                                )}
                                setStep={setStep}
                            />
                        )}
                    </div>
                    <div className='dbot-slider__button-group'>
                        {has_started_onboarding_tour && step === 1 && (
                            <TourButton
                                onClick={() => {
                                    onChange('skip');
                                }}
                                label={localize('Skip')}
                            />
                        )}
                        {((has_started_bot_builder_tour && step !== 1) ||
                            (has_started_onboarding_tour && step !== 1 && step !== 2)) && (
                            <TourButton
                                onClick={() => {
                                    onChange('dec');
                                }}
                                label={localize('Previous')}
                            />
                        )}
                        <TourButton type='danger' onClick={onClickNext} label={tour_button_text} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default connect(({ dashboard, load_modal }: RootStore) => ({
    active_tab: dashboard.active_tab,
    has_started_bot_builder_tour: dashboard.has_started_bot_builder_tour,
    has_started_onboarding_tour: dashboard.has_started_onboarding_tour,
    onCloseTour: dashboard.onCloseTour,
    onTourEnd: dashboard.onTourEnd,
    setActiveTab: dashboard.setActiveTab,
    setTourActiveStep: dashboard.setTourActiveStep,
    toggleTourLoadModal: load_modal.toggleTourLoadModal,
}))(TourSlider);

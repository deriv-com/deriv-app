import React from 'react';
import { ProgressBarOnboarding, Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { BOT_BUILDER_MOBILE, DBOT_ONBOARDING_MOBILE } from './joyride-config';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import classNames from 'classnames';

type TTourButton = {
    children?: React.ReactNode;
    type?: string;
    onClick: () => void;
    button_text: string;
};

type TTourSlider = {
    setOnBoardTourRunState: (param: boolean) => void;
    setTourActive: (param: boolean) => void;
    setTourDialogVisibility: (param: boolean) => void;
    setBotBuilderTourState: (param: boolean) => void;
    setHasTourEnded: (param: boolean) => void;
    setTourActiveStep: (param: number) => void;
    has_started_onboarding_tour: boolean;
};

type TAccordion = {
    content_data: string[];
    show_expanded: boolean;
    icon: string;
};

const TourButton = ({ button_text, type = '', ...props }: TTourButton) => {
    return (
        <button className={type} {...props}>
            <Text align='center' weight='bold' as='span' line_height='s' size='xs'>
                {localize(button_text)}
            </Text>
        </button>
    );
};

const makeCenter = (type: string) => {
    const blocks: { [k: string]: any } = {};
    Blockly?.derivWorkspace?.getTopBlocks().forEach(b => {
        blocks[b.type] = b.id;
    });
    Blockly.derivWorkspace.centerOnBlock(blocks[type]);
};

const Accordion = ({ content_data, show_expanded, icon, ...props }: TAccordion) => {
    const [show_accordion, setShowAccordion] = React.useState(show_expanded);

    const toggleTab = () => {
        setShowAccordion(!show_accordion);
    };

    return (
        <div className='dbot-accordion' {...props}>
            {content_data.map(data => {
                const { content, header, key } = data;
                return (
                    <div key={key}>
                        <div className='dbot-accordion__navbar' onClick={() => toggleTab()}>
                            <div className='dbot-accordion__header'>
                                <Text as='span' size='xs' weight='bold'>
                                    {header}
                                </Text>
                            </div>
                            <div className='dbot-accordion__icon'>
                                <Icon icon={show_accordion ? 'IcChevronDownBold' : 'IcChevronUpBold'} />
                            </div>
                        </div>
                        <div
                            className={classNames('dbot-accordion__content', {
                                'dbot-accordion__content--open': show_accordion,
                            })}
                        >
                            {content}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const TourSlider = ({
    setOnBoardTourRunState,
    setBotBuilderTourState,
    setTourActive,
    setTourDialogVisibility,
    setHasTourEnded,
    has_started_onboarding_tour,
    setTourActiveStep,
}: TTourSlider) => {
    const [step, setStep] = React.useState<number>(1);
    const [slider_content, setContent] = React.useState<string>('');
    const [slider_header, setheader] = React.useState<string>('');
    const [slider_image, setimg] = React.useState<string>('');

    const onCloseTour = (param: string) => {
        if (param === 'onboard') {
            setOnBoardTourRunState(false);
        } else {
            setBotBuilderTourState(false);
        }
        setTourActive(false);
    };

    React.useEffect(() => {
        setTourActiveStep(step);
        if (step === 1) {
            makeCenter('trade_definition');
        } else if (step === 2) {
            makeCenter('before_purchase');
        } else if (step === 5) {
            makeCenter('after_purchase');
        }
    }, [step]);

    const onTourEnd = () => {
        if (step === 7) {
            onCloseTour('onboard');
            setHasTourEnded(true);
            setTourDialogVisibility(true);
        }
        if (!has_started_onboarding_tour && step === 6) {
            onCloseTour('bot_builder');
            setHasTourEnded(true);
            setTourDialogVisibility(true);
        }
    };

    const onChange = (param: string) => {
        if (
            param === 'inc' &&
            step < Object.keys(!has_started_onboarding_tour ? BOT_BUILDER_MOBILE : DBOT_ONBOARDING_MOBILE).length
        )
            setStep(step + 1);
        else if (param === 'dec' && step > 1) setStep(step - 1);
    };

    React.useEffect(() => {
        Object.values(!has_started_onboarding_tour ? BOT_BUILDER_MOBILE : DBOT_ONBOARDING_MOBILE).forEach(data => {
            if (data.key === step) {
                setContent(data?.content);
                setheader(data?.header);
                setimg(data?.img);
            }
        });
    }, [step]);

    return (
        <>
            <div
                className={classNames('dbot-slider', {
                    'dbot-slider__bot-builder-tour': !has_started_onboarding_tour,
                })}
            >
                {has_started_onboarding_tour && slider_header && (
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
                        content_data={BOT_BUILDER_MOBILE.filter(({ key }) => {
                            return key === step;
                        })}
                        show_expanded
                    />
                )}
                <div className='dbot-slider__status'>
                    <div className='dbot-slider__progress-bar'>
                        <ProgressBarOnboarding
                            step={step}
                            amount_of_steps={Object.keys(
                                !has_started_onboarding_tour ? BOT_BUILDER_MOBILE : DBOT_ONBOARDING_MOBILE
                            )}
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
                                button_text='Previous'
                            />
                        )}
                        <TourButton
                            type='danger'
                            onClick={() => {
                                onChange('inc');
                                onTourEnd();
                            }}
                            button_text='Next'
                        />
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
    setBotBuilderTourState: dashboard.setBotBuilderTourState,
    setHasTourEnded: dashboard.setHasTourEnded,
    setTourActiveStep: dashboard.setTourActiveStep,
    active_tab: dashboard.active_tab,
}))(TourSlider);

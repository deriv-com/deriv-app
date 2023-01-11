import React from 'react';
import { ProgressBarOnboarding, Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { BOT_BUILDER_MOBILE, DBOT_ONBOARDING_MOBILE, TStepMobile } from './joyride-config';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import classNames from 'classnames';

type TTourButton = {
    type?: string;
    onClick: () => void;
    label: string;
};

type TTourSlider = {
    has_started_onboarding_tour: boolean;
    has_started_bot_builder_tour: boolean;
    setTourDialogVisibility: (param: boolean) => void;
    setHasTourEnded: (param: boolean) => void;
    setTourActiveStep: (param: number) => void;
    onCloseTour: (param: Partial<string>) => void;
    onTourEnd: (step: number, has_started_onboarding_tour: boolean) => void;
};

type TAccordion = {
    content_data: TStepMobile;
    expanded: boolean;
};

const TourButton = ({ label, type = '', ...props }: TTourButton) => {
    return (
        <button className={type} {...props}>
            <Text align='center' weight='bold' as='span' line_height='s' size='xs'>
                {label}
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
                    {content}
                </div>
            </div>
        </div>
    );
};

const TourSlider = ({
    has_started_onboarding_tour,
    has_started_bot_builder_tour,
    setTourDialogVisibility,
    setHasTourEnded,
    setTourActiveStep,
    onCloseTour,
    onTourEnd,
}: TTourSlider) => {
    const [step, setStep] = React.useState<number>(1);
    const [slider_content, setContent] = React.useState<string>('');
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
            }
        });
        if (has_started_bot_builder_tour) {
            switch (step) {
                case 1:
                    makeCenter('trade_definition');
                    break;
                case 2:
                    makeCenter('before_purchase');
                    break;
                case 5:
                    makeCenter('after_purchase');
                    break;
                default:
                    break;
            }
        }
    }, [step]);

    const onChange = React.useCallback(
        (param: string) => {
            if (
                param === 'inc' &&
                step < Object.keys(!has_started_onboarding_tour ? BOT_BUILDER_MOBILE : DBOT_ONBOARDING_MOBILE).length
            )
                setStep(step + 1);
            else if (param === 'dec' && step > 1) setStep(step - 1);
            else if (param === 'skip') onCloseTour('onboard');
        },
        [step]
    );

    React.useEffect(() => {
        Object.values(!has_started_onboarding_tour ? BOT_BUILDER_MOBILE : DBOT_ONBOARDING_MOBILE).forEach(data => {
            if (data.key === step) {
                setContent(data?.content);
                setheader(data?.header);
                setimg(data?.img);
                setStepKey(data?.step_key);
            }
        });
    }, [step]);
    const content_data = BOT_BUILDER_MOBILE.find(({ key }) => key === step);

    const onClickNext = React.useCallback(() => {
        onChange('inc');
        onTourEnd(step, has_started_onboarding_tour);
    }, [step]);

    return (
        <>
            <div
                className={classNames('dbot-slider', {
                    'dbot-slider__bot-builder-tour': !has_started_onboarding_tour,
                    'dbot-slider--active': has_started_onboarding_tour && step === 1,
                })}
            >
                {has_started_onboarding_tour && slider_header && step_key !== 0 && (
                    <div className='dbot-slider__navbar'>
                        <Text weight='less-prominent' line_height='s' size='xxs'>{`${step_key}/7`}</Text>
                        <Text weight='less-prominent' line_height='s' size='xxs' onClick={onCloseTour}>
                            {localize('Exit Tour')}
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
                        {localize(slider_header)}
                    </Text>
                )}
                {has_started_onboarding_tour && slider_image && (
                    <div className='dbot-slider__image'>
                        <img src={slider_image} />
                    </div>
                )}
                {has_started_onboarding_tour && slider_content && (
                    <Text align='center' className='dbot-slider__content' as='span' line_height='s' size='xxs'>
                        {localize(slider_content)}
                    </Text>
                )}
                {!has_started_onboarding_tour && content_data && <Accordion content_data={content_data} expanded />}
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
                        {has_started_onboarding_tour && step === 1 && (
                            <TourButton onClick={onChange('skip')} label={localize('Skip')} />
                        )}
                        {has_started_bot_builder_tour && step !== 1 && (
                            <TourButton onClick={onChange('dec')} label={localize('Previous')} />
                        )}
                        <TourButton type='danger' onClick={onClickNext()} label={localize('Next')} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default connect(({ dashboard }: RootStore) => ({
    setActiveTab: dashboard.setActiveTab,
    active_tab: dashboard.active_tab,
    setTourDialogVisibility: dashboard.setTourDialogVisibility,
    setHasTourEnded: dashboard.setHasTourEnded,
    has_started_onboarding_tour: dashboard.has_started_onboarding_tour,
    has_started_bot_builder_tour: dashboard.has_started_bot_builder_tour,
    setTourActiveStep: dashboard.setTourActiveStep,
    onCloseTour: dashboard.onCloseTour,
    onTourEnd: dashboard.onTourEnd,
}))(TourSlider);

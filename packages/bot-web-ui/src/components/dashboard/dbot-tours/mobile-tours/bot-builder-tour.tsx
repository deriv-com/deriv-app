import React from 'react';
import { ProgressBarOnboarding } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { BOT_BUILDER_MOBILE } from '../config';
import { highlightLoadModalButton } from '../utils';
import Accordion from './common/accordion';
import TourButton from './common/tour-button';

const BotBuilderTour = observer(() => {
    const { dashboard, load_modal } = useDBotStore();
    const { toggleTourLoadModal } = load_modal;
    const { onTourEnd, has_started_bot_builder_tour, setTourActiveStep } = dashboard;
    const [tour_step, setTourStep] = React.useState<number>(1);
    const content_data = BOT_BUILDER_MOBILE.find(({ tour_step_key }) => tour_step_key === tour_step);

    React.useEffect(() => {
        setTourActiveStep(tour_step);
        //component does not rerender so calling this to highlight
        highlightLoadModalButton(has_started_bot_builder_tour, tour_step);
        if (tour_step === 2) toggleTourLoadModal(true);
        else toggleTourLoadModal(false);
    }, [tour_step]);

    const tour_button_text = tour_step === 3 ? localize('Finish') : localize('Next');

    return (
        <div data-testid='botbuilder-tour-mobile' className='dbot-slider dbot-slider__bot-builder-tour'>
            {content_data && <Accordion data-testid='bot-builder-acc' content_data={content_data} expanded />}
            <div className='dbot-slider__status'>
                <div className='dbot-slider__progress-bar'>
                    {
                        <ProgressBarOnboarding
                            step={tour_step}
                            amount_of_steps={Object.keys(BOT_BUILDER_MOBILE)}
                            setStep={setTourStep}
                        />
                    }
                </div>
                <div className='dbot-slider__button-group'>
                    {tour_step !== 1 && (
                        <TourButton
                            onClick={() => {
                                setTourStep(tour_step - 1);
                            }}
                            label={localize('Previous')}
                            data-testid='prev-bot-builder-tour'
                        />
                    )}
                    <TourButton
                        type='danger'
                        onClick={() => {
                            setTourStep(tour_step + 1);
                            onTourEnd(tour_step, false);
                        }}
                        label={tour_button_text}
                        data-testid={tour_step === 3 ? 'finish-bot-builder-tour' : 'next-bot-builder-tour'}
                    />
                </div>
            </div>
        </div>
    );
});

export default BotBuilderTour;

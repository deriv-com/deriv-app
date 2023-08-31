import React from 'react';
import ReactJoyride, { Step, Styles } from 'react-joyride';
import { localize } from '@deriv/translations';
import { handleJoyrideCallback } from './joyride-config';

const common_tour_button_properties = {
    fontWeight: '700',
    fontSize: '1.4rem',
    height: '4rem',
    padding: '1rem 1.6rem',
};

const ReactJoyrideWrapper = ({ steps, styles, ...props }: { steps: Step[]; styles: Styles }) => {
    return (
        <ReactJoyride
            steps={steps}
            continuous
            callback={handleJoyrideCallback}
            locale={{ back: localize('Previous'), next: localize('Next') }}
            {...props}
            styles={{
                options: {
                    arrowColor: 'var(--general-main-2)',
                    backgroundColor: 'var(--general-main-2)',
                    primaryColor: 'var(--brand-red-coral)',
                    textColor: 'var(--text-general)',
                    spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
                },
                buttonBack: {
                    border: '0.2rem solid var(--text-less-prominent)',
                    marginRight: '1rem',
                    borderRadius: '0.4rem',
                    color: 'var(--text-general)',
                    ...common_tour_button_properties,
                },
                buttonNext: {
                    ...common_tour_button_properties,
                },
                overlay: {
                    height: '100%',
                },
                ...styles,
            }}
        />
    );
};

export default ReactJoyrideWrapper;

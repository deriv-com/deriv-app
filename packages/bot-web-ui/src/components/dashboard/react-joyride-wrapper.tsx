import React from 'react';
import ReactJoyride, { Step, Styles } from 'react-joyride';
import { handleJoyrideCallback } from './joyride-config';

const ReactJoyrideWrapper = ({ steps, styles, ...props }: { steps: Step[]; styles: Styles }) => {
    return (
        <ReactJoyride
            steps={steps}
            continuous
            callback={handleJoyrideCallback}
            locale={{ back: 'Previous' }}
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
                    padding: '0.6rem',
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

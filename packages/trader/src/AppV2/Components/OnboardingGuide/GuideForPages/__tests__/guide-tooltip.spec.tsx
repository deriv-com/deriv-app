import React from 'react';
import { render, screen } from '@testing-library/react';
import GuideTooltip, { GuideTooltipProps } from '../guide-tooltip';

jest.mock('react-joyride', () => jest.fn(() => <div>Joyride</div>));

const mock_props = {
    isLastStep: false,
    primaryProps: {
        title: 'Title',
    },
    skipProps: {
        title: 'Title',
    },
    step: {
        title: 'Title',
        content: 'Step content',
    },
    setStepIndex: jest.fn(),
    tooltipProps: {},
} as unknown as GuideTooltipProps;

describe('GuideTooltip', () => {
    it('should render correct content for tooltip if isLastStep === false', () => {
        render(<GuideTooltip {...mock_props} />);

        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Step content')).toBeInTheDocument();
        expect(screen.queryByText('Done')).not.toBeInTheDocument();
    });

    it('should render correct content for tooltip if isLastStep === true', () => {
        render(<GuideTooltip {...mock_props} isLastStep={true} />);

        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Step content')).toBeInTheDocument();
        expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('should render scroll icon if title of the step is scroll-icon', () => {
        mock_props.step.title = 'scroll-icon';
        render(<GuideTooltip {...mock_props} isLastStep={true} />);
        expect(screen.getByText('Swipe up to see the chart')).toBeInTheDocument();
    });
});

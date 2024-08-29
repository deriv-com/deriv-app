import React from 'react';
import { render, screen } from '@testing-library/react';
import { TooltipRenderProps } from 'react-joyride';
import GuideTooltip from '../guide-tooltip';

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
    tooltipProps: {},
} as unknown as TooltipRenderProps;

describe('GuideTooltip', () => {
    it('should render correct content for tooltip if isLastStep === false', () => {
        render(<GuideTooltip {...mock_props} />);

        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Step content')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.queryByText('Done')).not.toBeInTheDocument();
    });

    it('should render correct content for tooltip if isLastStep === true', () => {
        render(<GuideTooltip {...mock_props} isLastStep={true} />);

        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Step content')).toBeInTheDocument();
        expect(screen.getByText('Done')).toBeInTheDocument();
        expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });
});

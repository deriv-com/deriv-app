import React from 'react';
import { render, screen } from '@testing-library/react';
import JurisdictionClickableDescription from '../jurisdiction-clickable-description';

describe('JurisdictionClickableDescription', () => {
    type TClickableDescription = {
        text: string;
        type: 'link' | 'text';
        onClick?: React.MouseEventHandler<HTMLSpanElement>;
    };
    type TMockProps = {
        clickable_description: TClickableDescription[];
        toggleCardFlip: jest.Mock;
    };

    const mock_props: TMockProps = {
        clickable_description: [
            {
                text: 'Click here',
                type: 'link',
            },
            {
                text: 'to learn more about the documents required for verification.',
                type: 'text',
            },
            {
                text: 'Open another Modal',
                type: 'link',
                onClick: jest.fn(),
            },
        ],
        toggleCardFlip: jest.fn(),
    };

    it('should render JurisdictionClickableDescription', () => {
        render(<JurisdictionClickableDescription {...mock_props} />);
        const container = screen.getAllByTestId('dt_jurisdiction_clickable_description');
        expect(container[0]).toHaveClass('cfd-card-clickable-description-link');
        expect(screen.getByText('Click here')).toBeInTheDocument();
        expect(screen.getByText('to learn more about the documents required for verification.')).toBeInTheDocument();
    });

    it('should call toggleCardFlip when link is clicked', () => {
        render(<JurisdictionClickableDescription {...mock_props} />);
        screen.getByText('Click here').click();
        expect(mock_props.toggleCardFlip).toHaveBeenCalled();
    });

    it('should call onClick when link is clicked with an onClick function', () => {
        render(<JurisdictionClickableDescription {...mock_props} />);
        screen.getByText('Open another Modal').click();
        expect(mock_props.clickable_description[2].onClick).toHaveBeenCalled();
    });
});

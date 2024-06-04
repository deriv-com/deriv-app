import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpansionPanel from '../ExpansionPanel';

describe('ExpansionPanel', () => {
    let mockedProps: React.ComponentProps<typeof ExpansionPanel>;
    beforeEach(() => {
        mockedProps = {
            content: <div>World</div>,
            header: <div>Hello</div>,
        };
    });

    it('should show proper header by default', () => {
        render(<ExpansionPanel {...mockedProps} />);

        expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('should not show the content by default', () => {
        render(<ExpansionPanel {...mockedProps} />);

        expect(screen.queryByText('World')).not.toBeInTheDocument();
    });

    it('should show the content when the user is clicking on chevron icon', () => {
        render(<ExpansionPanel {...mockedProps} />);

        const chevronIcon = screen.getByTestId('dt_chevron_icon');
        userEvent.click(chevronIcon);

        expect(screen.getByText('World')).toBeInTheDocument();
    });

    it('should show and hide the content when the user is clicking twice on chevron icon', () => {
        render(<ExpansionPanel {...mockedProps} />);

        const chevronIcon = screen.getByTestId('dt_chevron_icon');
        userEvent.click(chevronIcon);

        expect(screen.getByText('World')).toBeInTheDocument();

        userEvent.click(chevronIcon);

        expect(screen.queryByText('World')).not.toBeInTheDocument();
    });
});

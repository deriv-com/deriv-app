import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chip from '../chip';

const mockProps = { onClick: jest.fn() };
const label = 'mockLabel';

describe('Chip', () => {
    it('should render component with default props', () => {
        render(<Chip {...mockProps} />);
        const chipButton = screen.getByRole('button');

        expect(chipButton).toBeInTheDocument();
        userEvent.click(chipButton);
        expect(mockProps.onClick).toBeCalled();
    });

    it('should render component with label if it was passed', () => {
        render(<Chip {...mockProps} label={label} />);

        expect(screen.getByText(label)).toBeInTheDocument();
    });

    it('should render component with applied size for label if label and size were passed', () => {
        render(<Chip {...mockProps} label={label} size='sm' />);

        expect(screen.getByText(label)).toHaveClass(
            'quill-typography__body-text__size--sm__weight--regular__decoration--default quill-typography__color--default'
        );
    });

    it('should render component with dropdown and specific className if dropdown was passed', () => {
        render(<Chip {...mockProps} dropdown />);

        const chipButton = screen.getByRole('button');
        expect(chipButton).toHaveClass('quill-chip__custom-right-padding');

        const dropdown = screen.getByRole('img');
        expect(dropdown).toBeInTheDocument();
        expect(dropdown).toHaveAttribute('data-state', 'close');
    });

    it('should render component with specific className if it was passed', () => {
        const className = 'mockClassName';
        render(<Chip {...mockProps} className={className} />);

        const chipButton = screen.getByRole('button');
        expect(chipButton).toHaveClass(className);
    });

    it('should render component data-state === selected if selected was passed', () => {
        render(<Chip {...mockProps} selected />);

        const chipButton = screen.getByRole('button');
        expect(chipButton).toHaveAttribute('data-state', 'selected');
    });

    it('should render component with dropdown data-state === open if dropdown and isDropdownOpen are true', () => {
        render(<Chip {...mockProps} dropdown isDropdownOpen />);

        const dropdown = screen.getByRole('img');
        expect(dropdown).toBeInTheDocument();
        expect(dropdown).toHaveAttribute('data-state', 'open');
    });
});

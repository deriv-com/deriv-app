import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../button';

describe('<Button />', () => {
    it('should renders Button with text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should handle click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        userEvent.click(screen.getByText('Click me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should displays loading state', () => {
        render(<Button is_loading={true}>Click me</Button>);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should disabled the Button when is_disabled is true', () => {
        render(<Button is_disabled={true}>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeDisabled();
    });

    it('should renders ButtonGroup with children', () => {
        render(
            <Button.Group>
                <Button>Button 1</Button>
                <Button>Button 2</Button>
            </Button.Group>
        );
        expect(screen.getByText('Button 1')).toBeInTheDocument();
        expect(screen.getByText('Button 2')).toBeInTheDocument();
    });
});

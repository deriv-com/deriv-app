import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleButton from '../toggle-button.jsx';

type TMockToggleButton = {
    className?: string;
    is_disabled?: boolean;
    is_selected?: boolean;
    onClick?: () => void;
    onChange?: () => void;
};

const MockToggleButton = ({ className, is_disabled, is_selected, onClick, onChange }: TMockToggleButton) => (
    <ToggleButton
        value='test value'
        is_selected={is_selected}
        className={className}
        is_disabled={is_disabled}
        onClick={onClick}
        onChange={onChange}
    >
        <div data-testid='dt_child' />
    </ToggleButton>
);

describe('ToggleButton', () => {
    it('should render <Button />', () => {
        render(<MockToggleButton />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should have "toggle-button--selected" className when "is_selected" property passed', () => {
        render(<MockToggleButton is_selected />);
        expect(screen.getByRole('button')).toHaveClass('toggle-button--selected');
    });

    it('should render "className" when is passed', () => {
        render(<MockToggleButton className='test-class' />);
        expect(screen.getByRole('button')).toHaveClass('test-class');
    });

    it('should not render the button as disabled by default', () => {
        render(<MockToggleButton />);
        expect(screen.getByRole('button')).toBeEnabled();
    });

    it('should render the button as disabled when "is_disabled" property passed', () => {
        render(<MockToggleButton is_disabled />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should render the "children" properly', () => {
        render(<MockToggleButton />);
        expect(screen.getByTestId('dt_child')).toBeInTheDocument();
    });

    it('should call "onClick" function by clicking on the button', () => {
        const mock_onClick = jest.fn();
        render(<MockToggleButton onClick={mock_onClick} />);
        userEvent.click(screen.getByRole('button'));
        expect(mock_onClick).toHaveBeenCalledTimes(1);
    });
});

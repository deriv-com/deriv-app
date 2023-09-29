import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TourButton from '../tour-button';

const mocked_props = {
    label: 'Start Tour',
    type: 'primary',
    onClick: jest.fn(),
};
describe('<TourButton />', () => {
    it('should render TourButton with label', () => {
        render(<TourButton {...mocked_props} />);
        const button = screen.getByRole('button', { name: /Start Tour/i });
        expect(button).toBeInTheDocument();
    });

    it('should not render TourButton with label', () => {
        const mocked_null_props = {
            ...mocked_props,
            label: null,
        };
        render(<TourButton {...mocked_null_props} />);
        const button = screen.queryByRole('button', { name: /Start Tour/i });
        expect(button).not.toBeInTheDocument();
    });

    it('should render TourButton with specified type', () => {
        render(<TourButton {...mocked_props} />);
        const button = screen.getByRole('button', { name: /Start Tour/i });
        expect(button).toHaveClass('primary');
    });

    it('should call onClick when the button is clicked', () => {
        render(<TourButton {...mocked_props} />);
        const button = screen.getByRole('button', { name: /Start Tour/i });
        fireEvent.click(button);
        expect(mocked_props.onClick).toHaveBeenCalledTimes(1);
    });
});

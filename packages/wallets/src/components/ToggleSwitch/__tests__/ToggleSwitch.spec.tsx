import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import ToggleSwitch from '../ToggleSwitch';

describe('ToggleSwitch', () => {
    it('should render the toggle switch with disabled state', () => {
        render(<ToggleSwitch onChange={jest.fn()} value={false} />);
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('should render the toggle switch with enabled state', () => {
        render(<ToggleSwitch onChange={jest.fn()} value={true} />);
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('should call onChange toggle', () => {
        const onChangeMock = jest.fn();
        render(<ToggleSwitch onChange={onChangeMock} value={false} />);
        screen.getByRole('checkbox').click();
        expect(onChangeMock).toHaveBeenCalledTimes(1);
    });

    it('should render toggle switch with ref', () => {
        const ref = createRef<HTMLInputElement>();
        const onChangeMock = jest.fn();
        render(<ToggleSwitch onChange={onChangeMock} ref={ref} value={false} />);
        expect(ref.current).not.toBeNull();
        expect(ref.current).not.toBeChecked();
        ref.current?.click();
        expect(onChangeMock).toHaveBeenCalledTimes(1);
    });
});

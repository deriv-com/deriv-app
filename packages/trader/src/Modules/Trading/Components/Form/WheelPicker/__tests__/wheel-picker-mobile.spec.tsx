import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WheelPickerMobile, { getTargetIndex } from '../wheel-picker-mobile';

jest.mock('react-swipeable', () => ({
    useSwipeable: jest.fn().mockReturnValue({
        onMouseDown: jest.fn(),
        onTouchStart: jest.fn(),
        onTouchMove: jest.fn(),
        onTouchEnd: jest.fn(),
    }),
}));

const options = ['10', '20', '30', '40'];
const mockOnChange = jest.fn();

const renderComponent = (defaultValue: string) => {
    return render(
        <WheelPickerMobile options={options} onChange={mockOnChange} defaultValue={defaultValue} currency='USD' />
    );
};

describe('WheelPickerMobile Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render component with default value', () => {
        renderComponent('20');
        expect(screen.getByText('USD')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
    });

    test('should call onChange with the correct value when swiped up', () => {
        renderComponent('20');
        const pickerWheel = screen.getByTestId('picker-wheel');
        fireEvent.touchStart(pickerWheel, { touches: [{ clientY: 0 }] });
        fireEvent.touchMove(pickerWheel, { touches: [{ clientY: 100 }] });
        fireEvent.touchEnd(pickerWheel);
        expect(mockOnChange).toHaveBeenCalledWith('40');
    });

    test('should call onChange with the correct value when swiped down', () => {
        renderComponent('20');
        const pickerWheel = screen.getByTestId('picker-wheel');
        fireEvent.touchStart(pickerWheel, { touches: [{ clientY: 0 }] });
        fireEvent.touchMove(pickerWheel, { touches: [{ clientY: -100 }] });
        fireEvent.touchEnd(pickerWheel);
        expect(mockOnChange).toHaveBeenCalledWith('20');
    });

    test('should handle default value not in options correctly', () => {
        renderComponent('25');
        expect(screen.getByText('40')).toBeInTheDocument(); // default to last value if defaultValue is not in options
    });

    test('should update selected index correctly when options change', () => {
        const { rerender } = renderComponent('20');
        expect(screen.getByText('20')).toBeInTheDocument();
        rerender(
            <WheelPickerMobile options={['50', '60', '70']} onChange={mockOnChange} defaultValue='60' currency='USD' />
        );
        expect(screen.getByText('60')).toBeInTheDocument();
    });

    test('should render without crashing when no options are provided', () => {
        render(<WheelPickerMobile options={[] as string[]} onChange={mockOnChange} currency='USD' />);
        expect(screen.getByText('USD')).toBeInTheDocument();
    });

    test('should call onChange when an option is clicked', () => {
        renderComponent('20');
        const option = screen.getByText('30');
        fireEvent.mouseUp(option);
        expect(mockOnChange).toHaveBeenCalledWith('30');
    });

    test('getTargetIndex should return correct index', () => {
        const params = {
            deltaY: 100,
            snapTolerance: 0.5,
            optionHeight: 28,
            options,
            selectedIndex: 2,
        };
        expect(getTargetIndex(params)).toBe(0);
    });
});

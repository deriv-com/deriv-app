import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import useDevice from '../../../../../hooks/useDevice';
import { DynamicLeverageTitle } from '../DynamicLeverageTitle';

jest.mock('../../../../../hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isMobile: false,
    })),
}));

const mockToggle = jest.fn();
jest.mock('../../../components/DynamicLeverageContext', () => ({
    useDynamicLeverageModalState: () => ({
        toggleDynamicLeverage: mockToggle,
    }),
}));

describe('DynamicLeverageTitle', () => {
    it('displays the correct title and icon', () => {
        render(<DynamicLeverageTitle />);

        expect(screen.getByText('Get more out of Deriv MT5 Financial')).toBeInTheDocument();
        expect(screen.getByTestId('dt_dynamic_leverage_title_back_icon')).toBeInTheDocument();
    });

    it('calls toggleDynamicLeverage when back icon is clicked', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<DynamicLeverageTitle />);

        fireEvent.click(screen.getByTestId('dt_dynamic_leverage_title_back_icon'));
        expect(mockToggle).toHaveBeenCalledTimes(1);
    });
});

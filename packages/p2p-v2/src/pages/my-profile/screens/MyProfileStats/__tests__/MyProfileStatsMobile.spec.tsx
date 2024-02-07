import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfileStatsMobile from '../MyProfileStatsMobile';

jest.mock('../MyProfileStats', () => ({
    __esModule: true,
    default: () => <div>MyProfileStats</div>,
}));
const mockSetQueryString = jest.fn();
jest.mock('@/hooks/useQueryString', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        setQueryString: mockSetQueryString,
    })),
}));
jest.mock('@/hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isMobile: true,
    })),
}));

describe('MyProfileStatsMobile', () => {
    it('should render loader when data is not available', () => {
        render(<MyProfileStatsMobile />);
        expect(screen.getByText('MyProfileStats')).toBeInTheDocument();
        expect(screen.getByText('Stats')).toBeInTheDocument();
        const goBackBtn = screen.getByTestId('dt_p2p_v2_mobile_wrapper_button');
        userEvent.click(goBackBtn);
        expect(mockSetQueryString).toBeCalledWith({
            tab: 'default',
        });
    });
});

import React from 'react';
import { useCountdown } from 'usehooks-ts';
import { render, screen } from '@testing-library/react';
import OrderTimer from '../OrderTimer';

const mockFn = jest.fn();
jest.mock('usehooks-ts', () => ({
    useCountdown: jest.fn(() => [199300, { startCountdown: mockFn }]),
}));

const mockUseCountdown = useCountdown as jest.Mock;

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

describe('OrderTimer', () => {
    it('should render the timer as expected', () => {
        render(<OrderTimer distance={199300} />);
        expect(mockFn).toBeCalledTimes(1);
        expect(screen.getByText('07:21:40')).toBeInTheDocument();
    });
    it('should show expired when countdown reaches 0', () => {
        mockUseCountdown.mockImplementation(() => [0, { startCountdown: mockFn }]);
        render(<OrderTimer distance={0} />);
        expect(screen.getByText('expired')).toBeInTheDocument();
    });
});

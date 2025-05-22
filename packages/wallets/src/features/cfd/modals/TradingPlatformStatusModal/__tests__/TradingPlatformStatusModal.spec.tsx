import React from 'react';
import { render, screen } from '@testing-library/react';
import TradingPlatformStatusModal from '../TradingPlatformStatusModal';

jest.mock('../../../../../components/Base', () => ({
    ModalWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../screens', () => ({
    TradingPlatformStatus: jest.fn(() => <div>MockedTradingPlatformStatus</div>),
}));

describe('TradingPlatformStatusModal', () => {
    it('renders TradingPlatformStatus', () => {
        render(<TradingPlatformStatusModal status='under_maintenance' />);

        expect(screen.getByText(/MockedTradingPlatformStatus/)).toBeInTheDocument();
    });
});

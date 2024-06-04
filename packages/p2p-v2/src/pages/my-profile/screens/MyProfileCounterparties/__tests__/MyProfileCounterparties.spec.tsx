import React from 'react';
import { useDevice } from '@/hooks';
import { render, screen } from '@testing-library/react';
import MyProfileCounterparties from '../MyProfileCounterparties';

jest.mock('../../MyProfileCounterparties/MyProfileCounterpartiesHeader', () => ({
    MyProfileCounterpartiesHeader: () => <div>MyProfileCounterpartiesHeader</div>,
}));

jest.mock('../../MyProfileCounterparties/MyProfileCounterpartiesTable', () => ({
    MyProfileCounterpartiesTable: () => <div>MyProfileCounterpartiesTable</div>,
}));

jest.mock('@/components/Modals/RadioGroupFilterModal', () => ({
    RadioGroupFilterModal: jest.fn(() => <div>RadioGroupFilterModal</div>),
}));

jest.mock('@/hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isMobile: false,
    })),
}));

jest.mock('@/hooks/useQueryString', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        setQueryString: jest.fn(),
    })),
}));

describe('MyProfileCounterparties', () => {
    it('should render the component as expected', () => {
        render(<MyProfileCounterparties />);
        expect(screen.getByText('MyProfileCounterpartiesTable')).toBeInTheDocument();
    });
    it('should render the mobile view as expected', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<MyProfileCounterparties />);
        expect(screen.getByText('My counterparties')).toBeInTheDocument();
        expect(screen.getByText('MyProfileCounterpartiesTable')).toBeInTheDocument();
    });
});

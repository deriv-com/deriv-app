import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { Icon } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import IdvExpired from '../idv-expired';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <span>mockedIcon</span>),
    };
});

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
}));

beforeEach(() => {
    isDesktop.mockReturnValue(true);
    isMobile.mockReturnValue(false);
    jest.clearAllMocks();
});

describe('<IdvExpired/>', () => {
    const props = {
        handleRequireSubmission: jest.fn(),
    };

    const testComponentRender = () => {
        render(<IdvExpired {...props} />);
        expect(screen.getByTestId('idv_expired_container')).toBeInTheDocument();
        expect(screen.getByText('mockedIcon')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    };

    it('should render IdvExpired component on desktop', () => {
        testComponentRender();
    });

    it('should render IdvExpired component on mobile', () => {
        isDesktop.mockReturnValue(false);
        isMobile.mockReturnValue(true);
        testComponentRender();
    });

    it('should call handleRequireSubmission when try_again button is clicked', () => {
        render(<IdvExpired {...props} />);
        const try_again_btn = screen.getByRole('button', { name: /try again/i });
        fireEvent.click(try_again_btn);
        expect(props.handleRequireSubmission).toBeCalledTimes(1);
    });
});

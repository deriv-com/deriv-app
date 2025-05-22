import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import WalletsErrorScreen from '../WalletsErrorScreen';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

describe('WalletsErrorScreen', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should show the correct title with default message', () => {
        render(
            <WalletsErrorScreen
                message='Sorry an error occurred. Please try accessing our cashier again.'
                title='Something went wrong'
            />
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(
            screen.getByText('Sorry an error occurred. Please try accessing our cashier again.')
        ).toBeInTheDocument();
    });

    it('should trigger onClick callback', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        const onClickHandler = jest.fn();

        render(
            <WalletsErrorScreen
                buttonText='Try again'
                buttonVariant='contained'
                message={undefined}
                onClick={onClickHandler}
                title={undefined}
            />
        );
        screen.getByRole('button', { name: 'Try again' }).click();
        expect(onClickHandler).toHaveBeenCalled();
    });
});

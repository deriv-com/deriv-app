import React from 'react';
import { render, screen } from '@testing-library/react';
import useDevice from '../../../hooks/useDevice';
import WalletsErrorScreen from '../WalletsErrorScreen';

jest.mock('../../../hooks/useDevice', () =>
    jest.fn(() => ({
        isMobile: false,
    }))
);

describe('WalletsErrorScreen', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should show the correct title with default message', () => {
        render(
            <WalletsErrorScreen
                message='Sorry an error occurred. Please try accessing our cashier again.'
                title='Oops, something went wrong!'
            />
        );
        expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
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

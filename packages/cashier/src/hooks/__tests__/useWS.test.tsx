import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useWS as useWSShared } from '@deriv/shared';
import useWS from '../useWS';
import { TSocketCallTypes } from '../../types';

jest.mock('@deriv/shared');

const mockUseWSShared = useWSShared as jest.MockedFunction<typeof useWSShared>;

const UseWSExample = <T extends keyof TSocketCallTypes>({ name, request }: { name: T; request: any }) => {
    const WS = useWS(name);

    return (
        <>
            <p data-testid={'isLoading'}>{WS.isLoading ? 'true' : 'false'}</p>
            <p data-testid={'error'}>{WS.error ? JSON.stringify(WS.error) : 'undefined'}</p>
            <p data-testid={'data'}>{WS.data ? JSON.stringify(WS.data) : 'undefined'}</p>
            <button data-testid={'send'} onClick={() => WS.send(request)}>
                send
            </button>
        </>
    );
};

describe('useWS', () => {
    test('should have initial error and data of undefined and isLoading of false', async () => {
        render(<UseWSExample name={'ping'} request={{}} />);

        const isLoading = screen.getByTestId('isLoading');
        const error = screen.getByTestId('error');
        const data = screen.getByTestId('data');

        expect(isLoading).toHaveTextContent('false');
        expect(error).toHaveTextContent('undefined');
        expect(data).toHaveTextContent('undefined');
    });

    test('should call ping and get pong in response', async () => {
        mockUseWSShared.mockReturnValue({
            send: jest.fn(() => Promise.resolve({ ping: 'pong' })),
        });

        render(<UseWSExample name={'ping'} request={{}} />);

        const isLoading = screen.getByTestId('isLoading');
        const error = screen.getByTestId('error');
        const data = screen.getByTestId('data');
        const send = screen.getByTestId('send');

        expect(isLoading).toHaveTextContent('false');
        expect(error).toHaveTextContent('undefined');
        expect(data).toHaveTextContent('undefined');
        userEvent.click(send);
        await waitFor(() => expect(isLoading).toHaveTextContent('true'));
        await waitFor(() => expect(data).toHaveTextContent('pong'));
        await waitFor(() => expect(error).toHaveTextContent('undefined'));
        await waitFor(() => expect(isLoading).toHaveTextContent('false'));
    });

    test('should call verify_email and get 1 in response', async () => {
        mockUseWSShared.mockReturnValue({
            send: jest.fn(() => Promise.resolve({ verify_email: 1 })),
        });

        render(
            <UseWSExample name={'verify_email'} request={{ verify_email: 'test@test.com', type: 'reset_password' }} />
        );

        const isLoading = screen.getByTestId('isLoading');
        const error = screen.getByTestId('error');
        const data = screen.getByTestId('data');
        const send = screen.getByTestId('send');

        expect(isLoading).toHaveTextContent('false');
        expect(error).toHaveTextContent('undefined');
        expect(data).toHaveTextContent('undefined');
        userEvent.click(send);
        await waitFor(() => expect(isLoading).toHaveTextContent('true'));
        await waitFor(() => expect(data).toHaveTextContent('1'));
        await waitFor(() => expect(error).toHaveTextContent('undefined'));
        await waitFor(() => expect(isLoading).toHaveTextContent('false'));
    });

    // TODO: Add more test cases.
});

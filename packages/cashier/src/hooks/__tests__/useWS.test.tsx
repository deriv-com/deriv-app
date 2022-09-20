import * as React from 'react';
// Todo: After upgrading to react 18 we should use @testing-library/react-hooks instead.
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useWS as useWSShared } from '@deriv/shared';
import useWS from '../useWS';
import { TSocketEndpointNames, TSocketRequestProps } from '../../types';

jest.mock('@deriv/shared');

const mockUseWSShared = useWSShared as jest.MockedFunction<typeof useWSShared>;

const UseWSExample = <T extends TSocketEndpointNames>({
    name,
    request,
}: {
    name: T;
    request?: TSocketRequestProps<T>;
}) => {
    const WS = useWS(name);

    return (
        <React.Fragment>
            <p data-testid={'dt_is_loading'}>{WS.is_loading ? 'true' : 'false'}</p>
            <p data-testid={'dt_error'}>{WS.error ? JSON.stringify(WS.error) : 'undefined'}</p>
            <p data-testid={'dt_data'}>{WS.data ? JSON.stringify(WS.data) : 'undefined'}</p>
            <button data-testid={'dt_send'} onClick={() => WS.send(request)}>
                send
            </button>
        </React.Fragment>
    );
};

describe('useWS', () => {
    test('should have initial error and data of undefined and is_loading of false', async () => {
        render(<UseWSExample name={'ping'} />);

        const is_loading = screen.getByTestId('dt_is_loading');
        const error = screen.getByTestId('dt_error');
        const data = screen.getByTestId('dt_data');

        expect(is_loading).toHaveTextContent('false');
        expect(error).toHaveTextContent('undefined');
        expect(data).toHaveTextContent('undefined');
    });

    test('should call ping and get pong in response', async () => {
        mockUseWSShared.mockReturnValue({
            send: jest.fn(() => Promise.resolve({ ping: 'pong' })),
        });

        render(<UseWSExample name={'ping'} />);

        const is_loading = screen.getByTestId('dt_is_loading');
        const error = screen.getByTestId('dt_error');
        const data = screen.getByTestId('dt_data');
        const send = screen.getByTestId('dt_send');

        expect(is_loading).toHaveTextContent('false');
        expect(error).toHaveTextContent('undefined');
        expect(data).toHaveTextContent('undefined');
        userEvent.click(send);
        await waitFor(() => expect(is_loading).toHaveTextContent('true'));
        await waitFor(() => expect(data).toHaveTextContent('pong'));
        await waitFor(() => expect(error).toHaveTextContent('undefined'));
        await waitFor(() => expect(is_loading).toHaveTextContent('false'));
    });

    test('should call verify_email and get 1 in response', async () => {
        mockUseWSShared.mockReturnValue({
            send: jest.fn(() => Promise.resolve({ verify_email: 1 })),
        });

        render(
            <UseWSExample name={'verify_email'} request={{ verify_email: 'test@test.com', type: 'reset_password' }} />
        );

        const is_loading = screen.getByTestId('dt_is_loading');
        const error = screen.getByTestId('dt_error');
        const data = screen.getByTestId('dt_data');
        const send = screen.getByTestId('dt_send');

        expect(is_loading).toHaveTextContent('false');
        expect(error).toHaveTextContent('undefined');
        expect(data).toHaveTextContent('undefined');
        userEvent.click(send);
        await waitFor(() => expect(is_loading).toHaveTextContent('true'));
        await waitFor(() => expect(data).toHaveTextContent('1'));
        await waitFor(() => expect(error).toHaveTextContent('undefined'));
        await waitFor(() => expect(is_loading).toHaveTextContent('false'));
    });

    // TODO: Add more test cases.
});

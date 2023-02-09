import * as React from 'react';
// Todo: After upgrading to react 18 we should use @testing-library/react-hooks instead.
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useWS as useWSShared } from '@deriv/shared';
import useSubscription from '../useSubscription';
import { TSocketRequestProps, TSocketSubscribableEndpointNames } from '../../types';

jest.mock('@deriv/shared');

const mockUseWSShared = useWSShared as jest.MockedFunction<typeof useWSShared>;

const UseSubscriptionExample = <T extends TSocketSubscribableEndpointNames>({
    name,
    request,
}: {
    name: T;
    request?: TSocketRequestProps<T>;
}) => {
    const WS = useSubscription(name);

    return (
        <React.Fragment>
            <p data-testid={'dt_is_loading'}>{WS.is_loading ? 'true' : 'false'}</p>
            <p data-testid={'dt_error'}>{WS.error ? JSON.stringify(WS.error) : 'undefined'}</p>
            <p data-testid={'dt_data'}>{WS.data ? JSON.stringify(WS.data) : 'undefined'}</p>
            <button data-testid={'dt_subscribe'} onClick={() => WS.subscribe(request)}>
                subscribe
            </button>
        </React.Fragment>
    );
};

describe('useSubscription', () => {
    test('should subscribe to p2p_order_info and get the order updates', async () => {
        mockUseWSShared.mockReturnValue({
            subscribe: jest.fn(() => {
                return {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    subscribe: async (onData: (response: any) => void, onError: (response: any) => void) => {
                        const delay = (ms: number) => new Promise<never>(resolve => setTimeout(resolve, ms));

                        await delay(500);

                        onData({ p2p_order_info: { status: 'pending' } });

                        await delay(500);

                        onData({ p2p_order_info: { status: 'buyer-confirmed' } });

                        await delay(500);

                        onData({ p2p_order_info: { status: 'disputed' } });

                        await delay(500);

                        onError({ error: { code: 'Foo', message: 'Error message' } });

                        await delay(500);

                        onData({ p2p_order_info: { status: 'completed' } });

                        return { unsubscribe: () => Promise.resolve() };
                    },
                };
            }),
        });

        render(<UseSubscriptionExample name={'p2p_order_info'} request={{ id: '2' }} />);

        const is_loading = screen.getByTestId('dt_is_loading');
        const error = screen.getByTestId('dt_error');
        const data = screen.getByTestId('dt_data');
        const subscribe = screen.getByTestId('dt_subscribe');

        expect(is_loading).toHaveTextContent('false');
        expect(error).toHaveTextContent('undefined');
        expect(data).toHaveTextContent('undefined');
        userEvent.click(subscribe);
        await waitFor(() => expect(data).toHaveTextContent('{"status":"pending"}'));
        await waitFor(() => expect(data).toHaveTextContent('{"status":"buyer-confirmed"}'));
        await waitFor(() => expect(data).toHaveTextContent('{"status":"disputed"}'));
        await waitFor(() => expect(error).toHaveTextContent('{"code":"Foo","message":"Error message"}'));
        await waitFor(() => expect(data).toHaveTextContent('{"status":"completed"}'));
    });
});

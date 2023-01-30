import * as React from 'react';
// Todo: After upgrading to react 18 we should use @testing-library/react-hooks instead.
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import useCountdown, { TCountdownOptions } from '../useCountdown';

// jest.setTimeout(30000);

const UseCountdownExample = (props: TCountdownOptions) => {
    const counter = useCountdown(props);

    return (
        <React.Fragment>
            <p data-testid={'dt_count'}>{counter.count}</p>
            <p data-testid={'dt_is_running'}>{counter.is_running ? 'true' : 'false'}</p>
            <button data-testid={'dt_start'} onClick={counter.start}>
                start
            </button>
            <button data-testid={'dt_pause'} onClick={counter.pause}>
                pause
            </button>
            <button data-testid={'dt_stop'} onClick={counter.stop}>
                stop
            </button>
            <button data-testid={'dt_reset'} onClick={counter.reset}>
                reset
            </button>
        </React.Fragment>
    );
};

describe('useCountdown', () => {
    test('should use counter', () => {
        const { result } = renderHook(() => useCountdown({ from: 60 }));

        expect(result.current.count).toBe(60);
        expect(result.current.is_running).toBe(false);
    });

    test('should count down from 5 to 0 after start is called and stop once finished', async () => {
        // render(<UseCountdownExample from={5} />);
        const { result, waitForNextUpdate } = renderHook(() => useCountdown({ from: 5 }));
        expect(result.current.count).toBe(5);
        expect(result.current.is_running).toBe(false);

        act(() => {
            result.current.start();
        });

        expect(result.current.is_running).toBe(true);
        await waitForNextUpdate();
        expect(result.current.count).toBe(4);
        await waitForNextUpdate();
        expect(result.current.count).toBe(3);
        await waitForNextUpdate();
        expect(result.current.count).toBe(2);
        await waitForNextUpdate();
        expect(result.current.count).toBe(1);
        expect(result.current.is_running).toBe(false);

        // const count = screen.getByTestId('dt_count');
        // const is_running = screen.getByTestId('dt_is_running');
        // const start = screen.getByTestId('dt_start');

        // userEvent.click(result.current.start);
        // await waitFor(() => expect(is_running).toHaveTextContent('true'));
        // await waitFor(() => expect(count).toHaveTextContent('4'));
        // await waitFor(() => expect(count).toHaveTextContent('3'));
        // await waitFor(() => expect(count).toHaveTextContent('2'));
        // await waitFor(() => expect(count).toHaveTextContent('1'));
        // await waitFor(() => expect(count).toHaveTextContent('0'));
        // await waitFor(() => expect(is_running).toHaveTextContent('false'));
    });

    // test('should count down from 2 to -2 after start is called and stop once finished', async () => {
    //     render(<UseCountdownExample from={2} to={-2} />);

    //     const count = screen.getByTestId('dt_count');
    //     const is_running = screen.getByTestId('dt_is_running');
    //     const start = screen.getByTestId('dt_start');

    //     expect(count).toHaveTextContent('2');
    //     expect(is_running).toHaveTextContent('false');
    //     userEvent.click(start);
    //     await waitFor(() => expect(is_running).toHaveTextContent('true'));
    //     await waitFor(() => expect(count).toHaveTextContent('1'));
    //     await waitFor(() => expect(count).toHaveTextContent('0'));
    //     await waitFor(() => expect(count).toHaveTextContent('-1'));
    //     await waitFor(() => expect(count).toHaveTextContent('-2'));
    //     await waitFor(() => expect(is_running).toHaveTextContent('false'));
    // });

    // test('should count down from -2 to 2 after start is called and stop once finished', async () => {
    //     render(<UseCountdownExample from={-2} to={2} increment />);

    //     const count = screen.getByTestId('dt_count');
    //     const is_running = screen.getByTestId('dt_is_running');
    //     const start = screen.getByTestId('dt_start');

    //     expect(count).toHaveTextContent('-2');
    //     expect(is_running).toHaveTextContent('false');
    //     userEvent.click(start);
    //     await waitFor(() => expect(is_running).toHaveTextContent('true'));
    //     await waitFor(() => expect(count).toHaveTextContent('-1'));
    //     await waitFor(() => expect(count).toHaveTextContent('0'));
    //     await waitFor(() => expect(count).toHaveTextContent('1'));
    //     await waitFor(() => expect(count).toHaveTextContent('2'));
    //     await waitFor(() => expect(is_running).toHaveTextContent('false'));
    // });

    // test('should count down from 3 to 0 after start is called and reset the counter at 1 and stop once finished', async () => {
    //     render(<UseCountdownExample from={3} />);

    //     const count = screen.getByTestId('dt_count');
    //     const is_running = screen.getByTestId('dt_is_running');
    //     const start = screen.getByTestId('dt_start');
    //     const reset = screen.getByTestId('dt_reset');

    //     expect(count).toHaveTextContent('3');
    //     expect(is_running).toHaveTextContent('false');
    //     userEvent.click(start);
    //     await waitFor(() => expect(is_running).toHaveTextContent('true'));
    //     await waitFor(() => expect(count).toHaveTextContent('2'));
    //     await waitFor(() => expect(count).toHaveTextContent('1'));
    //     userEvent.click(reset);
    //     await waitFor(() => expect(count).toHaveTextContent('3'));
    //     await waitFor(() => expect(count).toHaveTextContent('2'));
    //     await waitFor(() => expect(count).toHaveTextContent('1'));
    //     await waitFor(() => expect(count).toHaveTextContent('0'));
    //     await waitFor(() => expect(is_running).toHaveTextContent('false'));
    // });

    // test('should count down from 3 to 0 after start is called and pause the counter at 1', async () => {
    //     render(<UseCountdownExample from={3} />);

    //     const count = screen.getByTestId('dt_count');
    //     const is_running = screen.getByTestId('dt_is_running');
    //     const start = screen.getByTestId('dt_start');
    //     const pause = screen.getByTestId('dt_pause');

    //     expect(count).toHaveTextContent('3');
    //     expect(is_running).toHaveTextContent('false');
    //     userEvent.click(start);
    //     await waitFor(() => expect(is_running).toHaveTextContent('true'));
    //     await waitFor(() => expect(count).toHaveTextContent('2'));
    //     await waitFor(() => expect(count).toHaveTextContent('1'));
    //     userEvent.click(pause);
    //     await waitFor(() => expect(count).toHaveTextContent('1'));
    //     await waitFor(() => expect(is_running).toHaveTextContent('false'));
    // });

    // test('should count down from 3 to 0 after start is called and stop the counter at 1', async () => {
    //     render(<UseCountdownExample from={3} />);

    //     const count = screen.getByTestId('dt_count');
    //     const is_running = screen.getByTestId('dt_is_running');
    //     const start = screen.getByTestId('dt_start');
    //     const stop = screen.getByTestId('dt_stop');

    //     expect(count).toHaveTextContent('3');
    //     expect(is_running).toHaveTextContent('false');
    //     userEvent.click(start);
    //     await waitFor(() => expect(is_running).toHaveTextContent('true'));
    //     await waitFor(() => expect(count).toHaveTextContent('2'));
    //     await waitFor(() => expect(count).toHaveTextContent('1'));
    //     userEvent.click(stop);
    //     await waitFor(() => expect(count).toHaveTextContent('3'));
    //     await waitFor(() => expect(is_running).toHaveTextContent('false'));
    // });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CallBackProps } from 'react-joyride';
import GuideContainer from '../guide-container';

jest.mock('react-joyride', () => ({
    __esModule: true,
    default: jest.fn(({ callback, run }: { callback: (data: CallBackProps) => void; run: boolean }) => (
        <div data-testid='mock-joyride' data-run={run}>
            <p>Joyride</p>
            <button onClick={() => callback({ status: 'finished' } as CallBackProps)} data-testid='finish-button'>
                Finish
            </button>
            <button onClick={() => callback({ status: 'skipped' } as CallBackProps)} data-testid='skip-button'>
                Skip
            </button>
            <button onClick={() => callback({ action: 'close' } as CallBackProps)} data-testid='close-button'>
                Close
            </button>
        </div>
    )),
    STATUS: { SKIPPED: 'skipped', FINISHED: 'finished' },
    ACTIONS: { CLOSE: 'close' },
}));

const mock_props = {
    should_run: true,
    steps: [
        {
            content: 'Test content',
            target: '.test-target',
            title: 'Test title',
        },
    ],
    callback: jest.fn(),
};

describe('GuideContainer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render component', () => {
        render(<GuideContainer {...mock_props} />);
        expect(screen.getByText('Joyride')).toBeInTheDocument();
    });
    it('should call callback when status is finished', async () => {
        render(<GuideContainer {...mock_props} />);
        await userEvent.click(screen.getByTestId('finish-button'));
        expect(mock_props.callback).toHaveBeenCalled();
    });
    it('should call callback when status is skipped', async () => {
        render(<GuideContainer {...mock_props} />);
        await userEvent.click(screen.getByTestId('skip-button'));
        expect(mock_props.callback).toHaveBeenCalled();
    });
    it('should call callback when action is close', async () => {
        render(<GuideContainer {...mock_props} />);
        await userEvent.click(screen.getByTestId('close-button'));
        expect(mock_props.callback).toHaveBeenCalled();
    });
    it('should pass correct run prop to Joyride', () => {
        render(<GuideContainer {...mock_props} should_run={false} />);
        expect(screen.getByTestId('mock-joyride')).toHaveAttribute('data-run', 'false');
    });
});

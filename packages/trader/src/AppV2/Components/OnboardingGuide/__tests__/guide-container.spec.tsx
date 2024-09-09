import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CallBackProps } from 'react-joyride';
import GuideContainer from '../guide-container';

jest.mock('react-joyride', () => ({
    __esModule: true,
    default: jest.fn(({ callback }: { callback: (data: CallBackProps) => void }) => (
        <div>
            <p>Joyride</p>
            <button onClick={() => callback({ status: 'finished' } as CallBackProps)} />
        </div>
    )),
    STATUS: { SKIPPED: 'skipped', FINISHED: 'finished' },
}));

const mock_props = {
    should_run: true,
    onFinishGuide: jest.fn(),
};

describe('GuideContainer', () => {
    it('should render component', () => {
        render(<GuideContainer {...mock_props} />);

        expect(screen.getByText('Joyride')).toBeInTheDocument();
    });

    it('should call onFinishGuide inside of callbackHandle if passed status is equal to "skipped" or "finished"', () => {
        render(<GuideContainer {...mock_props} />);
        userEvent.click(screen.getByRole('button'));

        expect(mock_props.onFinishGuide).toBeCalled();
    });
});

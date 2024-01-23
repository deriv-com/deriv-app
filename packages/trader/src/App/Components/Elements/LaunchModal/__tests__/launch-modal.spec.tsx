import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocalStore } from '@deriv/shared';
import LaunchModal from '../launch-modal';

const mocked_default_props = {
    handleChange: jest.fn(() => LocalStore.set('launchModalShown', JSON.stringify(true))),
    setShowDescription: jest.fn(),
    open: true,
};
const launch_modal_id = 'launch-modal';

jest.mock('Assets/SvgComponents/trade_explanations/img-turbos.svg', () => jest.fn(() => <div>Turbos Image</div>));

describe('<LaunchModal />', () => {
    beforeAll(() => {
        (ReactDOM.createPortal as jest.Mock) = jest.fn(component => {
            return component;
        });
    });

    afterAll(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
    });

    beforeEach(() => {
        LocalStore.remove('launchModalShown');
    });

    it('should render launch modal ', () => {
        render(<LaunchModal {...mocked_default_props} />);

        expect(screen.getByTestId(launch_modal_id)).toBeInTheDocument();
    });

    it('should set the localStorage key launchModalShown to true on clicking the Ok button', async () => {
        render(<LaunchModal {...mocked_default_props} />);
        expect(screen.getByTestId(launch_modal_id)).toBeInTheDocument();

        const continue_btn = screen.getByRole('button', { name: 'Ok' });
        userEvent.click(continue_btn);
        const value = JSON.parse(LocalStore.get('launchModalShown') ?? 'false');

        expect(value).toBe(true);
    });

    it('should not display launch modal if open is equal to false', () => {
        render(<LaunchModal {...mocked_default_props} open={false} />);

        expect(screen.queryByTestId(launch_modal_id)).not.toBeInTheDocument();
    });
});

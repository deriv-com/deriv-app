import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerificationStatus from '../verification-status';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(({ icon }) => <div>{icon}</div>),
}));

describe('<VerificationStatus />', () => {
    const mocked_icon = 'Test Icon';
    const mocked_title = 'Test Title';
    const mocked_description = 'Test Description';
    const mockOnClick = jest.fn();

    const commonRenderCheck = () => {
        expect(screen.getByText(mocked_icon)).toBeVisible();
        expect(screen.getByText(mocked_title)).toBeVisible();
        expect(screen.getByText(mocked_description)).toBeVisible();
    };

    it('should render VerificationStatus without button', async () => {
        render(
            <VerificationStatus
                icon={mocked_icon}
                status_description={<div>{mocked_description}</div>}
                status_title={<div>{mocked_title}</div>}
            />
        );

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        commonRenderCheck();
    });

    it('should render VerificationStatus with button', async () => {
        const mock_button = <button onClick={mockOnClick} />;

        render(
            <VerificationStatus
                icon={mocked_icon}
                status_description={<div>{mocked_description}</div>}
                status_title={<div>{mocked_title}</div>}
            >
                {mock_button}
            </VerificationStatus>
        );

        const button = screen.getByRole('button');
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        commonRenderCheck();
        userEvent.click(button);
        expect(mockOnClick).toHaveBeenCalled();
    });
});

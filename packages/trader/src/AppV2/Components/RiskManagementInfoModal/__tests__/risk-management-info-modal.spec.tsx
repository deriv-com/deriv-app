import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RiskManagementInfoModal from '../risk-management-info-modal';

jest.mock('@deriv/quill-icons', () => ({
    LabelPairedCircleInfoSmRegularIcon: () => <svg />,
}));

describe('RiskManagementInfoModal', () => {
    const headerContent = 'Risk Management Info';
    const bodyContent = 'This is the body content of the modal.';
    const infoMessage = 'Additional info message';

    it('should render the button and modal content correctly', () => {
        render(
            <RiskManagementInfoModal
                header_content={headerContent}
                body_content={bodyContent}
                info_message={infoMessage}
            />
        );

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();

        expect(screen.queryByText(headerContent)).not.toBeInTheDocument();
    });

    it('should toggle the modal visibility when the button is clicked', async () => {
        jest.useFakeTimers();
        render(
            <RiskManagementInfoModal
                header_content={headerContent}
                body_content={bodyContent}
                info_message={infoMessage}
            />
        );

        const button = screen.getByRole('button');
        userEvent.click(button);

        expect(screen.getByText(headerContent)).toBeInTheDocument();
        expect(screen.getByText(bodyContent)).toBeInTheDocument();
        expect(screen.getByText(infoMessage)).toBeInTheDocument();

        userEvent.click(button);
        await waitFor(() => jest.advanceTimersByTime(300));

        expect(screen.queryByText(headerContent)).not.toBeInTheDocument();
        jest.useRealTimers();
    });

    it('should not render the info message if it is not provided', () => {
        render(<RiskManagementInfoModal header_content={headerContent} body_content={bodyContent} />);

        const button = screen.getByRole('button');
        userEvent.click(button);

        expect(screen.getByText(headerContent)).toBeInTheDocument();
        expect(screen.getByText(bodyContent)).toBeInTheDocument();
        expect(screen.queryByText(infoMessage)).not.toBeInTheDocument();
    });
});

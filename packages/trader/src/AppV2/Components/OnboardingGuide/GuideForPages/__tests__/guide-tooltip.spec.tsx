import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GuideTooltip from '../guide-tooltip';
import { TooltipRenderProps } from 'react-joyride';

jest.mock('@deriv-com/quill-ui', () => ({
    CaptionText: ({ children, className, bold }: React.PropsWithChildren<{ className?: string; bold?: boolean }>) => (
        <span className={className} data-bold={bold}>
            {children}
        </span>
    ),
    IconButton: ({ onClick, className, icon }: { onClick: () => void; className?: string; icon: React.ReactNode }) => (
        <button onClick={onClick} className={className}>
            {icon}
        </button>
    ),
}));

jest.mock('@deriv/quill-icons', () => ({
    LabelPairedXmarkSmBoldIcon: ({ fill }: { fill: string }) => (
        <div data-testid='xmark-icon' data-fill={fill}>
            XMarkIcon
        </div>
    ),
}));

describe('GuideTooltip', () => {
    const mockOnClick = jest.fn();

    const defaultProps: TooltipRenderProps = {
        closeProps: {
            onClick: mockOnClick,
        },
        step: {
            title: 'Test Title',
            content: 'Test Content',
            placement: 'center',
            target: '.test',
        },
        tooltipProps: {
            'data-testid': 'tooltip-wrapper',
        },
    } as unknown as TooltipRenderProps;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render tooltip with title and content', () => {
        render(<GuideTooltip {...defaultProps} />);

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
        expect(screen.getByTestId('xmark-icon')).toBeInTheDocument();
    });
    it('should render tooltip without title section when title is not provided', () => {
        const propsWithoutTitle = {
            ...defaultProps,
            step: {
                ...defaultProps.step,
                title: undefined,
                content: 'Only Content',
            },
        };

        render(<GuideTooltip {...propsWithoutTitle} />);

        expect(screen.queryByTestId('guide-tooltip__header')).not.toBeInTheDocument();
        expect(screen.getByText('Only Content')).toBeInTheDocument();
    });
    it('should render tooltip without content section when content is not provided', () => {
        const propsWithoutContent = {
            ...defaultProps,
            step: {
                ...defaultProps.step,
                content: undefined,
                title: 'Only Title',
            },
        };

        render(<GuideTooltip {...propsWithoutContent} />);

        expect(screen.getByText('Only Title')).toBeInTheDocument();
        expect(screen.queryByTestId('guide-tooltip__content')).not.toBeInTheDocument();
    });
    it('should call closeProps.onClick when close button is clicked', async () => {
        render(<GuideTooltip {...defaultProps} />);

        const closeButton = screen.getByRole('button');
        await userEvent.click(closeButton);

        expect(mockOnClick).toHaveBeenCalled();
    });
    it('should render close button with correct props', () => {
        render(<GuideTooltip {...defaultProps} />);

        const closeButton = screen.getByRole('button');
        expect(closeButton).toHaveClass('guide-tooltip__close');
        expect(screen.getByTestId('xmark-icon')).toHaveAttribute(
            'data-fill',
            'var(--component-textIcon-inverse-prominent)'
        );
    });
});

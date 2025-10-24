import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompareAccountsCarousel from '../CompareAccountsCarousel';

const mockScrollPrev = jest.fn();
const mockScrollNext = jest.fn();
const mockUseEmblaCarousel = useEmblaCarousel as jest.MockedFunction<typeof useEmblaCarousel>;

jest.mock('embla-carousel-react', () => {
    return jest.fn(() => [
        jest.fn(),
        {
            canScrollNext: jest.fn(() => false),
            canScrollPrev: jest.fn(() => true),
            on: jest.fn(),
            scrollNext: mockScrollNext,
            scrollPrev: mockScrollPrev,
        },
    ]);
});

jest.mock('../CompareAccountsCarouselButton', () => {
    return jest.fn(({ isNext, onClick }: { isNext: boolean; onClick: () => void }) => (
        <button
            data-testid={
                isNext ? 'dt_compare_accounts_carousel_next_button' : 'dt_compare_accounts_carousel_prev_button'
            }
            onClick={onClick}
        >
            {isNext ? 'Next' : 'Prev'}
        </button>
    ));
});

describe('CompareAccountsCarousel', () => {
    const defaultProps = {
        children: <div>Test Child</div>,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders children correctly', () => {
        render(<CompareAccountsCarousel {...defaultProps} />);

        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('initializes Embla Carousel with correct default options', () => {
        render(<CompareAccountsCarousel {...defaultProps} />);

        expect(useEmblaCarousel).toHaveBeenCalledWith({
            align: 0,
            containScroll: 'trimSnaps',
            direction: 'ltr',
        });
    });

    it('initializes Embla Carousel with RTL direction when isRtl is true', () => {
        render(<CompareAccountsCarousel {...defaultProps} isRtl={true} />);

        expect(useEmblaCarousel).toHaveBeenCalledWith({
            align: 0,
            containScroll: 'trimSnaps',
            direction: 'rtl',
        });
    });

    it('calls scrollPrev when prev button is clicked', async () => {
        render(<CompareAccountsCarousel {...defaultProps} />);

        await userEvent.click(screen.getByTestId('dt_compare_accounts_carousel_prev_button'));

        expect(mockScrollPrev).toHaveBeenCalled();
    });

    it('calls scrollNext when next button is clicked', async () => {
        render(<CompareAccountsCarousel {...defaultProps} />);

        await userEvent.click(screen.getByTestId('dt_compare_accounts_carousel_next_button'));

        expect(mockScrollNext).toHaveBeenCalled();
    });

    it('disables buttons when emblaApi is undefined', async () => {
        mockUseEmblaCarousel.mockReturnValue([jest.fn(), undefined]);
        render(<CompareAccountsCarousel {...defaultProps} />);

        await userEvent.click(screen.getByTestId('dt_compare_accounts_carousel_prev_button'));
        expect(mockScrollPrev).not.toHaveBeenCalled();

        await userEvent.click(screen.getByTestId('dt_compare_accounts_carousel_next_button'));
        expect(mockScrollNext).not.toHaveBeenCalled();
    });
});

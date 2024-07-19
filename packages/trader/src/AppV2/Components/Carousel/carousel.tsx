import React from 'react';

type TCarousel = {
    default_page_index?: number;
    onChange?: (new_page_index: number) => void;
    pages: { id: number; component: (onNextClick: () => void) => JSX.Element }[];
    should_reset_carousel?: boolean;
};

const Carousel = ({ default_page_index, onChange, pages, should_reset_carousel }: TCarousel) => {
    const [current_index, setCurrentIndex] = React.useState(default_page_index ?? 0);

    const pages_length = pages.length;

    const onNextClick = () => setCurrentIndex((current_index + 1) % pages_length);
    const onPrevClick = () => setCurrentIndex((current_index - 1 + pages_length) % pages_length);
    const onPageChange = () => onChange?.(current_index);

    React.useEffect(() => {
        if (should_reset_carousel) setCurrentIndex(0);
    }, [should_reset_carousel]);

    return (
        <ul className='carousel'>
            {pages.map(({ component, id }) => (
                <li
                    className='carousel__item'
                    style={{ transform: `translateX(-${current_index * 100}%)` }}
                    key={id}
                    onClick={onPageChange}
                >
                    {component(current_index ? onPrevClick : onNextClick)}
                </li>
            ))}
        </ul>
    );
};

export default Carousel;

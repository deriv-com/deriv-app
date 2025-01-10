import React from 'react';
import { useSwipeable } from 'react-swipeable';
import clsx from 'clsx';
import { getLanguage } from '@deriv/translations';
import CarouselHeader, { TQuillIcon } from './carousel-header';

type TCarousel = {
    classname?: string;
    current_index?: number;
    header?: typeof CarouselHeader;
    is_swipeable?: boolean;
    is_infinite_loop?: boolean;
    onNextButtonClick?: () => void;
    onPreviousButtonClick?: () => void;
    pages: { id: number; component: JSX.Element }[];
    previous_icon?: TQuillIcon;
    title?: React.ReactNode;
    next_icon?: TQuillIcon;
    setCurrentIndex?: (arg: number) => void;
};

const Carousel = ({
    classname,
    current_index,
    header,
    is_swipeable,
    is_infinite_loop,
    onNextButtonClick,
    onPreviousButtonClick,
    pages,
    previous_icon,
    title,
    next_icon,
    setCurrentIndex,
}: TCarousel) => {
    const [internalIndex, setInternalIndex] = React.useState(0);

    const HeaderComponent = header;

    const isControlled = current_index !== undefined && setCurrentIndex !== undefined;
    const index = isControlled ? current_index : internalIndex;
    const lang = getLanguage();
    const is_rtl = lang === 'AR';

    const handleNextClick = () => {
        if (!is_infinite_loop && index + 1 >= pages.length) return;
        const newIndex = (index + 1) % pages.length;
        isControlled ? setCurrentIndex?.(newIndex) : setInternalIndex(newIndex);
        onNextButtonClick?.();
    };

    const handlePrevClick = () => {
        if (!is_infinite_loop && index - 1 < 0) return;
        const newIndex = (index - 1 + pages.length) % pages.length;
        isControlled ? setCurrentIndex?.(newIndex) : setInternalIndex(newIndex);
        onPreviousButtonClick?.();
    };

    const swipe_handlers = useSwipeable({
        onSwipedLeft: handleNextClick,
        onSwipedRight: handlePrevClick,
    });

    return (
        <React.Fragment>
            {HeaderComponent && (
                <HeaderComponent
                    current_index={index}
                    onNextClick={handleNextClick}
                    onPrevClick={handlePrevClick}
                    previous_icon={previous_icon}
                    next_icon={next_icon}
                    title={title}
                />
            )}
            <ul
                className={clsx('carousel', classname)}
                data-testid='dt_carousel'
                {...(is_swipeable ? swipe_handlers : {})}
            >
                {pages.map(({ component, id }) => (
                    <li
                        className='carousel__item'
                        style={{ transform: `translateX(${index * 100 * (is_rtl ? 1 : -1)}%)` }}
                        key={id}
                    >
                        {component}
                    </li>
                ))}
            </ul>
        </React.Fragment>
    );
};

export default Carousel;

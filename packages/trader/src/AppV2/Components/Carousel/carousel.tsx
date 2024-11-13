import React from 'react';
import CarouselHeader, { TQuillIcon } from './carousel-header';
import { useSwipeable } from 'react-swipeable';
import clsx from 'clsx';

type TCarousel = {
    classname?: string;
    current_index?: number;
    header?: typeof CarouselHeader;
    is_swipeable?: boolean;
    is_infinite_loop?: boolean;
    pages: { id: number; component: JSX.Element }[];
    title?: React.ReactNode;
    previous_icon?: TQuillIcon;
    next_icon?: TQuillIcon;
    setCurrentIndex?: (arg: number) => void;
};

const Carousel = ({
    classname,
    current_index,
    header,
    is_swipeable,
    is_infinite_loop,
    pages,
    setCurrentIndex,
    title,
    previous_icon,
    next_icon,
}: TCarousel) => {
    const [internalIndex, setInternalIndex] = React.useState(0);

    const HeaderComponent = header;

    const isControlled = current_index !== undefined && setCurrentIndex !== undefined;
    const index = isControlled ? current_index : internalIndex;

    const handleNextClick = () => {
        if (!is_infinite_loop && index + 1 >= pages.length) return;
        const newIndex = (index + 1) % pages.length;
        isControlled ? setCurrentIndex?.(newIndex) : setInternalIndex(newIndex);
    };

    const handlePrevClick = () => {
        if (!is_infinite_loop && index - 1 < 0) return;
        const newIndex = (index - 1 + pages.length) % pages.length;
        isControlled ? setCurrentIndex?.(newIndex) : setInternalIndex(newIndex);
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
                    <li className='carousel__item' style={{ transform: `translateX(-${index * 100}%)` }} key={id}>
                        {component}
                    </li>
                ))}
            </ul>
        </React.Fragment>
    );
};

export default Carousel;

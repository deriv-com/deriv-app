import React from 'react';
import CarouselHeader from './carousel-header';
import clsx from 'clsx';

type TCarousel = {
    classname?: string;
    header: typeof CarouselHeader;
    pages: { id: number; component: JSX.Element }[];
    title?: React.ReactNode;
    current_index?: number;
    setCurrentIndex?: (arg: number) => void;
};

const Carousel = ({ classname, header, pages, current_index, setCurrentIndex, title }: TCarousel) => {
    const [internalIndex, setInternalIndex] = React.useState(0);

    const HeaderComponent = header;

    const isControlled = current_index !== undefined && setCurrentIndex !== undefined;
    const index = isControlled ? current_index : internalIndex;

    const handleNextClick = () => {
        const newIndex = (index + 1) % pages.length;
        isControlled ? setCurrentIndex?.(newIndex) : setInternalIndex(newIndex);
    };

    const handlePrevClick = () => {
        const newIndex = (index - 1 + pages.length) % pages.length;
        isControlled ? setCurrentIndex?.(newIndex) : setInternalIndex(newIndex);
    };

    return (
        <React.Fragment>
            <HeaderComponent
                current_index={index}
                onNextClick={handleNextClick}
                onPrevClick={handlePrevClick}
                title={title}
            />
            <ul className={clsx('carousel', classname)} data-testid='dt_carousel'>
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

import React, { useState, useEffect } from 'react';

type THeaderProps = {
    current_index: number;
    onPrevClick: () => void;
};
type TCarousel = {
    header: ({ current_index, onPrevClick }: THeaderProps) => JSX.Element;
    pages: { id: number; component: JSX.Element }[];
    current_index?: number;
    setCurrentIndex?: (index: number) => void;
};

const Carousel = ({ header, pages, current_index, setCurrentIndex }: TCarousel) => {
    const [internalIndex, setInternalIndex] = useState(0);

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
            {header({ current_index: index, onPrevClick: handlePrevClick })}
            <ul className='carousel'>
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

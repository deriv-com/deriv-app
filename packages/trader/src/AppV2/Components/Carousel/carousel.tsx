import React from 'react';

type THeaderProps = {
    current_index: number;
    onNextClick: () => void;
    onPrevClick: () => void;
};
type TCarousel = {
    header: ({ current_index, onNextClick, onPrevClick }: THeaderProps) => JSX.Element;
    pages: { id: number; component: JSX.Element }[];
};

const Carousel = ({ header, pages }: TCarousel) => {
    const [current_index, setCurrentIndex] = React.useState(0);

    const HeaderComponent = header;

    const onNextClick = () => setCurrentIndex((current_index + 1) % pages.length);
    const onPrevClick = () => setCurrentIndex((current_index - 1 + pages.length) % pages.length);

    return (
        <React.Fragment>
            <HeaderComponent current_index={current_index} onNextClick={onNextClick} onPrevClick={onPrevClick} />
            <ul className='carousel'>
                {pages.map(({ component, id }) => (
                    <li
                        className='carousel__item'
                        style={{ transform: `translateX(-${current_index * 100}%)` }}
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

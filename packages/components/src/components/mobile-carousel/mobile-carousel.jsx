import React from 'react';
import classNames from 'classnames';
import { Swipeable } from 'react-swipeable';
import Icon from '../icon';

export const MobileCarousel = ({ children, ...props }) => {
    const carousel_body = React.useRef();
    const [min_width, setMinWidth] = React.useState(0);
    const [index, setIndex] = React.useState(0);
    const [total_elements, setTotal] = React.useState(0);
    React.useEffect(() => {
        if (!carousel_body.current) return;

        setMinWidth(carousel_body.current.children[0].clientWidth + 1);
        carousel_body.current.scrollLeft = index * (min_width + 1);
        setTotal(React.Children.count(children));
    }, [index, min_width, carousel_body, children]);

    // Carousel is only active for more than 1 child items
    if (children.length <= 1) {
        return children;
    }

    const goPrev = () => {
        if (index !== 0) {
            setIndex(index - 1);
        }
    };

    const goNext = () => {
        if (index < total_elements - 1) {
            setIndex(index + 1);
        }
    };

    const goToIndex = idx => {
        setIndex(idx);
    };

    const swipedLeft = () => goNext();
    const swipedRight = () => goPrev();

    return (
        <div className='dc-carousel'>
            <div className='dc-carousel__row'>
                <div className='dc-carousel__pref'>
                    <Icon icon='IcChevronLeft' onClick={goPrev} />
                </div>
                <Swipeable
                    className={classNames('dc-carousel__view')}
                    onSwipedLeft={swipedLeft}
                    onSwipedRight={swipedRight}
                    {...props}
                >
                    <div className='dc-carousel__body' ref={carousel_body}>
                        {children}
                    </div>
                </Swipeable>
                <div className='dc-carousel__next' onClick={goNext}>
                    <Icon icon='IcChevronRight' />
                </div>
            </div>
            <div className='dc-carousel__footer'>
                {React.Children.map(children, (child, idx) => {
                    return (
                        <span
                            key={idx}
                            onClick={() => goToIndex(idx)}
                            color={idx === index ? 'active' : 'secondary'}
                            className={classNames('dc-carousel__circle', {
                                'dc-carousel__circle--is-active': idx === index,
                            })}
                        />
                    );
                })}
            </div>
        </div>
    );
};

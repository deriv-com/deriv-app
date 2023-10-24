import classNames from 'classnames';
import React from 'react';
import NewsTickerChildren from './news-ticker-children';

type TNewsTicker = {
    className?: string;
    speed: number;
};

const NewsTicker = ({ children, className, speed }: React.PropsWithChildren<TNewsTicker>) => {
    const [element_width, setElementWidth] = React.useState(-1);
    const [is_exceeding_parent, setIsExceedingParent] = React.useState(false);

    const onRefChange = (ref: HTMLDivElement) => {
        if (ref) {
            setIsExceedingParent(ref.scrollWidth > ref.clientWidth);

            if (element_width === -1) {
                setElementWidth(ref.scrollWidth);
            }
        }
    };

    const animation_duration = element_width / speed; // time = distance / speed

    return (
        <div className={classNames('dc-news-ticker', className)} ref={onRefChange}>
            <NewsTickerChildren
                animation_duration={animation_duration}
                is_exceeding_parent={is_exceeding_parent}
                react_children={children}
            />
            {is_exceeding_parent && (
                <NewsTickerChildren
                    animation_duration={animation_duration}
                    is_exceeding_parent={is_exceeding_parent}
                    is_second_container
                    react_children={children}
                />
            )}
        </div>
    );
};

export default NewsTicker;

import classNames from 'classnames';
import React from 'react';
import NewsTickerChildren from './news-ticker-children.jsx';

type NewsTickerProps = {
    children: React.ReactNode;
    className: string;
    speed: number;
};

const NewsTicker = ({ children, className, speed }: NewsTickerProps) => {
    const [element_width, setElementWidth] = React.useState(-1);
    const [is_exceeding_parent, setIsExceedingParent] = React.useState(false);

    const onRefChange = ref => {
        if (ref) {
            setIsExceedingParent(ref.scrollWidth > ref.clientWidth);

            if (element_width === -1) {
                setElementWidth(ref.scrollWidth);
            }
        }
    };

    const animation_duration = element_width / speed; // time = distance / speed

    return (
        <div className={classNames(className, 'dc-news-ticker')} ref={onRefChange}>
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

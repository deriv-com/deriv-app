import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import NewsTickerChildren from './news-ticker-children.jsx';

const NewsTicker = ({ children, className, speed }) => {
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

NewsTicker.propTypes = {
    children: PropTypes.any.isRequired,
    className: PropTypes.string,
    speed: PropTypes.number.isRequired,
};

export default NewsTicker;

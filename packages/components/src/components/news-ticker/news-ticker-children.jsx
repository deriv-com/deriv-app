import PropTypes from 'prop-types';
import React from 'react';

const NewsTickerChildren = ({
    animation_duration,
    is_exceeding_parent,
    is_second_container,
    react_children: children,
}) => (
    <div
        className='dc-news-ticker__children'
        style={
            is_exceeding_parent
                ? {
                      animationDuration: `${animation_duration}s`,
                      animationDelay: is_second_container ? `-${animation_duration}s` : `-${animation_duration / 2}s`,
                  }
                : undefined
        }
    >
        {React.Children.map(children, (child, idx) => (
            <div className='dc-news-ticker__item' key={`news-ticker-item-${idx}`}>
                {child}
            </div>
        ))}
    </div>
);

NewsTickerChildren.displayName = 'NewsTickerChildren';
NewsTickerChildren.propTypes = {
    animation_duration: PropTypes.number.isRequired,
    is_exceeding_parent: PropTypes.bool.isRequired,
    is_second_container: PropTypes.bool,
    react_children: PropTypes.any.isRequired,
};

export default NewsTickerChildren;

import React from 'react';

type TNewsTickerChildren = {
    animation_duration: number;
    is_exceeding_parent?: boolean;
    is_second_container?: boolean;
    react_children: React.ReactNode;
};

const NewsTickerChildren = ({
    animation_duration,
    is_exceeding_parent,
    is_second_container,
    react_children: children,
}: TNewsTickerChildren) => (
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

export default NewsTickerChildren;

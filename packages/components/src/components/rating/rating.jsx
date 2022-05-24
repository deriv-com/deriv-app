import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Text from '../text';

const Rating = ({
    allow_half_rating = false,
    background_class,
    direction = 'ltr',
    disable_hover = false,
    default_content,
    element_class,
    icon_selected,
    icon_unselected,
    max_rating = 5,
    onClick,
    readonly = false,
    show_rating = false,
    value,
}) => {
    const [enabled_rate_index, setEnabledRateIndex] = React.useState(-1);
    const [hovered_rate_index, setHoveredRateIndex] = React.useState(-1);
    const [is_hover_enabled, setIsHoverEnabled] = React.useState(false);
    const ratingContainerRef = React.useRef(null);

    const calculateRating = e => {
        const { width, left, right } = ratingContainerRef.current.getBoundingClientRect();
        const rating_start_element = direction === 'ltr' ? e.clientX - left : right - e.clientX;
        const selected_rating = (rating_start_element / width) * max_rating;
        if (selected_rating > 0.4) {
            const calculated_rating = allow_half_rating
                ? Math.round(selected_rating / 0.5) * 0.5 // This will always make sure that, if we hover between two ratings, it will select the nearest number
                : Math.round(selected_rating);
            return calculated_rating;
        }
        return 0;
    };

    const handleClick = e => {
        if (readonly) {
            return;
        }
        setIsHoverEnabled(false);
        const rating_value = calculateRating(e);
        setEnabledRateIndex(rating_value);
        onClick(rating_value);
    };

    const handleMouseMove = e => {
        if (readonly || disable_hover) {
            return;
        }
        setIsHoverEnabled(true);
        setHoveredRateIndex(calculateRating(e));
    };

    const handleMouseLeave = () => {
        if (readonly || disable_hover) {
            return;
        }
        setHoveredRateIndex(-1); // Reset to default state
        setIsHoverEnabled(false);
    };

    const validateInitialValue = () => {
        if (value < 0 || value > max_rating) {
            setEnabledRateIndex(0);
        } else {
            const set_value = allow_half_rating ? parseFloat(value) : parseInt(value);
            setEnabledRateIndex(set_value);
        }
    };

    React.useEffect(() => {
        validateInitialValue();
    }, [value, max_rating]);

    if (!!default_content && value <= 0) {
        return default_content;
    }

    return (
        <div className='user-rating'>
            <div
                className={classNames('user-rating__wrapper', background_class)}
                style={{ direction }}
                ref={ratingContainerRef}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {[...new Array(parseInt(max_rating))].map((_, index) => {
                    const active_rate = is_hover_enabled ? hovered_rate_index : enabled_rate_index;
                    const show_empty_icon = active_rate === -1 || active_rate < index + 1;
                    const is_rating_with_precision = active_rate % 1 !== 0;
                    const is_rating_equal_to_index = Math.round(active_rate) === index + 1;
                    const show_rating_with_precision = is_rating_with_precision && is_rating_equal_to_index;
                    return (
                        <div className={classNames('user-rating__element', element_class)} key={index}>
                            <section
                                className={classNames('user-rating__element--filled')}
                                style={{
                                    width: show_rating_with_precision ? `${(active_rate % 1) * 100}%` : '0%',
                                }}
                            >
                                {icon_selected}
                            </section>
                            <section>{show_empty_icon ? icon_unselected : icon_selected}</section>
                        </div>
                    );
                })}
            </div>
            {show_rating && <Text>{parseFloat(enabled_rate_index).toFixed(1)}</Text>}
        </div>
    );
};

Rating.propTypes = {
    allow_half_rating: PropTypes.bool, // Allows user to rate in steps of 0.5
    background_class: PropTypes.string,
    direction: PropTypes.oneOf(['ltr', 'rtl']),
    disable_hover: PropTypes.bool,
    default_content: PropTypes.element, // Content to be rendered when rating values are not required/available
    element_class: PropTypes.string,
    icon_selected: PropTypes.element.isRequired,
    icon_unselected: PropTypes.element.isRequired,
    max_rating: PropTypes.number,
    onClick: PropTypes.func,
    readonly: PropTypes.bool,
    show_rating: PropTypes.bool,
    value: PropTypes.number,
};

export default Rating;

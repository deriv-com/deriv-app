import React from 'react';
import classNames from 'classnames';
import { useSwipeable } from 'react-swipeable';
import Card from './carousel-card';
import Nav from './carousel-nav';
import Icon from '../icon';
import Button from '../button/button';
import { useInterval } from '../../hooks';

type TCarousel = {
    active_bullet_color?: string;
    autoplay_time?: number | null;
    bullet_color?: string;
    bullet_position?: 'bottom' | 'top';
    className?: string;
    disable_swipe?: boolean;
    initial_index?: number;
    is_mt5?: boolean;
    item_per_window?: number;
    list: React.ReactNode[];
    nav_position?: 'top' | 'middle' | 'bottom';
    onItemSelect?: (active_index: number) => void;
    show_bullet?: boolean;
    show_nav?: boolean;
    width?: number;
};

const Carousel = ({
    active_bullet_color = 'var(--text-prominent)',
    autoplay_time = null,
    bullet_color = 'var(--text-less-prominent)',
    bullet_position = 'bottom',
    className,
    disable_swipe = false,
    initial_index = 0,
    is_mt5,
    item_per_window = 1,
    list,
    nav_position = 'bottom',
    onItemSelect,
    show_bullet = true,
    show_nav = true,
    width = 400,
}: TCarousel) => {
    const [active_index, setActiveIndex] = React.useState<number>(initial_index);
    const computed_item_per_window = React.useMemo<number>(() => {
        return Math.min(item_per_window, list.length);
    }, [item_per_window, list]);
    const sliced_list_length = list.slice(computed_item_per_window - 1).length;

    React.useEffect(() => {
        if (list.slice(computed_item_per_window - 1).length <= 1) {
            setActiveIndex(0);
        }
    }, [list, computed_item_per_window]);

    const handleNextClick = () => {
        const next_idx = active_index + 1;
        const has_reached_end = next_idx === list.length - computed_item_per_window + 1;

        if (!has_reached_end) {
            setActiveIndex(next_idx);
        } else {
            setActiveIndex(0);
        }
    };

    const handlePrevClick = () => {
        const prev_idx = active_index - 1;

        if (prev_idx > -1) {
            setActiveIndex(prev_idx);
        } else {
            setActiveIndex(list.length - computed_item_per_window);
        }
    };

    useInterval(handleNextClick, autoplay_time);

    React.useEffect(() => {
        if (onItemSelect) onItemSelect(active_index);
    }, [active_index, onItemSelect]);

    const swipe_handlers = useSwipeable({
        onSwipedLeft: handleNextClick,
        onSwipedRight: handlePrevClick,
    });

    return (
        <div {...(disable_swipe ? {} : swipe_handlers)} className={className}>
            <div className={classNames('dc-carousel', { 'dc-carousel--mt5': is_mt5 })}>
                {sliced_list_length > 1 && (
                    <Nav
                        active_index={active_index}
                        bullet_color={bullet_color}
                        active_bullet_color={active_bullet_color}
                        className='dc-carousel__nav--upper'
                        handleNextClick={handleNextClick}
                        handlePrevClick={handlePrevClick}
                        handleNavigationClick={setActiveIndex}
                        show_bullet={show_bullet && bullet_position === 'top'}
                        show_nav={show_nav && nav_position === 'top'}
                        list={list}
                        item_per_window={computed_item_per_window}
                    />
                )}
                <div className='dc-carousel__container'>
                    {show_nav && nav_position === 'middle' && sliced_list_length > 1 && (
                        <Button
                            className={classNames('dc-carousel__icon', { 'dc-carousel__icon--mt5': is_mt5 })}
                            onClick={handlePrevClick}
                            icon={
                                <Icon
                                    icon={is_mt5 ? 'IcChevronLeftBoldMt5' : 'IcChevronLeft'}
                                    size={is_mt5 ? '28' : '24'}
                                />
                            }
                        />
                    )}

                    <div
                        className={classNames('dc-carousel__box', {
                            'dc-carousel__box--mt5': is_mt5 && sliced_list_length > 1,
                        })}
                        style={{
                            width: `${computed_item_per_window * width}px`,
                        }}
                    >
                        <div
                            className={classNames('dc-carousel__wrapper', { 'dc-carousel__wrapper--mt5': is_mt5 })}
                            style={{ transform: `translate3d(-${width * active_index}px, 0, 0)` }}
                        >
                            {list.map((type, idx) => (
                                <Card key={idx} width={width}>
                                    {list[idx]}
                                </Card>
                            ))}
                        </div>
                    </div>

                    {show_nav && nav_position === 'middle' && sliced_list_length > 1 && (
                        <Button
                            className={classNames('dc-carousel__icon', { 'dc-carousel__icon--mt5': is_mt5 })}
                            onClick={handleNextClick}
                            icon={
                                <Icon
                                    icon={is_mt5 ? 'IcChevronRightBoldMt5' : 'IcChevronRight'}
                                    size={is_mt5 ? '28' : '24'}
                                />
                            }
                        />
                    )}
                </div>
                {sliced_list_length > 1 && (
                    <Nav
                        active_index={active_index}
                        bullet_color={bullet_color}
                        active_bullet_color={active_bullet_color}
                        className={classNames({ 'dc-carousel__nav--lower': list.length < 5 })}
                        handleNextClick={handleNextClick}
                        handlePrevClick={handlePrevClick}
                        handleNavigationClick={setActiveIndex}
                        show_bullet={show_bullet && bullet_position === 'bottom'}
                        show_nav={show_nav && nav_position === 'bottom'}
                        list={list}
                        item_per_window={computed_item_per_window}
                    />
                )}
            </div>
        </div>
    );
};

export default Carousel;

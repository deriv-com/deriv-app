import React from 'react';
import classNames from 'classnames';
import Icon from '../icon';

type TNav = {
    active_index: number;
    active_bullet_color: string;
    bullet_color: string;
    className?: string;
    handleNextClick: () => void;
    handlePrevClick: () => void;
    handleNavigationClick: (index: number) => void;
    list: React.ReactNode[];
    show_bullet: boolean;
    show_nav: boolean;
    item_per_window: number;
};

const Nav = ({
    active_index,
    active_bullet_color,
    bullet_color,
    className,
    handleNextClick,
    handlePrevClick,
    handleNavigationClick,
    list,
    show_bullet,
    show_nav,
    item_per_window,
}: TNav) => {
    if (!show_bullet && !show_nav) return null;

    return (
        <nav id='dt_components_carousel-nav_nav-tag' className={classNames('dc-carousel__nav', className)}>
            {show_nav && (
                <span id='dt_contract_info_left_nav' className='dc-carousel__icon' onClick={handlePrevClick}>
                    <Icon icon='IcChevronLeft' />
                </span>
            )}
            {show_bullet && (
                <ul className='dc-carousel__nav-list'>
                    <li
                        className={classNames('dc-carousel__nav-item', 'dc-carousel__nav-item--active')}
                        style={{
                            transform: `translate3d(${24 * active_index}px, 0, 0)`,
                            backgroundColor: active_bullet_color,
                        }}
                    />
                    {list.slice(item_per_window - 1).map((_, idx) => (
                        <li
                            key={idx}
                            className='dc-carousel__nav-item'
                            style={{
                                backgroundColor: bullet_color,
                            }}
                            onClick={() => handleNavigationClick(idx)}
                        />
                    ))}
                </ul>
            )}
            {show_nav && (
                <span id='dt_contract_info_right_nav' className='dc-carousel__icon' onClick={handleNextClick}>
                    <Icon icon='IcChevronRight' />
                </span>
            )}
        </nav>
    );
};

export default React.memo(Nav);

import React from 'react';
import { Icon } from '@deriv/components';

type PrevNextButtonProps = {
    enabled: boolean;
    nav_action: 'prev' | 'next';
    onClick: () => void;
};

export const CarouselButton: React.FC<PrevNextButtonProps> = props => {
    const { enabled, onClick, nav_action } = props;
    const icon = nav_action === 'prev' ? 'IcChevronLeftBold' : 'IcChevronRightBold';
    const className = nav_action === 'prev' ? 'carousel__btn carousel__btn-prev' : 'carousel__btn carousel__btn-next';

    return (
        <button className={className} onClick={onClick} disabled={!enabled}>
            <Icon icon={icon} className='carousel-btn__icon' />
        </button>
    );
};

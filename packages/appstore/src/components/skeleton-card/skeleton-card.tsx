import React from 'react';
import { Text, Icon } from '@deriv/components';
import './skeleton-card.scss';

type TSkeletonCardProps = {
    onClick?: () => void;
    label?: string;
    should_highlight?: boolean;
    is_add_card?: boolean;
};

const SkeletonCard = (props: TSkeletonCardProps) => {
    const { label, onClick, is_add_card, should_highlight } = props;

    const border_style = {
        '--stroke-border': should_highlight ? 'var(--brand-red-coral)' : 'var(--border-normal)',
        '--stroke-dasharray': is_add_card ? '8 8' : '6 6',
        '--stroke-width': is_add_card ? 1 : 2,
    };

    return (
        <div className='skeleton-card ' onClick={onClick}>
            <div className='skeleton-card__background'>
                <Icon icon='IcAppstoreSkeletonCardBorder' style={border_style} />
            </div>
            {label && !is_add_card && (
                <Text className='skeleton-card__label' size='xs' lh='xl'>
                    {label}
                </Text>
            )}
            {is_add_card && <Icon icon='IcAddCircle' size='32' />}
        </div>
    );
};

export default SkeletonCard;

import React from 'react';
import './WalletsAccordionLoader.scss';

const WalletsAccordionLoader = () => {
    return (
        <div className='wallets-accordion-loader'>
            <div className='wallets-skeleton wallets-accordion-loader__item' />
            <div className='wallets-skeleton wallets-accordion-loader__item wallets-accordion-loader__item-expanded' />
            <div className='wallets-skeleton wallets-accordion-loader__item' />
        </div>
    );
};

export default WalletsAccordionLoader;

import React from 'react';

const TradingAppCardLoader = () => (
    <div className='flex flex-col gap-24 py-1'>
        <div className='flex flex-row align-middle gap-14'>
            <div className='rounded-lg animate-pulse bg-system-light-hover-background w-50 h-50' />
            <div className='flex flex-col gap-10'>
                <div className='animate-pulse bg-system-light-hover-background h-14 rounded-xs w-60' />
                <div className='animate-pulse bg-system-light-hover-background h-24 rounder-xs w-[200px]' />
            </div>
        </div>
    </div>
);

export default TradingAppCardLoader;

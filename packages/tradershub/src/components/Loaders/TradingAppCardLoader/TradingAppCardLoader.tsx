import React from 'react';

const TradingAppCardLoader = () => (
    <div className='flex flex-col gap-1200 py-75 px-50'>
        <div className='flex flex-row gap-700 align-middle'>
            <div className='animate-pulse bg-solid-slate-100 w-2500 h-2500 rounded-500' />
            <div className='flex flex-col gap-500'>
                <div className='animate-pulse bg-solid-slate-100 h-700 rounded-100 w-3000' />
                <div className='animate-pulse bg-solid-slate-100 h-1200 rounder-100 w-[200px]' />
            </div>
        </div>
    </div>
);

export default TradingAppCardLoader;

import React from 'react';

const TradingAppCardLoader = () => {
    return (
        <div className='flex flex-col gap-1200 py-75 px-50'>
            <div className='flex flex-row gap-700 align-middle'>
                <div className='w-2500 h-2500 border-r-[10px]' />
                <div className='flex flex-col gap-500'>
                    <div className='animate-pulse bg-solid-slate-100 h-700 rounded-100 w-3000' />
                    <div className='animate-pulse bg-solid-slate-100 h-1200 rounder-100 w-[200px]' />
                </div>
            </div>
        </div>
    );
};

export default TradingAppCardLoader;

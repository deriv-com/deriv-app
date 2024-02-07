import React from 'react';
import TradingAppCardSkeleton from './tradingAppSkeleton';
import HeaderSkeleton from './headerSkeleton';
import TitleSkeleton from './titleSkeleton';
import TotalAssetSkeleton from './totalAssetSkeleton';
import OptionsAndMultipliersSkeleton from './optionsAndMultipliers';
import CfdAppSkeleton from './cfdAppSkeleton';
import Mt5TitleLSkeleton from './mt5TitleSkeleton';
import CFDToggleSkeleton from './cfdToggleSkeleton';
import './onbordingSkeleton.scss';

const OnboardingSkeleton = () => {
    return (
        <div className='onboarding-skeleton'>
            <div className='onboarding-skeleton__header'>
                <HeaderSkeleton />
            </div>
            <div className='onboarding-skeleton__content'>
                <div className='onboarding-skeleton__content--title-bar'>
                    <TitleSkeleton />
                    <TotalAssetSkeleton />
                    <CFDToggleSkeleton />
                </div>
                <div className='onboarding-skeleton__content--options'>
                    <OptionsAndMultipliersSkeleton />
                    <div className='onboarding-skeleton__content--options--platforms'>
                        <TradingAppCardSkeleton />
                        <TradingAppCardSkeleton />
                        <TradingAppCardSkeleton />
                    </div>
                </div>
                <div className='onboarding-skeleton__content--cfds'>
                    <CfdAppSkeleton />
                    <Mt5TitleLSkeleton />
                    <div className='onboarding-skeleton__content--cfds--platforms'>
                        <TradingAppCardSkeleton />
                        <TradingAppCardSkeleton />
                        <TradingAppCardSkeleton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingSkeleton;

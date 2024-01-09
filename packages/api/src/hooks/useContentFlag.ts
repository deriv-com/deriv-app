import { useEffect, useState } from 'react';
import useActiveTradingAccount from './useActiveTradingAccount';
import useLandingCompany from './useLandingCompany';
import useIsEuRegion from './useIsEuRegion';

const useContentFlag = () => {
    const { data: activeTrading } = useActiveTradingAccount();
    const { data, isSuccess } = useLandingCompany();
    const { data: isEuRegion } = useIsEuRegion();

    const financialCompany = data?.financial_company;
    const gamingCompany = data?.gaming_company;
    const isDemo = activeTrading?.is_virtual ?? false;

    const [contentFlag, setContentFlag] = useState('');

    useEffect(() => {
        if (isSuccess) {
            //this is a conditional check for countries like Australia/Norway which fulfills one of these following conditions
            const restricted_countries = financialCompany?.shortcode === 'svg' && gamingCompany?.shortcode === 'svg';

            if (!activeTrading) setContentFlag('');
            else if (!gamingCompany?.shortcode && financialCompany?.shortcode === 'maltainvest') {
                setContentFlag(isDemo ? 'euDemo' : 'euReal');
            } else if (financialCompany?.shortcode === 'maltainvest' && gamingCompany?.shortcode === 'svg' && !isDemo) {
                setContentFlag(isEuRegion ? 'lowRiskCrEu' : 'lowRiskCrNonEu');
            } else if (
                ((financialCompany?.shortcode === 'svg' && gamingCompany?.shortcode === 'svg') ||
                    restricted_countries) &&
                !isDemo
            ) {
                setContentFlag('highRiskCr');
            } else if (isEuRegion) {
                setContentFlag(isDemo ? 'euDemo' : 'euReal');
            } else if (isDemo) setContentFlag('crDemo');
            else setContentFlag('lowRiskCrNonEu');
        }
    }, [activeTrading, financialCompany?.shortcode, gamingCompany?.shortcode, isDemo, isEuRegion, isSuccess]);

    return contentFlag;
};

export default useContentFlag;

import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveTradingAccount, useIsEuRegion } from '@deriv/api';
import { Button, useBreakpoint } from '@deriv/quill-design';
import { optionsAndMultipliersContent } from '../../../constants/constants';
import { getStaticUrl, getUrlBinaryBot, getUrlSmartTrader } from '../../../helpers/urls';
import useRegulationFlags from '../../../hooks/useRegulationFlags';
import { TradingAppCardLoader } from '../../Loaders';
import { TradingAccountCard, TradingAccountCardContent } from '../../TradingAccountCard';
import { useUIContext } from '../../UIProvider';

type OptionsAndMultipliersContentItem = {
    description: string;
    icon: JSX.Element;
    isExternal?: boolean;
    redirect: string;
    smallIcon: JSX.Element;
    title: string;
};

type TShowButtonProps = Pick<OptionsAndMultipliersContentItem, 'isExternal' | 'redirect'>;

type TLinkTitleProps = Pick<OptionsAndMultipliersContentItem, 'icon' | 'title'>;

const LinkTitle = ({ icon, title }: TLinkTitleProps) => {
    const handleClick = (
        event:
            | React.KeyboardEvent<HTMLButtonElement>
            | React.MouseEvent<HTMLButtonElement, MouseEvent>
            | React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.persist();
        switch (title) {
            case 'Deriv Trader':
                window.open(getStaticUrl(`/dtrader`));
                break;
            case 'Deriv Bot':
                window.open(getStaticUrl(`/dbot`));
                break;
            case 'SmartTrader':
                window.open(getUrlSmartTrader());
                break;
            case 'Binary Bot':
                window.open(getUrlBinaryBot());
                break;
            case 'Deriv GO':
                window.open(getStaticUrl('/deriv-go'));
                break;
            default:
                break;
        }
    };
    return (
        // Had to result to button instead of div because of sonarcloud
        <button
            className='cursor-pointer'
            onClick={event => handleClick(event)}
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    handleClick(event);
                }
            }}
        >
            {icon}
        </button>
    );
};

const ShowOpenButton = ({ isExternal, redirect }: TShowButtonProps) => {
    const history = useHistory();

    const { data } = useActiveTradingAccount();
    if (data?.loginid) {
        return (
            <Button
                className='rounded-200'
                onClick={() => {
                    if (isExternal) {
                        window.open(redirect, '_blank');
                    } else {
                        history.push(redirect);
                    }
                }}
            >
                Open
            </Button>
        );
    }
    return null;
};

/**
 *  `OptionsAndMultipliersContent` is a component that renders the internal deriv trading platforms.
 * @returns {React.ElementType} The `OptionsAndMultipliersContent` component.
 */
const OptionsAndMultipliersContent = () => {
    const { isMobile } = useBreakpoint();
    const { data } = useActiveTradingAccount();
    const { isSuccess: isRegulationAccessible } = useIsEuRegion();

    const { getUIState } = useUIContext();
    const activeRegulation = getUIState('regulation');

    const { isEU } = useRegulationFlags(activeRegulation);

    const getoptionsAndMultipliersContent = optionsAndMultipliersContent(isEU ?? false);

    const filteredContent = isEU
        ? getoptionsAndMultipliersContent.filter(account => account.title === 'Deriv Trader')
        : getoptionsAndMultipliersContent;

    if (!isRegulationAccessible)
        return (
            <div className='pt-2000'>
                <TradingAppCardLoader />
            </div>
        );

    return (
        <div className='grid w-full grid-cols-1 gap-200 lg:grid-cols-3 lg:gap-x-1200 lg:gap-y-200'>
            {filteredContent.map(account => {
                const { description, icon, isExternal, redirect, smallIcon, title } = account;

                const trailingComponent = () => <ShowOpenButton isExternal={isExternal} redirect={redirect} />;

                const leadingComponent = () => (
                    <LinkTitle icon={data?.loginid || !isMobile ? icon : smallIcon} title={title} />
                );

                return (
                    <TradingAccountCard
                        {...account}
                        key={`trading-account-card-${title}`}
                        leading={leadingComponent}
                        trailing={trailingComponent}
                    >
                        <TradingAccountCardContent title={title}>{description}</TradingAccountCardContent>
                    </TradingAccountCard>
                );
            })}
        </div>
    );
};

export default OptionsAndMultipliersContent;

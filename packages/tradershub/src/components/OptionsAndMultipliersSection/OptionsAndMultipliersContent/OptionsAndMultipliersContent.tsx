import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveTradingAccount, useIsEuRegion } from '@deriv/api';
import { Button, Text, useBreakpoint } from '@deriv/quill-design';
import { optionsAndMultipliersContent } from '../../../constants/constants';
import { getStaticUrl, getUrlBinaryBot, getUrlSmartTrader } from '../../../helpers/urls';
import { TradingAppCardLoader } from '../../Loaders';
import { TradingAccountCard } from '../../TradingAccountCard';

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
    const { isEU, isSuccess } = useIsEuRegion();

    const getoptionsAndMultipliersContent = optionsAndMultipliersContent(isEU || false);

    const filteredContent = isEU
        ? getoptionsAndMultipliersContent.filter(account => account.title === 'Deriv Trader')
        : getoptionsAndMultipliersContent;

    if (!isSuccess)
        return (
            <div className='pt-2000'>
                <TradingAppCardLoader />
            </div>
        );

    return (
        <div className='grid w-full grid-cols-1 gap-200 lg:grid-cols-3 lg:gap-x-1200 lg:gap-y-200'>
            {filteredContent.map(account => {
                const trailingComponent = () => (
                    <ShowOpenButton isExternal={account.isExternal} redirect={account.redirect} />
                );

                const leadingComponent = () => (
                    <LinkTitle icon={data?.loginid || !isMobile ? account.icon : account.smallIcon} title={title} />
                );

                const title = account.title;
                return (
                    <TradingAccountCard
                        {...account}
                        key={`trading-account-card-${account.title}`}
                        leading={leadingComponent}
                        trailing={trailingComponent}
                    >
                        <div className='flex flex-col flex-grow'>
                            <Text bold size='sm'>
                                {account.title}
                            </Text>
                            <Text className='text-[12px]'>{account.description}</Text>
                        </div>
                    </TradingAccountCard>
                );
            })}
        </div>
    );
};

export default OptionsAndMultipliersContent;

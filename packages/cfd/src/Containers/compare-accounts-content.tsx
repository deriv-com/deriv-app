import React from 'react';
import { Table, Text, ThemedScrollbars, Div100vhContainer } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, CFD_PLATFORMS, isLandingCompanyEnabled } from '@deriv/shared';
import { LandingCompany } from '@deriv/api-types';

type TCFDAttributeDescriberProps = {
    name: string;
    counter: number | null;
};

type TFilterAvailableAccounts = (
    landing_companies: LandingCompany,
    table: TAccountsDescription[],
    is_logged_in: boolean,
    is_eu_client: boolean,
    platform: string,
    is_australian: boolean
) => Array<{ [key: string]: string | React.ReactNode | undefined }>;

type TAccountsDescription = {
    attribute: string;
    mt5: TDxTradeAccountsDescription & { financial_stp: string };
    dxtrade: TDxTradeAccountsDescription;
};

type TDxTradeAccountsDescription = {
    synthetic: string;
    synthetic_eu: string;
    financial: string;
    financial_au: string;
    financial_eu: string | React.ReactNode;
    footnote: string | null;
};

type TCompareAccountsReusedProps = {
    landing_companies: LandingCompany;
    platform: string;
    is_logged_in: boolean;
    is_uk: boolean;
};

type TCompareAccountsDataParams = TCompareAccountsReusedProps & {
    is_eu_client: boolean;
    residence: string;
};

type TCFDCompareAccountHintProps = TCompareAccountsReusedProps & {
    show_risk_message: boolean;
};

type TModalContentProps = TCompareAccountsReusedProps & {
    is_eu_client: boolean;
    residence: string;
    is_eu: boolean;
};

type TGetAccounts = (params: TCompareAccountsReusedProps) => TAccountsDescription[];

type TAccountTypesToFilter = (
    | NonNullable<LandingCompany['mt_gaming_company']>['financial']
    | NonNullable<LandingCompany['mt_financial_company']>['financial']
    | NonNullable<LandingCompany['mt_financial_company']>['financial_stp']
    | LandingCompany['dxtrade_gaming_company']
    | LandingCompany['dxtrade_financial_company']
    | boolean
    | undefined
)[];

const getAccounts: TGetAccounts = ({ landing_companies, platform, is_logged_in, is_uk }) => {
    const getLoggedOutTypesCount = () => (platform === CFD_PLATFORMS.MT5 ? 3 : 2);
    const getLoggedInTypesCount = () =>
        (
            (platform === CFD_PLATFORMS.MT5
                ? [
                      landing_companies?.mt_gaming_company?.financial,
                      landing_companies?.mt_financial_company?.financial,
                      landing_companies?.mt_financial_company?.financial_stp && platform === CFD_PLATFORMS.MT5,
                  ]
                : [
                      landing_companies?.dxtrade_gaming_company,
                      landing_companies?.dxtrade_financial_company,
                  ]) as TAccountTypesToFilter
        ).filter(Boolean).length;

    const account_types_count = is_logged_in ? getLoggedInTypesCount() : getLoggedOutTypesCount();
    const financial_eu_trading_instruments = is_uk ? (
        <div>
            {localize('Forex, stocks, stock indices, cryptocurrencies')}
            <Text size='s' weight='bold' className='cfd-compare-accounts__star'>
                **
            </Text>
            {localize(', synthetic indices')}
        </div>
    ) : (
        localize('Forex, stocks, stock indices, cryptocurrencies, synthetic indices')
    );

    return [
        {
            attribute: localize('Account currency'),
            mt5: {
                synthetic: localize('USD'),
                synthetic_eu: localize('EUR'),
                financial: localize('USD'),
                financial_au: localize('USD'),
                financial_eu: localize('EUR/GBP/USD'),
                financial_stp: localize('USD'),
                footnote: null,
            },
            dxtrade: {
                synthetic: localize('USD'),
                synthetic_eu: localize('EUR'),
                financial: localize('USD'),
                financial_au: localize('USD'),
                financial_eu: localize('EUR/GBP'),
                footnote: null,
            },
        },
        {
            attribute: localize('Maximum leverage'),
            mt5: {
                synthetic: localize('Up to 1:1000'),
                synthetic_eu: localize('Up to 1:1000'),
                financial: localize('Up to 1:1000'),
                financial_au: localize('Up to 1:30'),
                financial_eu: localize('Up to 1:30'),
                financial_stp: localize('Up to 1:100'),
                footnote: localize(
                    'Leverage gives you the ability to trade a larger position using your existing capital. Leverage varies across different symbols.'
                ),
            },
            dxtrade: {
                synthetic: localize('Up to 1:1000'),
                synthetic_eu: localize('Up to 1:1000'),
                financial: localize('Up to 1:1000'),
                financial_au: localize('Up to 1:30'),
                financial_eu: localize('Up to 1:30'),
                footnote: localize(
                    'Leverage gives you the ability to trade a larger position using your existing capital. Leverage varies across different symbols.'
                ),
            },
        },
        {
            attribute: localize('Order execution'),
            mt5: {
                synthetic: localize('Market'),
                synthetic_eu: localize('Market'),
                financial: localize('Market'),
                financial_au: localize('Market'),
                financial_eu: localize('Market'),
                financial_stp: localize('Market'),
                footnote: localize(
                    "All {{count}} account types use market execution. This means you agree with the broker's price in advance and will place orders at the broker's price.",
                    {
                        count: account_types_count,
                    }
                ),
            },
            dxtrade: {
                synthetic: localize('Market'),
                synthetic_eu: localize('Market'),
                financial: localize('Market'),
                financial_au: localize('Market'),
                financial_eu: localize('Market'),
                footnote: localize(
                    "All {{count}} account types use market execution. This means you agree with the broker's price in advance and will place orders at the broker's price.",
                    {
                        count: account_types_count,
                    }
                ),
            },
        },
        {
            attribute: localize('Spread'),
            mt5: {
                synthetic: localize('Fixed/Variable'),
                synthetic_eu: localize('Fixed/Variable'),
                financial: localize('Variable'),
                financial_au: localize('Variable'),
                financial_eu: localize('Fixed/Variable'),
                financial_stp: localize('Variable'),
                footnote: localize(
                    "The spread is the difference between the buy price and sell price. A variable spread means that the spread is constantly changing, depending on market conditions. A fixed spread remains constant but is subject to alteration, at the Broker's absolute discretion."
                ),
            },
            dxtrade: {
                synthetic: localize('Fixed/Variable'),
                synthetic_eu: localize('Fixed/Variable'),
                financial: localize('Variable'),
                financial_au: localize('Variable'),
                financial_eu: localize('Variable'),
                footnote: localize(
                    "The spread is the difference between the buy price and sell price. A variable spread means that the spread is constantly changing, depending on market conditions. A fixed spread remains constant but is subject to alteration, at the Broker's absolute discretion."
                ),
            },
        },
        {
            attribute: localize('Commission'),
            mt5: {
                synthetic: localize('No'),
                synthetic_eu: localize('No'),
                financial: localize('No'),
                financial_au: localize('No'),
                financial_eu: localize('No'),
                financial_stp: localize('No'),
                footnote: localize('Deriv charges no commission across all account types.'),
            },
            dxtrade: {
                synthetic: localize('No'),
                synthetic_eu: localize('No'),
                financial: localize('No'),
                financial_au: localize('No'),
                financial_eu: localize('No'),
                footnote: localize('Deriv charges no commission across all account types.'),
            },
        },
        {
            attribute: localize('Minimum deposit'),
            mt5: {
                synthetic: localize('No'),
                synthetic_eu: localize('No'),
                financial: localize('No'),
                financial_au: localize('No'),
                financial_eu: localize('No'),
                financial_stp: localize('No'),
                footnote: null,
            },
            dxtrade: {
                synthetic: localize('No'),
                synthetic_eu: localize('No'),
                financial: localize('No'),
                financial_au: localize('No'),
                financial_eu: localize('No'),
                footnote: null,
            },
        },
        {
            attribute: localize('Margin call'),
            mt5: {
                synthetic: localize('100%'),
                synthetic_eu: localize('100%'),
                financial: localize('100%'),
                financial_au: localize('100%'),
                financial_eu: localize('100%'),
                financial_stp: localize('100%'),
                footnote: localize(
                    'You’ll get a warning, known as margin call, if your account balance drops down close to the stop out level.'
                ),
            },
            dxtrade: {
                synthetic: localize('100%'),
                synthetic_eu: localize('100%'),
                financial: localize('100%'),
                financial_au: localize('100%'),
                financial_eu: localize('100%'),
                footnote: localize(
                    'You’ll get a warning, known as margin call, if your account balance drops down close to the stop out level.'
                ),
            },
        },
        {
            attribute: localize('Stop out level'),
            mt5: {
                synthetic: localize('50%'),
                synthetic_eu: localize('50%'),
                financial: localize('50%'),
                financial_au: localize('50%'),
                financial_eu: localize('50%'),
                financial_stp: localize('50%'),
                footnote: localize(
                    "To understand stop out, first you need to learn about margin level, which is  the ratio of your equity (the total balance you would have if you close all your positions at that point) to the margin you're using at the moment. If your margin level drops below our stop out level, your positions may be closed automatically to protect you from further losses."
                ),
            },
            dxtrade: {
                synthetic: localize('50%'),
                synthetic_eu: localize('50%'),
                financial: localize('50%'),
                financial_au: localize('50%'),
                financial_eu: localize('50%'),
                footnote: localize(
                    "To understand stop out, first you need to learn about margin level, which is  the ratio of your equity (the total balance you would have if you close all your positions at that point) to the margin you're using at the moment. If your margin level drops below our stop out level, your positions may be closed automatically to protect you from further losses."
                ),
            },
        },
        {
            attribute: localize('Number of assets'),
            mt5: {
                synthetic: localize('20+'),
                synthetic_eu: localize('20+'),
                financial: localize('150+'),
                financial_au: localize('100+'),
                financial_eu: localize('50+'),
                financial_stp: localize('70+'),
                footnote: null,
            },
            dxtrade: {
                synthetic: localize('20+'),
                synthetic_eu: localize('20+'),
                financial: localize('90+'),
                financial_au: localize('90+'),
                financial_eu: localize('90+'),
                footnote: null,
            },
        },
        {
            attribute: localize('Cryptocurrency trading'),
            mt5: {
                synthetic: localize('N/A'),
                synthetic_eu: localize('N/A'),
                financial: localize('24/7'),
                financial_au: localize('24/7'),
                financial_eu: localize('24/7'),
                financial_stp: localize('24/7'),
                footnote: localize('Indicates the availability of cryptocurrency trading on a particular account.'),
            },
            dxtrade: {
                synthetic: localize('N/A'),
                synthetic_eu: localize('N/A'),
                financial: localize('24/7'),
                financial_au: localize('24/7'),
                financial_eu: localize('24/7'),
                footnote: localize('Indicates the availability of cryptocurrency trading on a particular account.'),
            },
        },
        {
            attribute: localize('Trading instruments'),
            mt5: {
                synthetic: localize('Synthetics'),
                synthetic_eu: localize('Synthetics'),
                financial: localize(
                    'FX-majors (standard/micro lots), FX-minors, basket indices, commodities, cryptocurrencies, and stocks and stock indices'
                ),
                financial_au: localize(
                    'FX-majors (standard/micro lots), FX-minors, Commodities, Cryptocurrencies, Stocks, and Stock Indices'
                ),
                financial_eu: financial_eu_trading_instruments,
                financial_stp: localize('FX-majors, FX-minors, FX-exotics, and cryptocurrencies'),
                footnote: null,
            },
            dxtrade: {
                synthetic: localize('Synthetics'),
                synthetic_eu: localize('Synthetics'),
                financial: localize(
                    'FX majors (standard/micro lots), FX minors, basket indices, commodities, and cryptocurrencies'
                ),
                financial_au: localize('FX-majors (standard/micro lots), FX-minors, Commodities, Cryptocurrencies'),
                financial_eu: localize(
                    'FX-majors (standard/micro lots), FX-minors, Commodities, Cryptocurrencies (except UK)'
                ),
                footnote: null,
            },
        },
    ];
};

const CFDAttributeDescriber = ({ name, counter }: TCFDAttributeDescriberProps) => {
    const [is_visible, setIsVisible] = React.useState(false);
    const toggleModal = () => setIsVisible(!is_visible);

    return counter ? (
        <React.Fragment>
            <Text
                as='p'
                weight='bold'
                size='xs'
                line_height='s'
                className='cfd-attribute-describer'
                onClick={toggleModal}
            >
                {name}
                <Text weight='bold' as='span' line_height='x' size='xxxs' className='counter'>
                    {counter}
                </Text>
            </Text>
        </React.Fragment>
    ) : (
        <Text as='p' weight='bold' size='xs' line_height='s' className='cfd-attribute-describer'>
            {name}
        </Text>
    );
};

const filterAvailableAccounts: TFilterAvailableAccounts = (
    landing_companies,
    table,
    is_logged_in,
    is_eu_client,
    platform,
    is_australian
) => {
    const getFinancialObject = (financial?: string, financial_au?: string, financial_eu?: string | React.ReactNode) => {
        if (is_australian) {
            return financial_au;
        }
        if (is_eu_client) {
            return financial_eu;
        }
        return financial;
    };

    let footnote_number = 0;
    return table
        .filter(row => row[platform as keyof TAccountsDescription])
        .map(({ attribute, mt5 = {}, dxtrade = {} }) => {
            const { synthetic, synthetic_eu, financial, financial_au, financial_eu, footnote } =
                platform === CFD_PLATFORMS.MT5 ? mt5 : dxtrade;
            const synthetic_object = { synthetic: is_eu_client ? synthetic_eu : synthetic };
            const financial_object = { financial: getFinancialObject(financial, financial_au, financial_eu) };
            const footnote_counter = footnote ? ++footnote_number : null;

            if (is_logged_in) {
                return {
                    attribute: <CFDAttributeDescriber name={attribute} counter={footnote_counter} />,
                    ...(landing_companies?.mt_gaming_company?.financial ? synthetic_object : {}),
                    ...(landing_companies?.mt_financial_company?.financial ? financial_object : {}),
                    ...(landing_companies?.mt_financial_company?.financial_stp && platform === CFD_PLATFORMS.MT5
                        ? { financial_stp: mt5?.financial_stp }
                        : {}),
                };
            }
            if (platform === CFD_PLATFORMS.DXTRADE) {
                return {
                    attribute: <CFDAttributeDescriber name={attribute} counter={footnote_counter} />,
                    ...synthetic_object,
                    ...financial_object,
                };
            }
            return {
                attribute: <CFDAttributeDescriber name={attribute} counter={footnote_counter} />,
                ...synthetic_object,
                ...financial_object,
                ...{ financial_stp: mt5?.financial_stp },
            };
        });
};

const compareAccountsData = ({
    landing_companies,
    is_logged_in,
    is_eu_client,
    platform,
    residence,
    is_uk,
}: TCompareAccountsDataParams) => {
    const is_australian = residence === 'au';
    return filterAvailableAccounts(
        landing_companies,
        getAccounts({ landing_companies, platform, is_logged_in, is_uk }),
        is_logged_in,
        is_eu_client,
        platform,
        is_australian
    );
};

const CFDCompareAccountHint = ({
    platform,
    show_risk_message,
    landing_companies,
    is_logged_in,
    is_uk,
}: TCFDCompareAccountHintProps) => {
    return (
        <div className='cfd-compare-account--hint'>
            <div className='cfd-compare-accounts__bullet-wrapper'>
                <span className='cfd-compare-accounts__bullet cfd-compare-accounts__bullet--circle' />
                <Localize i18n_default_text='At bank rollover, liquidity in the forex markets is reduced and may increase the spread and processing time for client orders. This happens around 21:00 GMT during daylight saving time, and 22:00 GMT non-daylight saving time.' />
            </div>
            {show_risk_message && (
                <React.Fragment>
                    <div className='cfd-compare-accounts__bullet-wrapper'>
                        <span className='cfd-compare-accounts__bullet cfd-compare-accounts__bullet--circle' />
                        <Localize i18n_default_text='Margin call and stop out level will change from time to time based on market condition.' />
                    </div>
                    <div className='cfd-compare-accounts__bullet-wrapper'>
                        <Text
                            size='xs'
                            line_height='x'
                            weight='bold'
                            className='cfd-compare-accounts__bullet cfd-compare-accounts__bullet--star cfd-compare-accounts__star'
                        >
                            *
                        </Text>
                        <Localize
                            i18n_default_text='To protect your portfolio from adverse market movements due to the market opening gap, we reserve the right to decrease leverage on all offered symbols for financial accounts before market close and increase it again after market open. Please make sure that you have enough funds available in your {{platform}} account to support your positions at all times.'
                            values={{
                                platform: platform === CFD_PLATFORMS.MT5 ? localize('MT5') : localize('Deriv X'),
                            }}
                        />
                    </div>
                    {is_uk && (
                        <div className='cfd-compare-accounts__bullet-wrapper'>
                            <Text
                                size='xs'
                                line_height='x'
                                weight='bold'
                                className='cfd-compare-accounts__bullet cfd-compare-accounts__bullet--star cfd-compare-accounts__star'
                            >
                                **
                            </Text>
                            <Localize
                                i18n_default_text='Cryptocurrency trading is not available for clients residing in the United Kingdom.'
                                values={{
                                    platform: platform === CFD_PLATFORMS.MT5 ? localize('MT5') : localize('Deriv X'),
                                }}
                            />
                        </div>
                    )}
                </React.Fragment>
            )}
            {getAccounts({ landing_companies, platform, is_logged_in, is_uk })
                .filter(
                    item =>
                        !!(item[platform as keyof TAccountsDescription] as TAccountsDescription['mt5' | 'dxtrade'])
                            ?.footnote
                )
                .map((account, index) => {
                    return (
                        <div key={index} className='cfd-compare-accounts__bullet-wrapper'>
                            <Text
                                size='xs'
                                line_height='x'
                                weight='bold'
                                className='cfd-compare-accounts__bullet cfd-compare-accounts__bullet--star cfd-compare-accounts__star'
                            >
                                {index + 1}
                            </Text>
                            <div className='cfd-compare-accounts__footnote'>
                                <Text
                                    as='p'
                                    size='xs'
                                    weight='bold'
                                    color='prominent'
                                    className='cfd-compare-accounts__footnote-title'
                                >
                                    {account.attribute}
                                </Text>
                                <Text size='xs' color='prominent'>
                                    {
                                        (
                                            account[platform as keyof TAccountsDescription] as TAccountsDescription[
                                                | 'mt5'
                                                | 'dxtrade']
                                        ).footnote
                                    }
                                </Text>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

const ModalContent = ({
    landing_companies,
    is_logged_in,
    platform,
    is_eu_client,
    residence,
    is_eu,
    is_uk,
}: TModalContentProps) => {
    const [cols, setCols] = React.useState<Array<Record<string, string | React.ReactNode | undefined>>>([]);
    const [template_columns, updateColumnsStyle] = React.useState(
        platform === CFD_PLATFORMS.DXTRADE ? '1.5fr 1fr 2fr' : '1.5fr 1fr 2fr 1fr'
    );

    React.useEffect(() => {
        setCols(compareAccountsData({ landing_companies, is_logged_in, platform, is_eu_client, residence, is_uk }));

        if (is_logged_in && platform === CFD_PLATFORMS.MT5) {
            updateColumnsStyle(
                `1.5fr ${landing_companies?.mt_gaming_company?.financial ? '1fr' : ''} ${
                    landing_companies?.mt_financial_company?.financial ? '2fr' : ''
                } ${landing_companies?.mt_financial_company?.financial_stp ? ' 1fr ' : ''}`
            );
        } else if (is_logged_in && platform === CFD_PLATFORMS.DXTRADE) {
            updateColumnsStyle(
                `1.5fr ${landing_companies?.dxtrade_gaming_company ? '1fr' : ''} ${
                    landing_companies?.dxtrade_financial_company ? '2fr' : ''
                }`
            );
        }
    }, [
        landing_companies?.mt_financial_company,
        landing_companies?.mt_gaming_company,
        is_logged_in,
        is_uk,
        landing_companies,
        platform,
        is_eu_client,
        residence,
    ]);

    const show_risk_message = platform === CFD_PLATFORMS.MT5 || !is_eu_client;
    const financial_account_table_head_text = is_eu ? localize('CFDs') : localize('Financial');

    return (
        <Div100vhContainer height_offset='40px' is_bypassed={isDesktop()}>
            <ThemedScrollbars
                className='cfd-compare-accounts'
                style={{
                    '--cfd-compare-accounts-template-columns': template_columns,
                }}
            >
                <div className='cfd-compare-accounts__table-wrapper'>
                    <Table className='cfd-compare-accounts__table'>
                        <Table.Header>
                            <Table.Row className='cfd-compare-accounts__table-row'>
                                <Table.Head fixed />
                                {is_logged_in ? (
                                    <React.Fragment>
                                        {isLandingCompanyEnabled({ landing_companies, platform, type: 'gaming' }) && (
                                            <Table.Head>{localize('Derived')}</Table.Head>
                                        )}
                                        {isLandingCompanyEnabled({
                                            landing_companies,
                                            platform,
                                            type: 'financial',
                                        }) && (
                                            <Table.Head>
                                                {financial_account_table_head_text}
                                                <Text size='s' weight='bold' className='cfd-compare-accounts__star'>
                                                    *
                                                </Text>
                                            </Table.Head>
                                        )}
                                        {isLandingCompanyEnabled({
                                            landing_companies,
                                            platform,
                                            type: 'financial_stp',
                                        }) && (
                                            <Table.Head>
                                                {localize('Financial STP')}
                                                <Text size='s' weight='bold' className='cfd-compare-accounts__star'>
                                                    *
                                                </Text>
                                            </Table.Head>
                                        )}
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <Table.Head>{localize('Derived')}</Table.Head>
                                        <Table.Head>
                                            {localize('Financial')}
                                            <Text size='s' weight='bold' className='cfd-compare-accounts__star'>
                                                *
                                            </Text>
                                        </Table.Head>
                                        {platform === CFD_PLATFORMS.MT5 && (
                                            <Table.Head>
                                                {localize('Financial STP')}
                                                <Text size='s' weight='bold' className='cfd-compare-accounts__star'>
                                                    *
                                                </Text>
                                            </Table.Head>
                                        )}
                                    </React.Fragment>
                                )}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {cols.map((row, i) => (
                                <Table.Row key={i} className='cfd-compare-accounts__table-row'>
                                    {Object.keys(row).map((col, j) => (
                                        <Table.Cell key={j} fixed={j === 0}>
                                            {row[col]}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
                <CFDCompareAccountHint
                    platform={platform}
                    show_risk_message={show_risk_message}
                    landing_companies={landing_companies}
                    is_logged_in={is_logged_in}
                    is_uk={is_uk}
                />
            </ThemedScrollbars>
        </Div100vhContainer>
    );
};

export default ModalContent;

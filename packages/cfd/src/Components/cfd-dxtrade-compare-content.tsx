import React from 'react';
import { Table, Text, ThemedScrollbars, Div100vhContainer } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, CFD_PLATFORMS } from '@deriv/shared';
import { LandingCompany, CurrencyConfigStructure } from '@deriv/api-types';

// TODO: Remove this temporary type when api-types updates
type TLandingCompany = LandingCompany & {
    /**
     * Available Deriv X financial account types (all except Synthetic Indices).
     */
    dxtrade_all_company?: {
        /**
         * Landing Company details.
         */
        standard?: {
            /**
             * Landing Company address
             */
            address?: string[] | null;
            /**
             * Special conditions for changing sensitive fields
             */
            changeable_fields?: {
                [k: string]: unknown;
            };
            /**
             * Landing Company country of incorporation
             */
            country?: string;
            currency_config?: CurrencyConfigStructure;
            /**
             * Flag to indicate whether reality check is applicable for this Landing Company. `1`: applicable, `0`: not applicable. The Reality Check is a feature that gives a summary of the client's trades and account balances on a regular basis throughout his session, and is a regulatory requirement for certain Landing Companies.
             */
            has_reality_check?: 0 | 1;
            /**
             * Allowed contract types
             */
            legal_allowed_contract_categories?: string[];
            /**
             * Allowable currencies
             */
            legal_allowed_currencies?: string[];
            /**
             * Allowable markets
             */
            legal_allowed_markets?: string[];
            /**
             * Default account currency
             */
            legal_default_currency?: string;
            /**
             * Landing Company legal name
             */
            name?: string;
            /**
             * Legal requirements for the Landing Company
             */
            requirements?: {
                [k: string]: unknown;
            };
            /**
             * Landing Company short code
             */
            shortcode?: string;
            /**
             * Flag that indicates whether the landing company supports professional accounts or not
             */
            support_professional_client?: 0 | 1;
        };
    };
};

type TCFDAttributeDescriberProps = {
    name: string;
    counter: number | null;
};

type TFilterAvailableAccounts = (
    landing_companies: TLandingCompany,
    table: TAccountsDescription[],
    is_logged_in: boolean,
    is_eu_client: boolean,
    platform: string,
    is_australian: boolean
) => Array<{ [key: string]: string | React.ReactNode | undefined }>;

type TAccountsDescription = {
    attribute: string;
    dxtrade: TDxTradeAccountsDescription;
};

type TDxTradeAccountsDescription = {
    derivx: string;
    footnote: string | null;
};

type TCompareAccountsReusedProps = {
    landing_companies: TLandingCompany;
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

type TAccountTypesToFilter = (TLandingCompany['dxtrade_all_company'] | boolean | undefined)[];

const getAccounts: TGetAccounts = ({ landing_companies, is_logged_in }) => {
    const getLoggedInTypesCount = ([landing_companies?.dxtrade_all_company] as TAccountTypesToFilter).length;

    const account_types_count = is_logged_in ? getLoggedInTypesCount : 2;

    return [
        {
            attribute: localize('Currency'),
            dxtrade: {
                derivx: localize('USD'),
                footnote: null,
            },
        },
        {
            attribute: localize('Maximum leverage'),
            dxtrade: {
                derivx: localize('Up to 1:1000'),
                footnote: localize(
                    'Leverage gives you the ability to trade a larger position using your existing capital. Leverage varies across different symbols.'
                ),
            },
        },
        {
            attribute: localize('Order execution'),
            dxtrade: {
                derivx: localize('Market'),
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
            dxtrade: {
                derivx: localize('Fixed/Variable'),
                footnote: localize(
                    "The spread is the difference between the buy price and sell price. A variable spread means that the spread is constantly changing, depending on market conditions. A fixed spread remains constant but is subject to alteration, at the Broker's absolute discretion."
                ),
            },
        },
        {
            attribute: localize('Commission'),
            dxtrade: {
                derivx: localize('No'),
                footnote: localize('Deriv charges no commission across all account types.'),
            },
        },
        {
            attribute: localize('Minimum deposit'),
            dxtrade: {
                derivx: localize('No'),
                footnote: null,
            },
        },
        {
            attribute: localize('Margin call'),
            dxtrade: {
                derivx: localize('100%'),
                footnote: localize(
                    'You’ll get a warning, named margin call, if your account balance drops down close to the stop out level.'
                ),
            },
        },
        {
            attribute: localize('Stop out level'),
            dxtrade: {
                derivx: localize('50%'),
                footnote: localize(
                    'If your margin level drops below our stop out level, your positions may be closed automatically to protect you from further losses.'
                ),
            },
        },
        {
            attribute: localize('Negative Balance Protection'),
            dxtrade: {
                derivx: localize('Available'),
                footnote: null,
            },
        },
        {
            attribute: localize('Number of assets'),
            dxtrade: {
                derivx: localize('110+'),
                footnote: null,
            },
        },
        {
            attribute: localize('Cryptocurrency trading'),
            dxtrade: {
                derivx: localize('N/A'),
                footnote: localize('Indicates the availability of cryptocurrency trading on a particular account.'),
            },
        },
        {
            attribute: localize('Trading instruments'),
            dxtrade: {
                derivx: localize(
                    'Synthetics, Baskets, Derived FX, Forex: standard/micro, Stocks, Stock indices, Commodities, Cryptocurrencies'
                ),
                footnote: null,
            },
        },
    ];
};

const CFDAttributeDescriber = ({ name, counter }: TCFDAttributeDescriberProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [is_visible, setIsVisible] = React.useState(false);
    const toggleModal = () => setIsVisible(prev => !prev);

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
    platform
) => {
    let footnote_number = 0;
    return table
        .filter(row => row[platform as keyof TAccountsDescription])
        .map(({ attribute, dxtrade = {} }) => {
            const { derivx, footnote } = dxtrade;
            const footnote_counter = footnote ? ++footnote_number : null;

            if (platform === CFD_PLATFORMS.DXTRADE) {
                return {
                    attribute: <CFDAttributeDescriber name={attribute} counter={footnote_counter} />,
                    derivx,
                };
            }
            if (is_logged_in) {
                return {
                    attribute: <CFDAttributeDescriber name={attribute} counter={footnote_counter} />,
                };
            }
            return {
                attribute: <CFDAttributeDescriber name={attribute} counter={footnote_counter} />,
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
                                platform: localize('Deriv X'),
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
                                    platform: localize('Deriv X'),
                                }}
                            />
                        </div>
                    )}
                </React.Fragment>
            )}
            {getAccounts({ landing_companies, platform, is_logged_in, is_uk })
                .filter(
                    item =>
                        !!(item[platform as keyof TAccountsDescription] as TAccountsDescription['dxtrade'])?.footnote
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
                                            account[
                                                platform as keyof TAccountsDescription
                                            ] as TAccountsDescription['dxtrade']
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

const CfdDxtradeCompareContent = ({
    landing_companies,
    is_logged_in,
    platform,
    is_eu_client,
    residence,
    is_uk,
}: TModalContentProps) => {
    const [cols, setCols] = React.useState<Array<Record<string, string | React.ReactNode | undefined>>>([]);
    const [template_columns, updateColumnsStyle] = React.useState('1fr 1.5fr');

    React.useEffect(() => {
        setCols(compareAccountsData({ landing_companies, is_logged_in, platform, is_eu_client, residence, is_uk }));
        updateColumnsStyle('1fr 1.5fr');
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

    const show_risk_message = !is_eu_client;

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
                                <Table.Head>{localize('Deriv X')}</Table.Head>
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

export default CfdDxtradeCompareContent;

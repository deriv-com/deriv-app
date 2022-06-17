import React from 'react';
import classNames from 'classnames';
import {
    Table, ThemedScrollbars, Div100vhContainer, Button,
    Text,
    Popover,
} from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';

type AccountsDescription = {
    synthetic_svg?: { text: string, tooltip_msg?: string };
    synthetic_bvi?: { text: string, tooltip_msg?: string };
    financial_svg?: { text: string | Array<string>, tooltip_msg?: string };
    financial_bvi?: { text: string | Array<string>, tooltip_msg?: string };
    financial_v?: { text: string | Array<string>, tooltip_msg?: string };
    financial_fx?: { text: string | Array<string>, tooltip_msg?: string };
};

type TModalContentProps = {
    id: string;
    attribute: string;
    values: AccountsDescription
};

const content: TModalContentProps[] = [
    {
        id: 'jurisdiction',
        attribute: localize('Jurisdiction'),
        values: {
            synthetic_svg: { text: localize('St. Vincent & Grenadines') },
            synthetic_bvi: { text: localize('British Virgin Islands') },
            financial_svg: { text: localize('St. Vincent & Grenadines') },
            financial_bvi: { text: localize('British Virgin Islands') },
            financial_v: { text: localize('Vanuatu') },
            financial_fx: {
                text: localize('Labuan STP account'), tooltip_msg: localize('Your Financial (STP) trades go directly to the market. A Financial (STP) account offers you deep liquidity, fast execution and tight spreads.')
            },

        },
    },
    {
        id: 'counterparty',
        attribute: localize('Counterparty company'),
        values: {
            synthetic_svg: { text: localize('Deriv(SVG) LLC') },
            synthetic_bvi: { text: localize('Deriv (BVI) Ltd') },
            financial_svg: { text: localize('Deriv (SVG) LLC') },
            financial_bvi: { text: localize('Deriv (SVG) LLC') },
            financial_v: { text: localize('Deriv (V) Ltd') },
            financial_fx: { text: localize('Deriv (FX) Ltd') },
        },
    },
    {
        id: 'regulator',
        attribute: localize('Regulator'),
        values: {
            synthetic_svg: { text: localize('-') },
            synthetic_bvi: { text: localize('British Virgin Islands Financial Services Commission (licence no. SIBA/L/18/1114)') },
            financial_svg: { text: localize('-') },
            financial_bvi: { text: localize('British Virgin Islands Financial Services Commission (licence no. SIBA/L/18/1114)') },
            financial_v: { text: localize('Vanuatu Financial Services Commission, and is a member of the Financial Markets Association') },
            financial_fx: { text: localize('Labuan Financial Services Authority (licence no. MB/18/0024)') },
        },
    },

    {
        id: 'leverage',
        attribute: localize('Maximum leverage'),
        values: {
            synthetic_svg: { text: localize('Up to 1:1000') },
            synthetic_bvi: { text: localize('Up to 1:1000') },
            financial_v: { text: localize('Up to 1:1000') },
            financial_fx: { text: localize('Up to 1:100') },
        },
    },

    {
        id: 'instruments',
        attribute: localize('Trading instruments'),
        values: {
            synthetic_svg: { text: localize('Synthetics') },
            financial_svg: {
                text: [
                    localize('Forex: standard/micro'),
                    localize('Stocks'),
                    localize('Stock indices'),
                    localize('Equities'),
                    localize('Commodities'),
                    localize('Basket indices'),
                    localize('Cryptocurrencies'),
                ]
            },
            financial_bvi: {
                text: [
                    localize('Forex'),
                    localize('Commodities'),
                ]
            },
            financial_fx: { text: [localize('Forex'), localize('Cryptocurrencies')] }
        },
    },

]

const footer_buttons = {
    synthetic_svg: { label: localize('Add'), action: "" },
    synthetic_bvi: { label: localize('Add'), action: "" },
    financial_svg: { label: localize('Add'), action: "" },
    financial_bvi: { label: localize('Add'), action: "" },
    financial_v: { label: localize('Add'), action: "" },
    financial_fx: { label: localize('Add'), action: "" },
}

type InstrumentsRowProps = {
    attr: string;
    val: AccountsDescription
};

const InstrumentsRow = ({ attr, val }: InstrumentsRowProps) => {
    return (

        <Table.Row className='cfd-real-compare-accounts__table-row--instruments'>

            <Table.Cell fixed>
                <Text as='p' weight='bold' align='center' color='prominent' size='xxs'>{attr} </Text>
            </Table.Cell>

            {Object.keys(val).map(rowKey => (
                <Table.Cell className='cfd-real-compare-accounts__table-row-item'>
                    {Array.isArray(val[rowKey].text) ?
                        (val[rowKey].text.map((item, index) => (
                            <Text key={index} as='p' weight=' normal'
                                align='center'
                                color='prominent'
                                size='xxxs'>
                                {item}
                            </Text>
                        ))
                        ) :
                        (
                            <Text as='p'
                                weight='normal'
                                align='center'
                                color='prominent'
                                size='xxxs'>
                                {val[rowKey].text}
                            </Text>
                        )
                    }
                </Table.Cell>
            ))
            }
        </Table.Row >
    )
}
const Row = ({ id, attribute, values }: TModalContentProps) => {
    const is_leverage = id === 'leverage';
    if (id === 'instruments') {
        return <InstrumentsRow attr={attribute} val={values} />
    }
    return (
        <Table.Row
            className={classNames('cfd-real-compare-accounts__table-row', {
                'cfd-real-compare-accounts__table-row--leverage': is_leverage,
            })}>

            <Table.Cell fixed>
                <Text as='p' weight='bold' align='center' color='prominent' size='xxs'>{attribute} </Text>
            </Table.Cell>
            {Object.keys(values).map(item => (
                <Table.Cell className={classNames('cfd-real-compare-accounts__table-row-item', {
                    'cfd-real-compare-accounts__table-row-item--tooltip': values[item].tooltip_msg,
                })}>

                    <>
                        <Text as='p'
                            weight={id === 'jurisdiction' ? 'bold' : 'normal'}
                            align='center'
                            color='prominent'
                            size={(id === 'counterparty' || id === 'leverage') ? 'xxs' : 'xxxs'}>
                            {values[item].text}
                        </Text>
                        {values[item].tooltip_msg &&
                            <Popover
                                alignment='left'
                                className='da-account-limits__popover'
                                classNameBubble='tooltip_msg'
                                icon='info'
                                disable_message_icon
                                is_bubble_hover_enabled
                                message={values[item].tooltip_msg}
                                zIndex={9999}
                            />
                        }
                    </>
                </Table.Cell>
            ))
            }
        </Table.Row >
    )
}

const RealModalContent = () => {
    return (
        <Div100vhContainer height_offset='40px' is_bypassed={isDesktop()}
            className='cfd-real-compare-accounts'
            style={{
                '--cfd-real-compare-accounts-template-columns': '0.9fr  1.35fr 2.66fr',
            }}>
            <div className='cfd-real-compare-accounts'>
                <div className='cfd-real-compare-accounts__table-wrapper'>
                    <Table className='cfd-real-compare-accounts__table'>

                        <Table.Header>
                            <Table.Row className='cfd-real-compare-accounts__table-header' >
                                <Table.Head fixed className='cfd-real-compare-accounts__table-empty-cell' />
                                <Table.Head className='cfd-real-compare-accounts__table-header-item'>{localize('Synthetic')}</Table.Head>
                                <Table.Head className='cfd-real-compare-accounts__table-header-item'>{localize('Financial')}</Table.Head>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {content.map(row => (
                                <Row key={row.id} id={row.id} attribute={row.attribute} values={row.values} />
                            ))}
                        </Table.Body>
                        <Table.Row className='cfd-real-compare-accounts__table-footer'>
                            <Table.Cell fixed className='cfd-real-compare-accounts__table-empty-cell' />
                            {Object.keys(footer_buttons).map(item =>
                                <Table.Cell className='cfd-real-compare-accounts__table-footer__item'>
                                    <Button
                                        className='cfd-real-compare-accounts__table-footer__button'
                                        type='button'
                                        primary_light
                                        onClick={() => {
                                        }}
                                    >
                                        {footer_buttons[item].label}
                                    </Button>
                                </Table.Cell>
                            )
                            }
                        </Table.Row>
                    </Table>
                </div>

            </div >
        </Div100vhContainer >
    );
};
export default RealModalContent;
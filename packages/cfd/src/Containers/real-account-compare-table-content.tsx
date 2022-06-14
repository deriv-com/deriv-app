import React from 'react';
import classNames from 'classnames';
import {
    Table, ThemedScrollbars, Div100vhContainer, Button,
    Text,
} from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';

type AccountsDescription = {
    synthetic_svg?: string;
    synthetic_bvi?: string;
    financial_svg?: string | Array<string>;
    financial_bvi?: string | Array<string>;
    financial_v?: string | Array<string>;
    financial_fx: string | Array<string>;
};

type TModalContentProps = {
    id: string;
    attribute: string;
    values: AccountsDescription
};

// type : RealAccountCompareModalRowType{

// }
const content: TModalContentProps[] = [
    {
        id: 'jurisdiction',
        attribute: localize('Jurisdiction'),
        values: {
            synthetic_svg: localize('St. Vincent & Grenadines'),
            synthetic_bvi: localize('British Virgin Islands'),
            financial_svg: localize('St. Vincent & Grenadines'),
            financial_bvi: localize('British Virgin Islands'),
            financial_v: localize('Vanuatu'),
            financial_fx: localize('Labuan STP account'),
        },

    },
    {
        id: 'counterparty',
        attribute: localize('Counterparty company'),
        values: {
            synthetic_svg: localize('Deriv (SVG) LLC'),
            synthetic_bvi: localize('Deriv (BVI) Ltd'),
            financial_svg: localize('Deriv (SVG) LLC'),
            financial_bvi: localize('Deriv (SVG) LLC'),
            financial_v: localize('Deriv (V) Ltd'),
            financial_fx: localize('Deriv (FX) Ltd'),
        },
    },
    {
        id: 'regulator',
        attribute: localize('Regulator'),
        values: {
            synthetic_svg: localize('-'),
            synthetic_bvi: localize('British Virgin Islands Financial Services Commission (licence no. SIBA/L/18/1114)'),
            financial_svg: localize('-'),
            financial_bvi: localize('British Virgin Islands Financial Services Commission (licence no. SIBA/L/18/1114)'),
            financial_v: localize('Vanuatu Financial Services Commission, and is a member of the Financial Markets Association'),
            financial_fx: localize('Labuan Financial Services Authority (licence no. MB/18/0024)'),
        },
    },

    {
        id: 'leverage',
        attribute: localize('Maximum leverage'),
        values: {
            synthetic_svg: localize('Up to 1:1000'),
            synthetic_bvi: localize('Up to 1:1000'),
            financial_v: localize('Up to 1:1000'),
            financial_fx: localize('Up to 1:100'),
        },
    },

    {
        id: 'instruments',
        attribute: localize('Trading instruments'),
        values: {
            synthetic_svg: localize('Synthetics'),
            financial_svg: [
                localize('Forex: standard/micro'),
                localize('Stocks'),
                localize('Stock indices'),
                localize('Equities'),
                localize('Commodities'),
                localize('Basket indices'),
                localize('Cryptocurrencies'),
            ],
            financial_bvi: [
                localize('Forex'),
                localize('Commodities'),
            ],
            financial_fx: [localize('Forex'), localize('Cryptocurrencies')]
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

            <Table.Cell>
                <Text as='p' weight='bold' align='center' color='prominent' size='xxs'>{attr} </Text>
            </Table.Cell>

            {Object.keys(val).map(rowKey => (
                <Table.Cell className='cfd-real-compare-accounts__table-row-item'>
                    {Array.isArray(val[rowKey]) ?
                        (val[rowKey].map((item, index) => (
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
                                {val[rowKey]}
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
    const is_le = id === 'leverage';
    if (id === 'instruments') {
        return <InstrumentsRow attr={attribute} val={values} />
    }
    return (
        <Table.Row
            className={classNames('cfd-real-compare-accounts__table-row', {
                'cfd-real-compare-accounts__table-row--leverage': is_le,
            })}>

            <Table.Cell>
                <Text as='p' weight='bold' align='center' color='prominent' size='xxs'>{attribute} </Text>
            </Table.Cell>
            {Object.keys(values).map(item => (
                <Table.Cell className='cfd-real-compare-accounts__table-row-item'>
                    <Text as='p'
                        weight={id === 'jurisdiction' ? 'bold' : 'normal'}
                        align='center'
                        color='prominent'
                        size={(id === 'counterparty' || id === 'leverage') ? 'xxs' : 'xxxs'}>
                        {values[item]}
                    </Text>
                </Table.Cell>
            ))
            }
        </Table.Row >
    )
}

const RealModalContent = () => {
    return (
        <Div100vhContainer height_offset='40px' is_bypassed={isDesktop()}>
            <ThemedScrollbars
                className='cfd-real-compare-accounts'
                style={{
                    '--cfd-real-compare-accounts-template-columns': '0.9fr  1.35fr 2.66fr',
                }}
            >
                <div className='cfd-real-compare-accounts__table-wrapper'>
                    <Table className='cfd-real-compare-accounts__table'>

                        <Table.Header>
                            <Table.Row className='cfd-real-compare-accounts__table-header' >
                                <Table.Head className='cfd-real-compare-accounts__table-empty-cell' />
                                <Table.Head className='cfd-real-compare-accounts__table-header-item'>{localize('Synthetic')}</Table.Head>
                                <Table.Head className='cfd-real-compare-accounts__table-header-item'>{localize('Financial')}</Table.Head>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {content.map(row => (
                                <Row key={row.id} id={row.id} attribute={row.attribute} values={row.values} />
                            ))}
                        </Table.Body>
                        {/* <Table.Footer> */}
                        <Table.Row className='cfd-real-compare-accounts__table-footer'>
                            <Table.Cell className='cfd-real-compare-accounts__table-empty-cell' />
                            {Object.keys(footer_buttons).map(item =>
                                <Table.Cell className='cfd-real-compare-accounts__table-footer__item'>
                                    <Button
                                        className='cfd-real-compare-accounts__table-footer__button'
                                        type='button'
                                        primary_light
                                    // onClick={() => {
                                    // }}
                                    >
                                        {footer_buttons[item].label}
                                    </Button>
                                </Table.Cell>
                            )
                            }
                        </Table.Row>
                        {/* </Table.Footer> */}
                    </Table>
                </div>

            </ThemedScrollbars>
        </Div100vhContainer>
    );
};
export default RealModalContent;
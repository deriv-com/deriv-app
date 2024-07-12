import React from 'react';
import { DataList, DataTable } from '@deriv/components';
import { getUnsupportedContracts, getContractPath, hasContractStarted } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { useDevice } from '@deriv-com/ui';
import { ReportsTableRowLoader } from '../Components/Elements/ContentLoader';
import EmptyTradeHistoryMessage from '../Components/empty-trade-history-message';
import PlaceholderComponent from '../Components/placeholder-component';
import { TUnsupportedContractType } from 'Types';
import { TMobileRowRenderer } from './mobile-row-renderer';
import { TTotals } from './open-positions';
import { TPortfolioPosition } from '@deriv/stores/types';

type TEmptyPlaceholderWrapper = React.PropsWithChildren<{
    is_empty: boolean;
    component_icon: string;
}>;

type TOpenPositionsTable = {
    accumulator_rate: string;
    active_positions: TPortfolioPosition[];
    className: string;
    columns: Record<string, unknown>[];
    component_icon: string;
    contract_type_value: string;
    currency: string;
    is_empty: boolean;
    is_loading: boolean;
    mobileRowRenderer: React.ComponentProps<typeof DataList>['rowRenderer'];
    row_size: number;
    totals: TTotals;
};

const EmptyPlaceholderWrapper = ({ is_empty, component_icon, children }: TEmptyPlaceholderWrapper) => (
    <React.Fragment>
        {is_empty ? (
            <PlaceholderComponent
                is_empty={is_empty}
                empty_message_component={EmptyTradeHistoryMessage}
                component_icon={component_icon}
                localized_message={<Localize i18n_default_text='You have no open positions yet.' />}
            />
        ) : (
            children
        )}
    </React.Fragment>
);

/*
 * purchase property in contract positions object can be NaN or undefined in the first few responses.
 * So we set it to true in these case to show a preloader for the data-table-row until the correct value is set.
 */
export const isPurchaseMissing = (item: { purchase?: number }) => isNaN(Number(item.purchase)) || !item.purchase;

export const getRowAction = (row_obj: NonNullable<TMobileRowRenderer['row']> = {}) => {
    let action: string | { component?: React.ReactElement } = {};
    const unsupportedContractConfig = getUnsupportedContracts()[row_obj.type as TUnsupportedContractType];

    if (row_obj.contract_info && !hasContractStarted(row_obj.contract_info)) {
        action = {
            component: <Localize i18n_default_text="You'll see these details once the contract starts." />,
        };
    } else if (unsupportedContractConfig || row_obj.id) {
        action = unsupportedContractConfig
            ? {
                  component: (
                      <Localize
                          i18n_default_text="The {{trade_type_name}} contract details aren't currently available. We're working on making them available soon."
                          values={{
                              trade_type_name: unsupportedContractConfig?.name,
                          }}
                      />
                  ),
              }
            : getContractPath(row_obj.id);
    }

    return action;
};

export const OpenPositionsTable = ({
    accumulator_rate,
    active_positions,
    className,
    columns,
    component_icon,
    contract_type_value,
    currency,
    is_empty,
    is_loading,
    mobileRowRenderer,
    row_size,
    totals,
}: TOpenPositionsTable) => {
    const { isDesktop } = useDevice();
    React.useEffect(() => {
        Analytics.trackEvent('ce_reports_form', {
            action: 'choose_report_type',
            form_name: 'default',
            subform_name: 'open_positions_form',
            trade_type_filter: contract_type_value,
            growth_type_filter: accumulator_rate,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            {is_loading ? (
                <PlaceholderComponent
                    is_loading={is_loading}
                    empty_message_component={EmptyTradeHistoryMessage}
                    component_icon={component_icon}
                    localized_message={<Localize i18n_default_text='You have no open positions yet.' />}
                />
            ) : (
                currency && (
                    <div className='reports__content'>
                        <EmptyPlaceholderWrapper component_icon={component_icon} is_empty={is_empty}>
                            {isDesktop ? (
                                <DataTable
                                    className={className}
                                    columns={columns}
                                    preloaderCheck={isPurchaseMissing}
                                    footer={totals}
                                    data_source={active_positions}
                                    getRowAction={getRowAction}
                                    getRowSize={() => row_size}
                                    content_loader={ReportsTableRowLoader}
                                >
                                    <PlaceholderComponent />
                                </DataTable>
                            ) : (
                                <DataList
                                    className={className}
                                    data_source={active_positions}
                                    footer={totals}
                                    rowRenderer={mobileRowRenderer}
                                    getRowAction={getRowAction}
                                    row_gap={8}
                                    keyMapper={item => item?.id}
                                >
                                    <PlaceholderComponent />
                                </DataList>
                            )}
                        </EmptyPlaceholderWrapper>
                    </div>
                )
            )}
        </React.Fragment>
    );
};

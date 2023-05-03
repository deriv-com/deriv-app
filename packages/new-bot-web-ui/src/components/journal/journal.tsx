import { DataList, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import classnames from 'classnames';
import { contract_stages } from 'Constants/contract-stage';
import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { JournalItem, JournalLoader, JournalTools } from './journal-components';
import { TCheckedFilters, TFilterMessageValues, TJournalDataListArgs, TJournalProps } from './journal.types';
import { isMobile } from '@deriv/shared';

const Journal = ({
    contract_stage,
    filtered_messages,
    is_stop_button_visible,
    unfiltered_messages,
    ...props
}: TJournalProps) => {
    const filtered_messages_length = Array.isArray(filtered_messages) && filtered_messages.length;
    const unfiltered_messages_length = Array.isArray(unfiltered_messages) && unfiltered_messages.length;
    const { checked_filters } = props;
    const is_mobile = isMobile();

    return (
        <div
            className={classnames('journal run-panel-tab__content--no-stat', {
                'run-panel-tab__content': !is_mobile,
            })}
        >
            <JournalTools {...props} />
            <div className='journal__item-list'>
                {filtered_messages_length ? (
                    <DataList
                        className='journal'
                        data_source={filtered_messages}
                        rowRenderer={(args: TJournalDataListArgs) => <JournalItem {...args} />}
                        keyMapper={(row: TFilterMessageValues) => row.unique_id}
                    />
                ) : (
                    <>
                        {contract_stage >= contract_stages.STARTING &&
                        !!Object.keys(checked_filters as TCheckedFilters).length &&
                        !unfiltered_messages_length &&
                        is_stop_button_visible ? (
                            <JournalLoader is_mobile={is_mobile} />
                        ) : (
                            <div className='journal-empty'>
                                <Icon icon='IcBox' className='journal-empty__icon' size={64} color='secondary' />
                                <Text
                                    as='h4'
                                    size='xs'
                                    weight='bold'
                                    align='center'
                                    color='less-prominent'
                                    line_height='xxs'
                                    className='journal-empty__header'
                                >
                                    {localize('There are no messages to display')}
                                </Text>
                                <div className='journal-empty__message'>
                                    <Text size='xxs' color='less-prominent'>
                                        {localize('Here are the possible reasons:')}
                                    </Text>
                                    <ul className='journal-empty__list'>
                                        <li>
                                            <Text size='xxs' color='less-prominent'>
                                                {localize('The bot is not running')}
                                            </Text>
                                        </li>
                                        <li>
                                            <Text size='xxs' color='less-prominent'>
                                                {localize('The stats are cleared')}
                                            </Text>
                                        </li>
                                        <li>
                                            <Text size='xxs' color='less-prominent'>
                                                {localize('All messages are filtered out')}
                                            </Text>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default connect(({ journal, run_panel }: RootStore) => ({
    checked_filters: journal.checked_filters,
    filterMessage: journal.filterMessage,
    filters: journal.filters,
    filtered_messages: journal.filtered_messages,
    is_filter_dialog_visible: journal.is_filter_dialog_visible,
    toggleFilterDialog: journal.toggleFilterDialog,
    unfiltered_messages: journal.unfiltered_messages,
    is_stop_button_visible: run_panel.is_stop_button_visible,
    contract_stage: run_panel.contract_stage,
}))(Journal);

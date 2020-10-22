import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ContentLoader from 'react-content-loader';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Checkbox, Icon, ThemedScrollbars, useOnClickOutside, DesktopWrapper } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { formatMoney, getCurrencyDisplayCode } from '@deriv/shared';
import { message_types } from '@deriv/bot-skeleton';
import { log_types } from '@deriv/bot-skeleton/src/constants/messages';
import Download from './download.jsx';
import { contract_stages } from '../constants/contract-stage';
import { connect } from '../stores/connect';
import '../assets/sass/journal.scss';

const DateItem = ({ date, time }) => {
    return (
        <>
            <span className='journal__text-date'>{date}</span> | <span className='journal__text-time'>{time}</span>
        </>
    );
};

const FormatMessage = ({ logType, className, extra }) => {
    const getLogMessage = () => {
        switch (logType) {
            case log_types.LOAD_BLOCK: {
                return localize('Blocks are loaded successfully');
            }
            case log_types.NOT_OFFERED: {
                return localize('Resale of this contract is not offered.');
            }
            case log_types.PURCHASE: {
                const { longcode, transaction_id } = extra;
                return (
                    <Localize
                        i18n_default_text='<0>Bought</0>: {{longcode}} (ID: {{transaction_id}})'
                        values={{ longcode, transaction_id }}
                        components={[<span key={0} className='journal__text--info' />]}
                        options={{ interpolation: { escapeValue: false } }}
                    />
                );
            }
            case log_types.SELL: {
                const { sold_for } = extra;
                return (
                    <Localize
                        i18n_default_text='<0>Sold for</0>: {{sold_for}}'
                        values={{ sold_for }}
                        components={[<span key={0} className='journal__text--warn' />]}
                    />
                );
            }
            case log_types.PROFIT: {
                const { currency, profit } = extra;
                return (
                    <Localize
                        i18n_default_text='Profit amount: <0>{{profit}}</0>'
                        values={{
                            profit: `${formatMoney(currency, profit, true)} ${getCurrencyDisplayCode(currency)}`,
                        }}
                        components={[<span key={0} className='journal__text--success' />]}
                    />
                );
            }
            case log_types.LOST: {
                const { currency, profit } = extra;
                return (
                    <Localize
                        i18n_default_text='Loss amount: <0>{{profit}}</0>'
                        values={{
                            profit: `${formatMoney(currency, profit, true)} ${getCurrencyDisplayCode(currency)}`,
                        }}
                        components={[<span key={0} className='journal__text--error' />]}
                    />
                );
            }
            default:
                return null;
        }
    };

    return <div className={classnames('journal__text', className)}>{getLogMessage()}</div>;
};

const Filters = ({ wrapper_ref, checked_filters, filters, filterMessage, className, classNameLabel }) => {
    return (
        <div ref={wrapper_ref} className={className}>
            {filters.map(item => {
                return (
                    <Checkbox
                        key={item.id}
                        classNameLabel={classNameLabel}
                        value={checked_filters.includes(item.id)}
                        defaultChecked={checked_filters.includes(item.id)}
                        label={item.label}
                        onChange={() => filterMessage(!checked_filters.includes(item.id), item.id)}
                    />
                );
            })}
        </div>
    );
};

const FilterDialog = ({
    toggle_ref,
    checked_filters,
    filters,
    filterMessage,
    is_filter_dialog_visible,
    toggleFilterDialog,
}) => {
    const wrapper_ref = React.useRef();

    const validateClickOutside = event => is_filter_dialog_visible && !toggle_ref.current.contains(event.target);

    useOnClickOutside(wrapper_ref, toggleFilterDialog, validateClickOutside);

    return (
        <Filters
            wrapper_ref={wrapper_ref}
            checked_filters={checked_filters}
            filters={filters}
            filterMessage={filterMessage}
            className='filter-dialog'
        />
    );
};

const Tools = ({ checked_filters, filters, filterMessage, is_filter_dialog_visible, toggleFilterDialog }) => {
    const toggle_ref = React.useRef();

    return (
        <>
            <div className='journal-tools__container'>
                <DesktopWrapper>
                    <Download tab='journal' />
                </DesktopWrapper>
                <div ref={toggle_ref} className='journal-tools__container-filter' onClick={toggleFilterDialog}>
                    <span className='journal-tools__container-filter--label'>
                        <Localize i18n_default_text='Filters' />
                    </span>
                    <Icon icon='IcFilter' size={16} />
                </div>
            </div>
            <CSSTransition
                in={is_filter_dialog_visible}
                classNames={{
                    enter: 'filter-dialog--enter',
                    enterDone: 'filter-dialog--enter-done',
                    exit: 'filter-dialog--exit',
                }}
                timeout={150}
                unmountOnExit
            >
                <FilterDialog
                    toggle_ref={toggle_ref}
                    checked_filters={checked_filters}
                    filters={filters}
                    filterMessage={filterMessage}
                    is_filter_dialog_visible={is_filter_dialog_visible}
                    toggleFilterDialog={toggleFilterDialog}
                />
            </CSSTransition>
        </>
    );
};

const getJournalItemContent = (message, type, className, extra) => {
    switch (type) {
        case message_types.SUCCESS: {
            return <FormatMessage logType={message} extra={extra} className={className} />;
        }
        case message_types.NOTIFY: {
            return <div className={classnames('journal__text', className)}>{message}</div>;
        }
        case message_types.ERROR: {
            return <div className='journal__text--error journal__text'>{message}</div>;
        }
        default:
            return null;
    }
};

const JournalLoader = ({ is_mobile }) => (
    <ContentLoader
        className={classnames('journal__loader', { 'journal__loader--mobile': is_mobile })}
        speed={3}
        width={350}
        height={92}
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
    >
        <rect x='15' y='15' rx='5' ry='5' width='320' height='40' />
        <rect x='15' y='60' rx='5' ry='5' width='180' height='7' />
    </ContentLoader>
);

const Journal = ({
    contract_stage,
    filtered_messages,
    is_drawer_open,
    is_mobile,
    is_stop_button_visible,
    ...props
}) => {
    return (
        <div
            className={classnames('journal run-panel-tab__content--no-stat', {
                'run-panel-tab__content': !is_mobile,
                'run-panel-tab__content--journal-mobile': is_mobile && is_drawer_open,
            })}
        >
            <Tools {...props} />
            <ThemedScrollbars className='journal__scrollbars' height={'calc(100% - 4.2rem)'}>
                <div className='journal__item-list'>
                    {filtered_messages.length ? (
                        <TransitionGroup>
                            {filtered_messages.map(item => {
                                const { date, time, message, message_type, className, unique_id, extra } = item;
                                const date_el = DateItem({ date, time });

                                return (
                                    <CSSTransition key={unique_id} timeout={500} classNames='list__animation'>
                                        <div className='journal__item'>
                                            <div className='journal__item-content'>
                                                {getJournalItemContent(message, message_type, className, extra)}
                                            </div>
                                            <div className='journal__text-datetime'>{date_el}</div>
                                        </div>
                                    </CSSTransition>
                                );
                            })}
                        </TransitionGroup>
                    ) : (
                        <>
                            {contract_stage >= contract_stages.STARTING &&
                            !!props.checked_filters.length &&
                            is_stop_button_visible ? (
                                <JournalLoader is_mobile={is_mobile} />
                            ) : (
                                <div className='journal-empty'>
                                    <Icon icon='IcBox' className='journal-empty__icon' size={64} color='secondary' />
                                    <h4 className='journal-empty__header'>
                                        {localize('There are no messages to display')}
                                    </h4>
                                    <div className='journal-empty__message'>
                                        <span>{localize('Here are the possible reasons:')}</span>
                                        <ul className='journal-empty__list'>
                                            <li>{localize('The bot is not running')}</li>
                                            <li>{localize('The stats are cleared')}</li>
                                            <li>{localize('All messages are filtered out')}</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </ThemedScrollbars>
        </div>
    );
};

Journal.propTypes = {
    checked_filters: PropTypes.array,
    contract_stage: PropTypes.object,
    filtered_messages: PropTypes.array,
    filterMessage: PropTypes.func,
    filters: PropTypes.array,
    is_mobile: PropTypes.bool,
    is_stop_button_visible: PropTypes.bool,
    is_filter_dialog_visible: PropTypes.bool,
    toggleFilterDialog: PropTypes.func,
};

export default connect(({ journal, run_panel, ui }) => ({
    checked_filters: journal.checked_filters,
    contract_stage: run_panel.contract_stage,
    filterMessage: journal.filterMessage,
    filters: journal.filters,
    filtered_messages: journal.filtered_messages,
    is_mobile: ui.is_mobile,
    is_filter_dialog_visible: journal.is_filter_dialog_visible,
    is_stop_button_visible: run_panel.is_stop_button_visible,
    toggleFilterDialog: journal.toggleFilterDialog,
}))(Journal);

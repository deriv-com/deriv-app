import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ContentLoader from 'react-content-loader';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Button, Checkbox, Icon, ThemedScrollbars } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { message_types } from '@deriv/bot-skeleton';
import { log_types } from '@deriv/bot-skeleton/src/constants/messages';
import { contract_stages } from '../constants/contract-stage';
import { connect } from '../stores/connect';
import '../assets/sass/journal.scss';

const FormatMessage = ({ logType, className, passthrough }) => (
    <div className={classnames('journal__text', className)}>
        {(() => {
            switch (logType) {
                case log_types.LOAD_BLOCK: {
                    return localize('Blocks are loaded successfully');
                }
                case log_types.NOT_OFFERED: {
                    return localize('Resale of this contract is not offered.');
                }
                case log_types.PURCHASE: {
                    const { longcode, transaction_id } = passthrough;
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
                    const { sold_for } = passthrough;
                    return (
                        <Localize
                            i18n_default_text='<0>Sold for</0>: {{sold_for}}'
                            values={{ sold_for }}
                            components={[<span key={0} className='journal__text--warn' />]}
                        />
                    );
                }
                case log_types.PROFIT: {
                    const { profit } = passthrough;
                    return (
                        <Localize
                            i18n_default_text='Profit amount: <0>{{profit}}</0>'
                            values={{ profit }}
                            components={[<span key={0} className='journal__text--success' />]}
                        />
                    );
                }
                case log_types.LOST: {
                    const { profit } = passthrough;
                    return (
                        <Localize
                            i18n_default_text='Loss amount: <0>{{profit}}</0>'
                            values={{ profit }}
                            components={[<span key={0} className='journal__text--error' />]}
                        />
                    );
                }
                default:
                    return null;
            }
        })()}
    </div>
);

const JournalItemContent = ({ className, passthrough, message, message_type }) => (
    <div className='journal__item-content'>
        {(() => {
            switch (message_type) {
                case message_types.SUCCESS:
                    return <FormatMessage logType={message} passthrough={passthrough} className={className} />;
                case message_types.NOTIFY:
                    return <div className='journal__text'>{message}</div>;
                case message_types.ERROR:
                    return <div className='journal__text--error journal__text'>{message}</div>;
                case message_types.MESSAGE_WITH_BUTTONS:
                    return (
                        <React.Fragment>
                            <div className='journal__text'>{message}</div>
                            <Button.Group>
                                {passthrough.map(button_obj => (
                                    <Button
                                        key={Blockly.utils.genUid()}
                                        has_effect
                                        onClick={button_obj.onClick}
                                        secondary
                                        small
                                        text={button_obj.text}
                                        type='button'
                                    />
                                ))}
                            </Button.Group>
                        </React.Fragment>
                    );
                default:
                    return null;
            }
        })()}
    </div>
);

const Tools = ({ checked_filters, filters, filterMessage }) => (
    <div className='journal-tools__container'>
        <div className='journal-tools__container-filter'>
            {filters.map(item => {
                return (
                    <Checkbox
                        key={item.id}
                        classNameLabel='journal-tools__text'
                        defaultChecked={checked_filters.includes(item.id)}
                        label={item.label}
                        onChange={e => filterMessage(e.target.checked, item.id)}
                    />
                );
            })}
        </div>
        {/* <div className='tools__container-download'>
            <Icon icon='IcDownload' />
        </div> */}
    </div>
);

const JournalLoader = () => (
    <ContentLoader
        className='journal__loader'
        speed={3}
        width={350}
        height={92}
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
    >
        <rect x='15' y='15' rx='5' ry='5' width='305' height='40' />
        <rect x='15' y='60' rx='5' ry='5' width='180' height='7' />
    </ContentLoader>
);

const Journal = ({ filtered_messages, contract_stage, ...props }) => {
    return (
        <div className='journal run-panel-tab__content'>
            <Tools {...props} />
            <ThemedScrollbars
                autoHide
                className='journal__scrollbars'
                style={{ height: 'calc(100% - 42px)' }}
                hideHorizontal={true}
            >
                <div className='journal__item-list'>
                    {filtered_messages.length ? (
                        <TransitionGroup>
                            {filtered_messages.map(item => {
                                const { date, time, message, message_type, className, unique_id, passthrough } = item;
                                return (
                                    <CSSTransition key={unique_id} timeout={500} classNames='list__animation'>
                                        <div className='journal__item'>
                                            <JournalItemContent
                                                className={className}
                                                message={message}
                                                message_type={message_type}
                                                passthrough={passthrough}
                                            />
                                            <div className='journal__text-datetime'>
                                                <span className='journal__text-date'>{date}</span> |{' '}
                                                <span className='journal__text-time'>{time}</span>
                                            </div>
                                        </div>
                                    </CSSTransition>
                                );
                            })}
                        </TransitionGroup>
                    ) : (
                        <>
                            {contract_stage.index >= contract_stages.STARTING.index ? (
                                <JournalLoader />
                            ) : (
                                <div className='journal-empty__container'>
                                    <div className='journal-empty'>
                                        <Icon
                                            icon='IcBox'
                                            className='journal-empty__icon'
                                            size={64}
                                            color='secondary'
                                        />
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
};

export default connect(({ journal, run_panel }) => ({
    checked_filters: journal.checked_filters,
    contract_stage: run_panel.contract_stage,
    filterMessage: journal.filterMessage,
    filters: journal.filters,
    filtered_messages: journal.filtered_messages,
}))(Journal);

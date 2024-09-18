import React from 'react';
import classNames from 'classnames';
import { Button, Text } from '@deriv/components';
import Money from '@deriv/components/src/components/money/money';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { JOURNAL_TYPE } from 'Stores/server-side-bot-store';
import { useDBotStore } from 'Stores/useDBotStore';

type TJournal = {
    setActiveTabIndex: (index: number) => void;
    setClearDialogVisibility: (is_clear_dialog_visible: boolean) => void;
};

const Journal = observer(({ setActiveTabIndex, setClearDialogVisibility }: TJournal) => {
    const {
        client: { currency },
    } = useStore();
    const { server_bot } = useDBotStore();
    const { active_bot, journal, downloadJournal } = server_bot;
    const has_journal = !!journal.length;
    const font_size = 'xxs';
    const uid = 'journal';
    const is_bot_running = active_bot?.status !== 'stopped';
    const should_disable = !has_journal || is_bot_running;

    React.useEffect(() => {
        const last_journal = journal?.[journal.length - 1];
        if (last_journal?.type === JOURNAL_TYPE.ERROR) {
            setActiveTabIndex(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [journal.length]);

    return (
        <div className='ssb-journal'>
            <div className='ssb-journal__content'>
                {has_journal ? (
                    <>
                        {[...journal]?.reverse()?.map((jn, index) => {
                            const { type, msg = '', amount = '', order = 2 } = jn;
                            const should_have_bg = order % 2 !== 0;
                            switch (type) {
                                case JOURNAL_TYPE.BUY:
                                    return (
                                        <div
                                            className={classNames('ssb-journal__content__item', {
                                                'item-bg': should_have_bg,
                                            })}
                                            key={uid + index}
                                        >
                                            <Text size={font_size}>
                                                <Localize
                                                    i18n_default_text='<0>Bought</0>: '
                                                    components={[
                                                        <span
                                                            className='ssb-journal__content__item--purchase'
                                                            key={0}
                                                        />,
                                                    ]}
                                                />
                                                {msg}
                                            </Text>
                                        </div>
                                    );
                                case JOURNAL_TYPE.WON: {
                                    return (
                                        <div
                                            className={classNames('ssb-journal__content__item', {
                                                'item-bg': should_have_bg,
                                            })}
                                            key={uid + index}
                                        >
                                            <Text size={font_size}>
                                                <Localize i18n_default_text='Win amount: ' />
                                                <span className='ssb-journal__content__item--win'>
                                                    <Money amount={amount} currency={currency} show_currency has_sign />
                                                </span>
                                            </Text>
                                        </div>
                                    );
                                }
                                case JOURNAL_TYPE.LOSS: {
                                    return (
                                        <div
                                            className={classNames('ssb-journal__content__item', {
                                                'item-bg': should_have_bg,
                                            })}
                                            key={uid + index}
                                        >
                                            <Text size={font_size}>
                                                <Localize i18n_default_text='Loss amount: ' />
                                                <span className='ssb-journal__content__item--loss'>
                                                    <Money amount={amount} currency={currency} show_currency has_sign />
                                                </span>
                                            </Text>
                                        </div>
                                    );
                                }
                                case JOURNAL_TYPE.INFO: {
                                    return (
                                        <div
                                            className='ssb-journal__content__item ssb-journal__content__item--info'
                                            key={uid + index}
                                        >
                                            <Text size={font_size}>
                                                <Localize i18n_default_text='Info: ' />
                                                {msg}
                                            </Text>
                                        </div>
                                    );
                                }
                                case JOURNAL_TYPE.ERROR: {
                                    return (
                                        <div
                                            className='ssb-journal__content__item ssb-journal__content__item--error'
                                            key={uid + index}
                                        >
                                            <Text size={font_size}>
                                                <Localize i18n_default_text='Error: ' />
                                                {msg}
                                            </Text>
                                        </div>
                                    );
                                }

                                default:
                                    return null;
                            }
                        })}
                    </>
                ) : (
                    <>
                        <div className='ssb-journal__content__empty'>
                            <Text size={font_size}>
                                <Localize i18n_default_text='There are no messages to display.' />
                            </Text>
                        </div>
                    </>
                )}
            </div>
            <div className='ssb-journal__footer'>
                <Button secondary disabled={should_disable} onClick={() => setClearDialogVisibility(true)}>
                    <Localize i18n_default_text='Reset' />
                </Button>
                <Button secondary disabled={should_disable} onClick={downloadJournal}>
                    <Localize i18n_default_text='Download' />
                </Button>
            </div>
        </div>
    );
});

export default Journal;

import React from 'react';
import classNames from 'classnames';
import { Button, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { JOURNAL_TYPE } from 'Stores/server-side-bot-store';
import { useDBotStore } from 'Stores/useDBotStore';

type TJournal = {
    setActiveTabIndex: (index: number) => void;
};

const Journal: React.FC<TJournal> = observer(({ setActiveTabIndex }) => {
    const { server_bot } = useDBotStore();
    const { journal } = server_bot;
    const { ui } = useStore();
    const { is_mobile } = ui;
    const has_journal = !!journal.length;
    const font_size = is_mobile ? 'xxs' : 'xs';
    const uid = 'journal';

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
                        {journal.map((jn, index) => {
                            const { type, msg = '', bot_id = '', amount = '' } = jn;
                            const should_have_bg = index % 2 !== 0;
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
                                                <span className='ssb-journal__content__item--win'>{amount}</span>
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
                                                <span className='ssb-journal__content__item--loss'>{amount}</span>
                                            </Text>
                                        </div>
                                    );
                                }
                                case JOURNAL_TYPE.INFO: {
                                    return (
                                        <div
                                            className={classNames('ssb-journal__content__item', {
                                                'item-bg': should_have_bg,
                                            })}
                                            key={uid + index}
                                        >
                                            <Text size={font_size}>
                                                <Localize i18n_default_text='INFO: ' />
                                                {msg}
                                            </Text>
                                        </div>
                                    );
                                }
                                case JOURNAL_TYPE.ERROR: {
                                    return (
                                        <div
                                            className={classNames(
                                                'ssb-journal__content__item ssb-journal__content__item--error',
                                                {
                                                    'item-bg': should_have_bg,
                                                }
                                            )}
                                            key={uid + index}
                                        >
                                            <Text size={font_size}>
                                                <Localize i18n_default_text='ERROR: ' />
                                                {msg}
                                            </Text>
                                        </div>
                                    );
                                }

                                default:
                                    return null;
                            }
                        })}

                        {/* <div className='ssb-journal__content__item item-bg'>
                            <Text size={font_size}>
                                <Localize
                                    i18n_default_text='<0>Bought</0>: Win payout if Volatility 100 (1s) Index after 1 tick is strictly lower than entry spot. (ID: 356880252948)'
                                    components={[<span className='ssb-journal__content__item--purchase' key={0} />]}
                                />
                            </Text>
                        </div> */}
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
                <Button secondary disabled={!has_journal}>
                    <Localize i18n_default_text='Reset' />
                </Button>
                <Button secondary disabled={!has_journal}>
                    <Localize i18n_default_text='Download' />
                </Button>
            </div>
        </div>
    );
});

export default Journal;

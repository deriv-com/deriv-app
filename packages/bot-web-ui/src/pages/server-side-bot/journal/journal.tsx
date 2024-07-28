import React from 'react';
import { Button, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

const Journal: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const has_journal = true;
    const font_size = is_mobile ? 'xxs' : 'xs';
    return (
        <div className='ssb-journal'>
            <div className='ssb-journal__content'>
                {has_journal ? (
                    <>
                        <div className='ssb-journal__content__item item-bg'>
                            <Text size={font_size}>
                                <Localize
                                    i18n_default_text='<0>Bought</0>: Win payout if Volatility 100 (1s) Index after 1 tick is strictly lower than entry spot. (ID: 356880252948)'
                                    components={[<span className='ssb-journal__content__item--purchase' key={0} />]}
                                />
                            </Text>
                        </div>
                        <div className='ssb-journal__content__item'>
                            <Text size={font_size}>
                                <Localize i18n_default_text='Win amount: ' />
                                <span className='ssb-journal__content__item--win'>+19.06 USD</span>
                            </Text>
                        </div>
                        <div className='ssb-journal__content__item item-bg'>
                            <Text size={font_size}>
                                <Localize
                                    i18n_default_text='<0>Bought</0>: Win payout if Volatility 100 (1s) Index after 1 tick is strictly lower than entry spot. (ID: 356880252948)'
                                    components={[<span className='ssb-journal__content__item--purchase' key={0} />]}
                                />
                            </Text>
                        </div>
                        <div className='ssb-journal__content__item'>
                            <Text size={font_size}>
                                <Localize i18n_default_text='Loss amount: ' />
                                <span className='ssb-journal__content__item--loss'>-20.00 USD</span>
                            </Text>
                        </div>
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

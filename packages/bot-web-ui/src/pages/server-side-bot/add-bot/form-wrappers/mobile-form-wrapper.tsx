import React from 'react';
import { useFormikContext } from 'formik';
import { Button, Text, ThemedScrollbars } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { TFormValues } from '../types';
import useSubmitHandler from './useSubmitHandler';
import '../add-bot.scss';

type TMobileFormWrapper = {
    children: React.ReactNode;
};

const MobileFormWrapper: React.FC<TMobileFormWrapper> = observer(({ children }) => {
    const { isValid, validateForm } = useFormikContext<TFormValues>();
    const { server_bot } = useDBotStore();
    const { selected_strategy } = server_bot;
    const { handleSubmit } = useSubmitHandler();

    React.useEffect(() => {
        validateForm();
    }, [selected_strategy, validateForm]);

    const onClickCreate = () => {
        handleSubmit();
    };

    return (
        <div className='ssb-add'>
            <div className='ssb-add__body'>
                <div className='ssb-add__body__content'>
                    <ThemedScrollbars className='ssb-add__form__container' autohide={false}>
                        <div className='ssb-add__body__content__info'>
                            <Text as='h2' size='xs' weight='bold'>
                                <Localize i18n_default_text='Martingale' />
                            </Text>
                            <Text as='p' size='xxs'>
                                <Localize i18n_default_text='The Martingale strategy involves increasing your stake after each loss to recoup prior losses with a single successful trade.' />
                            </Text>
                        </div>
                        <div className='ssb-add__body__content__form'>{children}</div>
                    </ThemedScrollbars>
                    <div className='ssb-add__body__content__footer'>
                        <Button
                            primary
                            data-testid='qs-run-button'
                            type='submit'
                            onClick={e => {
                                e.preventDefault();
                                onClickCreate();
                            }}
                            disabled={!isValid}
                        >
                            <Localize i18n_default_text='Add' />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default MobileFormWrapper;

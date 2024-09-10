import React from 'react';
import { useFormikContext } from 'formik';
import { Button, Text, ThemedScrollbars } from '@deriv/components';
import Icon from '@deriv/components/src/components/icon/icon';
import { observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { TFormValues } from '../types';
import useSubmitHandler from './useSubmitHandler';
import '../add-bot.scss';

type TDesktopFormWrapper = {
    children: React.ReactNode;
    onClickClose: () => void;
};

const FormWrapper: React.FC<TDesktopFormWrapper> = observer(({ children, onClickClose }) => {
    const scroll_ref = React.useRef<HTMLDivElement & SVGSVGElement>(null);
    const { isValid, validateForm } = useFormikContext<TFormValues>();
    const { server_bot } = useDBotStore();
    const { selected_strategy } = server_bot;

    const { handleSubmit } = useSubmitHandler();

    React.useEffect(() => {
        validateForm();
    }, [selected_strategy, validateForm]);

    const onRun = () => {
        handleSubmit();
    };

    return (
        <div className='ssb-add'>
            <div className='ssb-add__head'>
                <Text weight='bold'>{localize('Add Bot')}</Text>
                <div className='ssb-add__head__action'>
                    <span
                        data-testid='qs-desktop-close-button'
                        onClick={onClickClose}
                        tabIndex={0}
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Enter') {
                                onClickClose();
                            }
                        }}
                    >
                        <Icon icon='IcCross' />
                    </span>
                </div>
            </div>
            <div className='ssb-add__body'>
                <div className='ssb-add__body__content'>
                    <ThemedScrollbars className='ssb-add__form__container' autohide={false} refSetter={scroll_ref}>
                        <div className='ssb-add__body__content__info'>
                            <Text as='h2' size='s' weight='bold'>
                                <Localize i18n_default_text='Martingale' />
                            </Text>
                            <Text as='p' size='xs'>
                                <Localize i18n_default_text='The Martingale strategy involves increasing your stake after each loss to recoup prior losses with a single successful trade.' />
                            </Text>
                        </div>
                        <div className='ssb-add__body__content__form'>{children}</div>
                    </ThemedScrollbars>
                    <div className='ssb-add__body__content__footer'>
                        <Button
                            data-testid='qs-run-button'
                            primary
                            onClick={e => {
                                e.preventDefault();
                                onRun();
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

export default React.memo(FormWrapper);

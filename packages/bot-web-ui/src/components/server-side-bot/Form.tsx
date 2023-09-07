import React from 'react';
import { Button, DesktopWrapper, MobileFullPageModal, MobileWrapper, Modal, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';
import useInput from './hooks/useInput';
import useMarketInput from './hooks/useMarketInput';

type TFormProps = {
    is_open: boolean;
    onClose: () => void;
    onSubmit: () => void;
};

const STRATEGIES = [
    {
        value: 'martingale',
        text: 'Martingale',
    },
];

const Form: React.FC<TFormProps> = ({ is_open, onClose, onSubmit }) => {
    const [market, get_market] = useMarketInput();
    const [size, get_size] = useInput({
        label: localize('Size'),
        type: 'number',
        trailing_icon_message: localize(
            'The multiplier amount used to increase your stake if you’re losing a trade. Value must be higher than 2.'
        ),
    });
    const [initial_stake, get_initial_stake] = useInput({
        label: localize('Initial stake'),
        type: 'number',
        trailing_icon_message: localize('The amount that you pay to enter a trade.'),
    });
    const [profit_threshold, get_profit_threshold] = useInput({
        label: localize('Profit threshold'),
        type: 'number',
        trailing_icon_message: localize('The bot will stop trading if your total profit exceeds this amount.'),
    });
    const [loss_threshold, get_loss_threshold] = useInput({
        label: localize('Loss threshold'),
        type: 'number',
        trailing_icon_message: localize('The bot will stop trading if your total loss exceeds this amount.'),
    });
    const [duration, get_duration] = useInput({
        label: localize('Duration Value'),
        type: 'number',
        trailing_icon_message: localize('The trade length of your purchased contract.'),
    });

    const handleSubmit = () => {
        const data = {
            market: get_market(),
            size: get_size(),
            initial_stake: get_initial_stake(),
        };
        // onSubmit(data);
    };
    // eslint-disable-next-line no-console

    const renderForm = () => {
        return (
            <div className='server-bot-form'>
                <div className='server-bot-form__group'>
                    <SelectNative
                        list_items={STRATEGIES}
                        value='martingale'
                        should_show_empty_option={false}
                        label={'Strategy'}
                    />
                </div>
                <div className='server-bot-form__split'>
                    <div className='server-bot-form__split__section__left'>
                        <div className='server-bot-form__group'>{market}</div>
                        <div className='server-bot-form__group'>{duration}</div>
                        <div className='server-bot-form__group'>{initial_stake}</div>
                        <div className='server-bot-form__group'>{profit_threshold}</div>
                    </div>
                    <div className='server-bot-form__split__section__right'>
                        <div className='server-bot-form__group'>{market}</div>
                        <div className='server-bot-form__group'>{duration}</div>
                        <div className='server-bot-form__group'>{size}</div>
                        <div className='server-bot-form__group'>{loss_threshold}</div>
                    </div>
                </div>
                <div className='server-bot-form__actions'>
                    <Button large onClick={onClose}>
                        {localize('Cancel')}
                    </Button>
                    <Button primary large onClick={handleSubmit}>
                        {localize('Add bot')}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <>
            <MobileWrapper>
                <MobileFullPageModal
                    is_modal_open={is_open}
                    className='server-side__workspace__mobile-modal'
                    header={localize('Add new Bot')}
                    height_offset='8rem'
                    onClickClose={onClose}
                >
                    {renderForm()}
                </MobileFullPageModal>
            </MobileWrapper>
            <DesktopWrapper>
                <Modal
                    title={localize('Add new Bot')}
                    className='modal--strategy'
                    is_open={is_open}
                    toggleModal={onClose}
                    width='78rem'
                >
                    {renderForm()}
                </Modal>
            </DesktopWrapper>
        </>
    );
};

export default Form;

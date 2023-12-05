import { TTradeStore } from 'Types';

type TData = Partial<
    Pick<
        TTradeStore,
        'cancellation_duration' | 'has_cancellation' | 'has_stop_loss' | 'has_take_profit' | 'stop_loss' | 'take_profit'
    >
>;

type TOnToggleCancellation = {
    has_cancellation: TTradeStore['has_cancellation'];
    onChangeMultiple: (data: TData) => void;
};

type TOnChangeCancellationDuration = {
    event: { target: { name: string; value: string } };
    onChangeMultiple: (data: TData) => void;
};

export const onToggleCancellation = ({ has_cancellation, onChangeMultiple }: TOnToggleCancellation) => {
    // e.target.checked is not reliable, we have to toggle its previous value
    const new_val = !has_cancellation;
    onChangeMultiple({
        has_cancellation: new_val,
        ...(!new_val
            ? {
                  // reset deal cancellation price
                  cancellation_price: undefined,
              }
            : {
                  // unchecked Stop loss
                  has_stop_loss: false,
                  has_take_profit: false,
              }),
    });
};

export const onChangeCancellationDuration = ({ event, onChangeMultiple }: TOnChangeCancellationDuration) => {
    const { value } = event.target;
    onChangeMultiple({
        has_cancellation: true,
        has_take_profit: false,
        has_stop_loss: false,
        cancellation_duration: value,
    });
};

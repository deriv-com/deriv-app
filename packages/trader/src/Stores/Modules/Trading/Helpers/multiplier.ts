import { useTraderStore } from 'Stores/useTraderStores';

type TData = Partial<
    Pick<
        ReturnType<typeof useTraderStore>,
        'cancellation_duration' | 'cancellation_price' | 'has_cancellation' | 'has_stop_loss' | 'has_take_profit'
    >
>;

type TOnToggleCancellation = {
    has_cancellation: ReturnType<typeof useTraderStore>['has_cancellation'];
    onChangeMultiple: (data: TData) => void;
};

type TOnChangeCancellationDuration = {
    event: React.ChangeEvent<HTMLInputElement>;
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

# ContractCard Component

Shows detailed information of a contract. Two types of contracts are available to use: `multiplier` contract and `simple` contract. A contract can be either `completed` or `ongoing`.

##### Supported Gestures:

-   Click

##### Usage

```jsx
import ContractCard from 'deriv-components';

const DummyComponent = props => (
  <ContractCard
        contract_info={data.contract_info}
        getCardLabels={getCardLabels}
        is_multiplier={data.is_multiplier}
        profit_loss={data.profit_loss}
        should_show_result_overlay={true}
    >
);
```

#### Props

| Name                       | Type       | Default | Description                                                                                     |
| -------------------------- | ---------- | ------- | ----------------------------------------------------------------------------------------------- |
| contract_info              | {object}   | null    | The information of the contract                                                                 |
| getCardLabels              | {function} | null    | Function returns the labels to show in the card                                                 |
| getContractPath            | {function} | null    | Function returns the path to the contract information page                                      |
| is_multiplier              | {boolean}  | `false` | Defines the type of contract                                                                    |
| is_positions               | {boolean}  | `false` | Defines whether the contract is position or not                                                 |
| onClickRemove              | {function} | null    | Function triggers when user clicks on close button                                              |
| result                     | {string}   | null    | The result of the contract. one of `'won'` or `'lost'`                                          |
| profit_loss                | {number}   | null    | Fallback for the result of the contract. Won if `profit_loss > 0` and lost if `profit_loss < 0` |
| should_show_result_overlay | {boolean}  | null    | Defines the visibility of the result overlay                                                    |

---

## ContractCard Header

Renders a `Header` for the contract card

```jsx
import ContractCard from 'deriv-components';

const DummyComponent = props => (
    <ContractCard contract_info={data.contract_info}>
        <ContractCard.Header
            contract_info={data.contract_info}
            getCardLabels={getCardLabels}
            getContractTypeDisplay={getContractTypeDisplay}
            server_time={null}
        />
    </ContractCard>
);
```

#### Props

| Name                   | Type       | Default | Description                                              |
| ---------------------- | ---------- | ------- | -------------------------------------------------------- |
| contract_info          | {object}   | null    | The information of the contract                          |
| getCardLabels          | {function} | null    | Function returns the labels to show in the card          |
| getContractTypeDisplay | {function} | null    | Function returns the display name of the contract type   |
| has_progress_slider    | {boolean}  | null    | Defines visibility of the sidebar. For ongoing contracts |
| is_mobile              | {boolean}  | null    | Shows whether the device is mobile or not                |
| is_sell_requested      | {boolean}  | null    | Shows whether the user requested for sell or not         |
| is_sold                | {boolean}  | null    | Shows whether the contract is sold or not                |
| onClickSell            | {function} | null    | Function triggers when user clicks on sell button        |
| server_time            | {object}   | null    | The server time moment object                            |

---

## ContractCard Body

Renders a `Body` for the contract card

```jsx
import ContractCard from 'deriv-components';

const DummyComponent = props => (
    <ContractCard contract_info={data.contract_info}>
        <ContractCard.Body
            contract_info={data.contract_info}
            contract_update={data.contract_update}
            currency={data.currency}
            getCardLabels={getCardLabels}
            is_mobile={false}
            is_multiplier={data.is_multiplier}
            status={data.status}
            server_time={toMoment(1603881751)}
        />
    </ContractCard>
);
```

#### Props

| Name          | Type       | Default | Description                                               |
| ------------- | ---------- | ------- | --------------------------------------------------------- |
| contract_info | {object}   | null    | The information of the contract                           |
| getCardLabels | {function} | null    | Function returns the labels to show in the card           |
| currency      | {string}   | null    | The contract currency                                     |
| is_multiplier | {boolean}  | null    | Defines the type of contract                              |
| is_mobile     | {boolean}  | null    | Shows whether the device is mobile or not                 |
| is_sold       | {boolean}  | null    | Shows whether the contract is sold or not                 |
| status        | {string}   | null    | The status of the contract. One of `'profit'` or `'loss'` |
| server_time   | {object}   | null    | The server time moment object                             |

---

## ContractCard Footer

Renders a `Footer` for the contract card

```jsx
import ContractCard from 'deriv-components';

const DummyComponent = props => (
    <ContractCard contract_info={data.contract_info}>
        <ContractCard.Footer
            contract_info={data.contract_info}
            getCardLabels={getCardLabels}
            server_time={data.server_time}
            status={data.status}
        />
    </ContractCard>
);
```

#### Props

| Name                             | Type       | Default | Description                                               |
| -------------------------------- | ---------- | ------- | --------------------------------------------------------- |
| contract_info                    | {object}   | null    | The information of the contract                           |
| getCardLabels                    | {function} | null    | Function returns the labels to show in the card           |
| getContractById                  | {function} | null    | Function returns the contract information                 |
| is_multiplier                    | {boolean}  | null    | Defines the type of contract                              |
| is_positions                     | {boolean}  | null    | Defines whether the contract is position or not           |
| is_sell_requested                | {boolean}  | null    | Shows whether the user requested for sell or not          |
| onClickCancel                    | {function} | null    | Function triggers when user clicks on cancel button       |
| onClickSell                      | {function} | null    | Function triggers when user clicks on sell button         |
| addToast                         | {function} | null    | Function for show toast                                   |
| removeToast                      | {function} | null    | Function for remove toast                                 |
| setCurrentFocus                  | {function} | null    | Function to set focus to the dialog                       |
| should_show_cancellation_warning | {boolean}  | null    | Defines the visibility of cancellation warning            |
| status                           | {string}   | null    | The status of the contract. One of `'profit'` or `'loss'` |
| toggleCancellationWarning        | {function} | null    | Function toggles the canellation warning                  |

---

## ContractCard Loader

Renders a `Loader` for the contract card

```jsx
import ContractCard from 'deriv-components';

const DummyComponent = props => (
    <ContractCard contract_info={data.contract_info}>
        <ContractCard.Loader speed={2} />
    </ContractCard>
);
```

#### Props

| Name  | Type     | Default | Description                  |
| ----- | -------- | ------- | ---------------------------- |
| speed | {number} | null    | Speed of the loading element |

---

## ContractCard ContractTypeCell

Renders `ContractTypeCell` for the contract card

```jsx
import ContractCard from 'deriv-components';

const DummyComponent = props => (
    <ContractCard contract_info={data.contract_info}>
        <ContractCard.ContractTypeCell
            getContractTypeDisplay={getContractTypeDisplay}
            is_high_low={isHighLow({ shortcode: contract_info.shortcode })}
            multiplier={contract_info.multiplier}
            type={type}
        />
    </ContractCard>
);
```

#### Props

| Name                   | Type       | Default | Description                                            |
| ---------------------- | ---------- | ------- | ------------------------------------------------------ |
| getContractTypeDisplay | {function} | null    | Function returns the display name of the contract type |
| is_high_low            | {boolean}  | null    | Defines whether the contract is high_low or not        |
| multiplier             | {number}   | null    | Multiplier of the contract                             |
| type                   | {string}   | null    | Type of the contract                                   |

---

## ContractCard MultiplierCloseActions

Renders `MultiplierCloseActions` for the contract card

```jsx
import ContractCard from 'deriv-components';

const DummyComponent = props => (
    <ContractCard contract_info={data.contract_info}>
        <ContractCard.MultiplierCloseActions
            contract_info={contract_info}
            getCardLabels={getCardLabels}
            is_sell_requested={is_sell_requested}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
            server_time={server_time}
        />
    </ContractCard>
);
```

#### Props

| Name                   | Type       | Default | Description                                            |
| ---------------------- | ---------- | ------- | ------------------------------------------------------ |
| getContractTypeDisplay | {function} | null    | Function returns the display name of the contract type |
| is_high_low            | {boolean}  | null    | Defines whether the contract is high_low or not        |
| multiplier             | {number}   | null    | Multiplier of the contract                             |
| type                   | {string}   | null    | Type of the contract                                   |

---

## ContractCard Sell

Renders `Sell` button for the contract card

```jsx
import ContractCard from 'deriv-components';

const DummyComponent = props => (
    <ContractCard contract_info={data.contract_info}>
        <ContractCard.Sell
            contract_info={contract_info}
            is_sell_requested={is_sell_requested}
            getCardLabels={getCardLabels}
            onClickSell={onClickSell}
        />
    </ContractCard>
);
```

#### Props

| Name                   | Type       | Default | Description                                            |
| ---------------------- | ---------- | ------- | ------------------------------------------------------ |
| getContractTypeDisplay | {function} | null    | Function returns the display name of the contract type |
| is_high_low            | {boolean}  | null    | Defines whether the contract is high_low or not        |
| multiplier             | {number}   | null    | Multiplier of the contract                             |
| type                   | {string}   | null    | Type of the contract                                   |

## Full example:

```jsx
import React, { useState } from 'react';
import ContractCard from 'deriv-components';

const DummyComponent = props => {
    const data = {}; // a contract data

    return (
        <React.Fragment>
            <div className={'contract-card__wrapper'}>
                <ContractCard
                    contract_info={data.contract_info}
                    getCardLabels={getCardLabels}
                    is_multiplier={false}
                    profit_loss={data.profit_loss}
                    should_show_result_overlay={true}
                >
                    <ContractCard.Header
                        contract_info={data.contract_info}
                        getCardLabels={getCardLabels}
                        getContractTypeDisplay={getContractTypeDisplay}
                        has_progress_slider={!data.is_multiplier}
                        is_mobile={false}
                        is_sell_requested={false}
                    />
                    <ContractCard.Body
                        contract_info={data.contract_info}
                        currency={data.currency}
                        getCardLabels={getCardLabels}
                        is_mobile={false}
                        is_sold={true}
                        is_multiplier={data.is_multiplier}
                        status={data.status}
                    />
                    <ContractCard.Footer
                        contract_info={data.contract_info}
                        getCardLabels={getCardLabels}
                        is_multiplier={data.is_multiplier}
                        is_positions
                        setCurrentFocus={true}
                        should_show_cancellation_warning={false}
                        status={data.status}
                    />
                </ContractCard>
            </div>
        </React.Fragment>
    );
};
```

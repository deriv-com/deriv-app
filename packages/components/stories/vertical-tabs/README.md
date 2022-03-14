# VerticalTab component

Use this component to show vertical tabs

#### Supported Events

-   onClickClose

## Usage

```jsx
import React from 'react';
import { VerticalTab } from 'deriv-components';

const DummyComponent = props => (
     const [_, setVerticalTabIndex] = React.useState(0);

    <VerticalTab
        header_title={props.header_title}
        action_bar={props.action_bar}
        current_path='/'
        list={props.list}
        vertical_tab_index={0}
        setVerticalTabIndex={setVerticalTabIndex}
    />
);
```

## Props

| Name                 | Type       | Default | Description                                                                    |
| -------------------- | ---------- | ------- | ------------------------------------------------------------------------------ |
| action_bar           | {array}    | `null`  | tab contents and action handler                                                |
| action\_bar\_classname | {string}   | `''`    | additional custom class name for action bar                                    |
| className            | {string}   | `''`    | additional custom class name for the vertical tab                              |
| current_path         | {string}   | `''`    | the default selected path as per the `list` props                              |
| extra_content        | {string}   | `''`    | additional content below the sidebar menu                                      |
| extra\_offset         | {number}   | `null`  | offset value for sidebar menu when `is_floating` is enabled                    |
| header_classname     | {boolean}  | `false` | addtional custom class for the header                                          |
| header_title         | {string}   | `''`    | text for the header                                                            |
| is_collapsible       | {boolean}  | `false` | allow collapse on sidebar menu                                                 |
| is_floating          | {boolean}  | `false` | floating sidebar menu                                                          |
| is_grid              | {boolean}  | `false` | customized full width vertical tab                                             |
| is\_full\_width        | {boolean}  | `false` | use full width of parent container                                             |
| is_routed            | {boolean}  | `false` | is routing enabled                                                             |
| is\_sidebar\_enabled   | {array}    | `true ` | show or hide sidebar                                                           |
| list                 | {array}    | `[]`    | array of menu for sidebar                                                      |
| list_groups          | {array}    | `[]`    | array of sub menu of sidebar menus                                             |
| onClickClose         | {function} | `null`  | if assigned, it will show a close icon that will trigger the callback function |
| setVerticalTabIndex  | {function} | `null`  | a react hook setter for setting the current tab index                          |
| title                | {string}   | `''`    | vertical tab title                                                             |
| vertical\_tab\_index   | {number}   | `null`  | current selected tab index                                                     |

## Full example:

```jsx
import React from 'react';
import { VerticalTab } from 'deriv-components';

const DummyComponent = () => {
    const [_, setVerticalTabIndex] = React.useState(0);
    const list2 = [
        {
            label: 'Option 1',
            value: () => (
                <div>
                    Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                    enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                    nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                    mollit anim id est laborum.
                </div>
            ),
        },
        {
            label: 'Option 2',
            value: () => (
                <div>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
                    dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                    sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
                    est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius
                    modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
                    veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea
                    commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
                    molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                </div>
            ),
        },
    ];

    return (
        <VerticalTab
            action_bar={[
                {
                    onClick: () => {},
                    title: 'Close',
                },
                {
                    component: () => (
                        <div
                            style={{
                                color: 'var(--text-prominent)',
                                fontSize: '14px',
                            }}
                        >
                            Tab Description
                        </div>
                    ),
                    title: 'Test',
                },
            ]}
            action_bar_classname='action-bar-class'
            className='custom-class'
            current_path='/'
            extra_content='Additional content here'
            extra_offset={10}
            has_mixed_dimensions={true}
            header_classname='custom-header-class'
            header_title='Sidebar Head'
            is_collapsible={false}
            is_floating={true}
            is_grid={true}
            is_full_width={false}
            is_routed={false}
            is_sidebar_enabled={false}
            list={list}
            list_groups={[]}
            onClickClose={() => console.log('clicked!')}
            setVerticalTabIndex={setVerticalTabIndex}
            tab_headers_note='header note'
            title='my title'
            vertical_tab_index={0}
        />
    );
};
```

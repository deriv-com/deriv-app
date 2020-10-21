# MobileDrawer Component

Renders drawer menu in mobile view.

#### Supported Gestures:

-   Click
-   Touch / Drag gestures

## Usage

```jsx
import { MobileDrawer } from 'deriv-components';

const DummyComponent = props => (
    <MobileDrawer
        alignment='left'
        is_open
        title='Menu'
        height='100vh'
        width='295px'
    >       
        <MobileDrawer.Body>
            <MobileDrawer.Item>
                <p>Menu item 1</p>
            </MobileDrawer.Item>
            <MobileDrawer.Item>
                <p>Menu item 2</p>
            </MobileDrawer.Item>
        </MobileDrawer.Body>
    </MobileDrawer>
);
```


## Props

| Name                  | Type                | Default   | Description                                         |
| --------------------- | ------------------- | ----------| --------------------------------------------------- |
| children              | {react node}        | null      | Menu items, Header, Footer and etc.                 |
| alignment             | {string}            | `'left'`  | Menu alignment (`'left'` or `'right'`)              |
| id                    | {string}            | null      | `id` of the main menu                               |
| is_open `*required`   | {boolean}           | null      | State of the menu on first load                     |
| className `*optional` | {string}            | null      | ClassName for menu                                  |
| toggle `*required`    | {function}          | undefined | Callback function for setting `is_open` property    |
| title                 | {string or boolean} | null      | Title of the menu or `false` for no title           |
| height                | {string}            | `'auto'`  | Height of the main menu                             |
| width                 | {string}            | `'auto'`  | Width of the main menu                              |


---

# Sub Components

## SubHeader
  Renders a sub header section for the drawer menu.
  
##### Props

| Name                         | Type         | Default    | Description                 |
| ---------------------------- | ------------ | ---------- | --------------------------- |
| children                     | {react node} | null       | Elements inside SubHeader   |
| className `*optional`        | {string}     | null       | ClassName for SubHeader     |
 

##### Usage

```jsx
import { MobileDrawer } from 'deriv-components';

const DummyComponent = props => (
    <MobileDrawer alignment='left' is_open >
        <MobileDrawer.SubHeader>
            <p>This is Sub Header</p>
        </MobileDrawer.SubHeader>
    </MobileDrawer>
);
```

## Footer
  Renders footer section for the drawer menu.
  
##### Props

| Name                         | Type         | Default | Description              |
| ---------------------------- | ------------ | ------- | ------------------------ |
| children                     | {react node} | null    | Elements inside Footer   |
| className `*optional`        | {string}     | null    | ClassName for Footer     |
 

##### Usage

```jsx
import { MobileDrawer } from 'deriv-components';

const DummyComponent = props => (
    <MobileDrawer alignment='left' is_open >   
        <MobileDrawer.Footer>
            <p>This is Footer</p>
        </MobileDrawer.Footer>
    </MobileDrawer>
);
```
## Body
Renders the main section for the drawer menu. 
  
##### Props

| Name                         | Type         | Default  | Description            |
| ---------------------------- | ------------ | -------- | ---------------------- |
| children                     | {react node} | null     | Elements inside Body   |
| className `*optional`        | {string}     | null     | ClassName for Body     |
 

##### Usage

```jsx
import { MobileDrawer } from 'deriv-components';

const DummyComponent = props => (
    <MobileDrawer alignment='left' is_open >
        <MobileDrawer.Body>
            <p>This is Body</p>
        </MobileDrawer.Body>
    </MobileDrawer>
);
```
## Item
Renders items such as link buttons for the drawer menu. 
  
##### Props

| Name                         | Type         | Default   | Description                             |
| ---------------------------- | ------------ | --------- | --------------------------------------- |
| children                     | {react node} | null      | Elements inside Item                    |
| className `*optional`        | {string}     | null      | ClassName for Item                      |
| onClick `*optional`          | {function}   | null      | Will call when users clicks on Item     |
 

##### Usage

```jsx
import { MobileDrawer } from 'deriv-components';

const DummyComponent = props => (
    <MobileDrawer alignment='left' is_open >
        <MobileDrawer.Body>
            <MobileDrawer.Item onClick={()=>{alert('Item Clicked!')}}>
                <p>Menu item</p>
            </MobileDrawer.Item>
        </MobileDrawer.Body>
    </MobileDrawer>
);
```
## SubMenu
Renders a submenu inside the maindrawer menu. The submenu will show over the main menu when user clicks on the submenu item.
  
##### Props

| Name                             | Type         | Default | Description                                   |
| -------------------------------- | ------------ | ------- | --------------------------------------------- |
| children                         | {react node} | null    | Elements inside Submenu                       |
| onToggle                         | {function}   | null    | Toggles Submenu visability                    |
| has_subheader                    | {boolean}    | null    | Defines whether Submenu has SubHeader or not  | 
| submenu_icon `*optional`         | {string}     | null    | Name of the Icon for Submenu                  |
| submenu\_suffix\_icon `*optional`| {string}     | null    | Name of the suffix Icon for Submenu           |
| submenu_title                    | {string}     | null    | Title of the Submenu                          |
| submenu\_toggle\_class `*optional`| {string}    | null    | ClassName for Submenu                         |
 

##### Usage

```jsx
import { MobileDrawer } from 'deriv-components';

const DummyComponent = props => (
    <MobileDrawer alignment='left' is_open >
        <MobileDrawer.Body>
           <MobileDrawer.SubMenu
                has_subheader
                submenu_icon='IcStage1'
                submenu_title={'SubMenu Title'}
                submenu_suffix_icon='IcChevronRight'
                onToggle={()=>{}}
            >
                <MobileDrawer.Item>
                    <p>SubMenu item</p>
                </MobileDrawer.Item>
            </MobileDrawer.SubMenu>
        </MobileDrawer.Body>
    </MobileDrawer>
);
```
## SubMenuSection
Renders a SubMenuSection inside the Submenu.

##### Props


| Name              | Type         | Default | Description                                   |
| ----------------- | ------------ | ------- | --------------------------------------------- |
| children          | {react node} | null    | Elements inside Submenu                       |
| section_icon      | {function}   | null    | Name of the Icon for SubmenuSection           |
| section_title     | {boolean}    | null    | Title of the SubmenuSection                   | 
 

##### Usage

```jsx
import { MobileDrawer } from 'deriv-components';

const DummyComponent = props => (
    <MobileDrawer alignment='left' is_open >
        <MobileDrawer.Body>
           <MobileDrawer.SubMenu
                has_subheader
                submenu_icon='IcStage1'
                submenu_title={'SubMenu Title'}
                submenu_suffix_icon='IcChevronRight'
                onToggle={()=>{}}
            >
                <MobileDrawer.SubMenuSection
                    section_icon={'IcStage2'}
                    section_title={'SubMenu Section'}
                >
                    <MobileDrawer.Item key={idx}>
                        <p>Section Item</p>
                    </MobileDrawer.Item>
                </MobileDrawer.SubMenuSection>
            </MobileDrawer.SubMenu>
        </MobileDrawer.Body>
    </MobileDrawer>
);
```


# Full example:

```jsx
import { Clipboard } from 'deriv-components';

const DummyComponent = props => (
    <MobileDrawer
        alignment='left'
        is_open
        title='Menu'
        height='100vh'
        width='295px'
    >   
        <MobileDrawer.SubHeader>
            <p>This is Sub Header</p>
        </MobileDrawer.SubHeader> 
    
        <MobileDrawer.Body>
            <MobileDrawer.Item>
                <p>Menu item 1</p>
            </MobileDrawer.Item>
            <MobileDrawer.SubMenu
                has_subheader
                submenu_icon='IcStage1'
                submenu_title={'SubMenu Title'}
                submenu_suffix_icon='IcChevronRight'
                onToggle={()=>{}}
            >
                <MobileDrawer.SubMenuSection
                    section_icon={'IcStage2'}
                    section_title={'SubMenu Section'}
                >
                    <MobileDrawer.Item key={idx}>
                        <p>Section Item</p>
                    </MobileDrawer.Item>
                </MobileDrawer.SubMenuSection>
            </MobileDrawer.SubMenu>
        </MobileDrawer.Body>

        <MobileDrawer.Footer>
            <p>This is Footer</p>
        </MobileDrawer.Footer>
    </MobileDrawer>
);
```

# Content Expander component
Renders a simple toggle-able content section that can be expanded and collapsed.

## Usage
 
```jsx
import { ContentExpander } from '@deriv-components';

const DummyComponent = (props) => (
    <ContentExpander header='Title' is_expanded={true}>
        <p>Expanded Content Here...</p>
    </ContentExpander>
)
```

## Props

| Name                     | Type                   | Default | Description                                                                                                              |
|--------------------------|------------------------|---------|--------------------------------------------------------------------------------------------------------------------------|
| className `*optional`     | {string} |    | Set a custom className for component .                                                                                    |                                                            |
| header                    | {string or object}               |    | Adds title besides the arrow button to the container.                               |
| header_className `*optional` | {string} | | Sets a custom className for the header title if header is string.
| is_expanded `*optional` | {boolean}              | false   | Sets whether the content should be expanded by default.     
| is_title_spaced, `*optional` | {boolean}              | false   | Sets whether the title string or element should be spaced between arrow icon.     
| title_color `*optional` | {boolean}              | false   | Sets the color of the title if title is string.     
| onToggle `*optional` | {function}              |    | a callBack function when toggle is fired.     
| is_arrow_inverted `*optional` | {boolean}              | false   | Sets if arrow icon orientation should be inverted.     


## Full example:

```jsx
import { Icon, Text, ContentExpander } from '@deriv-components';

const title_element = (username) => (
    <div>
        <Icon icon='IcUser' />
        <Text color='prominent'>
            {username}
        </Text>
    <div/>
);

const onUserToggle = (bool) => {
    if (bool) {
        // do something
    }
};

const UserSection = (props) => (
    <ContentExpander 
        header={props.username} 
        is_expanded 
        onToggle={onUserToggle}
    >
        {props.user_content}
    </ContentExpander>
);
```

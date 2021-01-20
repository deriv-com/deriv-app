# Content Expander component
Renders a simple toggle-able content section that can be expanded and collapsed.

## Usage
 
```jsx
import { ContentExpander } from '@deriv-components';

const DummyComponent = (props) => (
    <ContentExpander 
        title='Title' is_expanded={true} 
        title_style={{ color: 'general' }}
    >
        <p>Expanded Content Here...</p>
    </ContentExpander>
)
```

## Props

| Name                     | Type                   | Default | Description                                                                                                              |
|--------------------------|------------------------|---------|--------------------------------------------------------------------------------------------------------------------------|
| className `*optional`     | {string} |    | Set a custom className for toggle component .                                                                                    |                                                            |
| title                  | {string or object}               |    | Adds title besides the arrow button to the container.                               |
| title_className `*optional` | {string} | | Sets a custom className for the title if title is string.
| is_expanded `*optional` | {boolean}              | false   | Sets whether the content should be expanded by default.     
| is_title_spaced, `*optional` | {boolean}              | false   | Sets whether the title string or element should be spaced between arrow icon.     
| title_style `*optional` | {object}              |    | Sets the props of the Text for the title if title is string.     
| onToggle `*optional` | {function}              |    | a callBack function when toggle is fired.     
| is_arrow_inverted `*optional` | {boolean}              | false   | Sets if arrow icon orientation should be inverted.     
| wrapper_className `*optional` | {string}              |    | Sets className for component wrapper.     
| arrow_style `*optional` | {object}              |    | Sets styles for arrow icon component.     
| has_fade_in `*optional` | {boolean}              |    | Apply fade transition for expanded content.     


## Full example:

```jsx
import { Icon, Text, ContentExpander } from '@deriv-components';

const UserTitle = (username) => (
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
        is_expanded
        is_title_spaced
        header={userTitle(props.username)} 
        onToggle={onUserToggle}
    >
        {props.user_content}
    </ContentExpander>
);
```

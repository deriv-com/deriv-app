import React from 'react';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { Autocomplete } from '@deriv/components';

const Shortcut = () => {
    const [show_input, setShowInput] = React.useState(false);
    const history = useHistory();
    const routes_array = Object.entries(routes).map(item => ({ value: item[1], text: item[0] }));

    React.useEffect(() => {
        const handleEvent = event => {
            if (event.code === 'KeyR' && event.ctrlKey && event.altKey) {
                setShowInput(true);
            }

            if (event.code === 'Escape') {
                setShowInput(false);
            }
        };

        document.addEventListener('keydown', handleEvent);

        return () => {
            document.removeEventListener('keydown', handleEvent);
        };
    }, []);

    const handleSelection = ({ value, text }) => {
        if (routes[text]) {
            history.push(value);
            setShowInput(false);
        }
    };

    if (show_input) {
        return (
            <div className='short-cut' data-testid='short-cut'>
                <div className='short-cut__wrapper'>
                    <Autocomplete
                        data-lpignore='true'
                        data-testid='short-cut-input'
                        autoFocus={true}
                        autoComplete='off' // prevent chrome autocomplete
                        type='text'
                        label={'Enter route'}
                        list_items={routes_array}
                        onItemSelection={handleSelection}
                    />
                </div>
            </div>
        );
    }
    return null;
};

export default Shortcut;

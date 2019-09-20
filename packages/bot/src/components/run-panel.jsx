import { Button, Drawer, Tabs } from 'deriv-components';
import classNames               from 'classnames';
import React                    from 'react';
import TradeAnimation           from './trade-animation.jsx';
import { IconInfoOutline }      from './Icons.jsx';
import '../assets/sass/run-panel.scss';

const onRunBotClick = () => {
    console.log('run bot'); // eslint-disable-line no-console
};

const drawerContent = contract_status => {
    return (
        <Tabs>
            <div label='Summary' >
                <TradeAnimation status={contract_status}  />
            </div>
            <div label='Transations'  />
            <div label='Journal'  />
        </Tabs>
    );
};

const drawerFooter = (props) => {
    return (
        <div className='run-panel__footer'>
            <Button
                className={classNames(
                    'btn--flat',
                    'run-panel__button'
                )}
                text='Clear stat'
                onClick={props.onClick}
                has_effect
            />

            <Button
                className={classNames(
                    'btn--primary',
                    'run-panel__button'
                )}
                text='Run bot'
                onClick={props.onClick}
                has_effect
            />
        
            <IconInfoOutline className='run-panel__icon-info' />
        </div>
    );
};

// Temperarily change to state component to test animation
class RunPanel extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            contract_status: 0,
        };
    }

    componentDidMount () {
        setInterval(() => {
            let next_status;
            if (this.state.contract_status >= 4) {
                next_status = 0;
            } else {
                next_status = this.state.contract_status + 1;
            }

            this.setState({ contract_status: next_status });
        }, 2000);
    }

    render () {
        const content = drawerContent(this.state.contract_status);
        const footer = drawerFooter(onRunBotClick);
    
        return (
            <Drawer
                className='run-panel'
                is_open={true}
                footer={footer}
            >
                {content}
            </Drawer>
        );
    }
}

// const RunPanel = () => {
//     const content = drawerContent();
//     const footer = drawerFooter(onRunBotClick);

//     return (
//         <Drawer
//             className='run-panel'
//             is_open={true}
//             footer={footer}
//         >
//             {content}
//         </Drawer>
//     );
// };

export default RunPanel;

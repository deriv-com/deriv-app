import React from 'react';
import PropTypes from 'prop-types';
import * as config from './help-content.config';
import FlyoutVideo from './help-components/flyout-video.jsx';
import FlyoutText from './help-components/flyout-text.jsx';
import FlyoutImage from './help-components/flyout-img.jsx';
import FlyoutBlockWorkspace from '../../components/flyout-block-workspace.jsx';
import { connect } from '../../stores/connect';
import { translate } from '../../utils/lang/i18n';

class HelpBase extends React.Component {
    constructor(props) {
        super(props);
        const { onSequenceClick, nodes } = props;

        this.state = {
            onSequenceClick,
            nodes,
            help_string: null,
        };
    }

    getHelpString = async nodes => {
        const title = nodes[0].getAttribute('type');
        const help_string = await import(`./help-string/${title}.json`);
        this.setState({ help_string, title });
    }

    componentDidMount() {
        const { nodes } = this.state;
        this.getHelpString(nodes);
    }

    componentWillReceiveProps(new_props) {
        const { nodes } = new_props;
        if (this.state !== new_props) {
            this.setState({ ...new_props });
        }

        this.getHelpString(nodes);
    }

    render() {
        const { onSequenceClick, title, nodes, help_string } = this.state;
        const block_config = config[title];
        const component_order = block_config && block_config.order;

        return (
            help_string ?
                <React.Fragment>
                    <div className='flyout__help-header'>
                        <button className='flyout__item-btn flyout__item-btn-back' onClick={() => Blockly.derivWorkspace.reshowFlyout()}>⬅</button>
                        <span className='flyout__help-title'>{this.state.title}</span>
                    </div>
                    <div className='flyout__help-content'>
                        {
                            component_order.map(component => {
                                switch (component) {
                                    case 'description':
                                        return (
                                            <FlyoutText text={help_string.description} />
                                        );
                                    case 'explanation':
                                        return (
                                            <FlyoutText text={help_string.explanation} />
                                        );
                                    case 'video':
                                        return (
                                            <FlyoutVideo url={block_config.video_url} />
                                        );
                                    case 'image':
                                        return (
                                            <FlyoutImage url={block_config.img_url} />
                                        );
                                    case 'block':
                                    {
                                        return Object.keys(nodes).map(key => {
                                            return (
                                                <FlyoutBlockWorkspace
                                                    key={key}
                                                    should_center_block={true}
                                                    block_node={nodes[key]}
                                                />
                                            );
                                        });
                                    }
                                    default:
                                        return <></>;
                                }
                            })
                        }
                    </div>
                    <div className='flyout__help-footer'>
                        <button className='flyout__item-btn flyout__item-btn-previous' onClick={() => onSequenceClick(title, 'previous')}>Previous</button>
                        <button className='flyout__item-btn flyout__item-btn-next' onClick={() => onSequenceClick(title, 'next')}>Next</button>
                    </div>
                </React.Fragment > :
                <div>{translate('Loading...')}</div>
        );
    }
}

HelpBase.propTypes = {
    nodes          : PropTypes.any,
    onSequenceClick: PropTypes.func,
    title          : PropTypes.string,
};

export default connect(({ flyout }) => ({
    onSequenceClick: flyout.onSequenceClick,
}))(HelpBase);

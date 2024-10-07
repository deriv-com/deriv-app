import { getImageLocation } from '../../public-path';
import { localize } from '@deriv/translations';
import { TFaqContent, TGuideContent, TQuickStrategyContent, TUserGuideContent } from './tutorials.types';

export const USER_GUIDE = 'user guide';
export const VIDEOS = 'videos on deriv bot';
export const QUICK_STRATEGY_GUIDES = 'quick strategy guides';

export const user_guide_content: TUserGuideContent[] = [
    {
        id: 1,
        type: 'Tour',
        subtype: 'OnBoard',
        content: localize('Get started on Deriv Bot'),
        src: getImageLocation('dbot-onboard-tour.png'),
        search_id: `${USER_GUIDE}-0`,
    },
    {
        id: 2,
        type: 'Tour',
        subtype: 'BotBuilder',
        content: localize('Let’s build a bot!'),
        src: getImageLocation('bot-builder-tour.png'),
        search_id: `${USER_GUIDE}-1`,
    },
];

export const guide_content: TGuideContent[] = [
    {
        id: 1,
        type: 'DBotVideo',
        content: localize('An introduction to Deriv Bot'),
        url: 'https://www.youtube.com/embed/lthEgaIY1uw',
        src: getImageLocation('intro_to_deriv_bot.png'),
        search_id: `${VIDEOS}-0`,
    },
    {
        id: 2,
        type: 'DBotVideo',
        content: localize('How to build a basic trading bot with Deriv Bot'),
        url: 'https://www.youtube.com/embed/mnpi2g7YakU',
        src: getImageLocation('build_a_bot.png'),
        search_id: `${VIDEOS}-1`,
    },
    {
        id: 3,
        type: 'DBotVideo',
        content: localize('How to use Martingale strategy on Deriv Bot'),
        url: 'https://www.youtube.com/embed/FSslvF7P00I',
        src: getImageLocation('how_to_use_martingale.jpg'),
        search_id: `${VIDEOS}-2`,
    },
    {
        id: 4,
        type: 'DBotVideo',
        content: localize('Introducing Accumulator Options on Deriv Bot: Available for automated trading'),
        url: 'https://www.youtube.com/embed/uMBBmdNaadU',
        src: getImageLocation('introducing_accumulators_on_deriv_bot.png'),
        search_id: `${VIDEOS}-3`,
    },
];

export const faq_content: TFaqContent[] = [
    {
        title: localize('What is Deriv Bot?'),
        description: [
            {
                type: 'text',
                content: localize(
                    "Deriv Bot is a web-based strategy builder for trading digital options. It’s a platform where you can build your own automated trading bot using drag-and-drop 'blocks'."
                ),
            },
        ],
        search_id: 'faq-0',
    },
    {
        title: localize('Where do I find the blocks I need?'),
        description: [
            {
                type: 'text',
                content: localize('Follow these steps:'),
            },
            {
                type: 'text',
                content: localize('1. Go to <strong>Bot Builder</strong>.'),
            },
            {
                type: 'text',
                content: localize(
                    "2. Under the <strong>Blocks menu</strong>, you'll see a list of categories. Blocks are grouped within these categories. Choose the block you want and drag them to the workspace."
                ),
            },
            {
                type: 'image',
                src: getImageLocation('blocks_menu.png'),
            },
            {
                type: 'text',
                content: localize(
                    '3. You can also search for the blocks you want using the search bar above the categories.'
                ),
            },
            {
                type: 'image',
                src: getImageLocation('blocks_menu_search.png'),
            },
            {
                type: 'text',
                content: localize(
                    'For more info, <a href="https://deriv.com/blog/posts/build-a-basic-trading-bot-with-deriv-bot" rel="noopener noreferrer" target="_blank">check out this blog post</a> on the basics of building a trading bot.'
                ),
            },
        ],
        search_id: 'faq-1',
    },
    {
        title: localize('How do I remove blocks from the workspace?'),
        description: [
            {
                type: 'text',
                content: localize(
                    'Click on the block you want to remove and press <strong>Delete</strong> on your keyboard.'
                ),
            },
        ],
        search_id: 'faq-2',
    },
    {
        title: localize('How do I create variables?'),
        description: [
            {
                type: 'text',
                content: localize(
                    '1. Under the <strong>Blocks</strong> menu, go to <strong>Utility > Variables</strong>.'
                ),
            },
            {
                type: 'text',
                content: localize(
                    '2. Enter a name for your variable, and hit <strong>Create</strong>. New blocks containing your new variable will appear below.'
                ),
            },
            {
                type: 'text',
                content: localize('3. Choose the block you want and drag it to the workspace.'),
            },
        ],
        search_id: 'faq-3',
    },
    {
        title: localize('Do you offer pre-built trading bots on Deriv Bot?'),
        description: [
            {
                type: 'text',
                content: localize(
                    "Yes, you can get started with a pre-built bot using the <strong>Quick strategy</strong> feature. You’ll find some of the most popular trading strategies here: Martingale, D'Alembert, and Oscar's Grind. Just select the strategy, enter your trade parameters, and your bot will be created for you. You can always tweak the parameters later."
                ),
            },
        ],
        search_id: 'faq-4',
    },
    {
        title: localize('What is a quick strategy?'),
        description: [
            {
                type: 'text',
                content: localize(
                    "A quick strategy is a ready-made strategy that you can use in Deriv Bot. There are 3 quick strategies you can choose from: Martingale, D'Alembert, and Oscar's Grind."
                ),
            },
            {
                type: 'text',
                content: localize('<strong>Using a quick strategy</strong>'),
            },
            {
                type: 'text',
                content: localize('1. Go to <strong>Quick strategy</strong> and select the strategy you want.'),
            },
            {
                type: 'text',
                content: localize('2. Select the asset and trade type.'),
            },
            {
                type: 'text',
                content: localize('3. Set your trade parameters and hit <strong>Run</strong>.'),
            },
            {
                type: 'text',
                content: localize(
                    '4. Once the blocks are loaded onto the workspace, tweak the parameters if you want, or hit <strong>Run</strong> to start trading.'
                ),
            },
            {
                type: 'text',
                content: localize(
                    '5. Hit <strong>Save</strong> to download your bot. You can choose to download your bot to your device or your Google Drive.'
                ),
            },
        ],
        search_id: 'faq-5',
    },
    {
        title: localize('How do I save my strategy?'),
        description: [
            {
                type: 'text',
                content: localize(
                    'In <strong>Bot Builder</strong>, hit <strong>Save</strong> on the toolbar at the top to download your bot. Give your bot a name, and choose to download your bot to your device or Google Drive. Your bot will be downloaded as an XML file.'
                ),
            },
        ],
        search_id: 'faq-6',
    },
    {
        title: localize('How do I import my own trading bot into Deriv Bot?'),
        description: [
            {
                type: 'text',
                content: localize(
                    'Just drag the XML file from your computer onto the workspace, and your bot will be loaded accordingly. Alternatively, you can hit <strong>Import</strong> in <strong>Bot Builder</strong>, and choose to import your bot from your computer or from your Google Drive.'
                ),
            },
            {
                type: 'text',
                content: localize('<strong>Import from your computer</strong>'),
            },
            {
                type: 'text',
                content: localize(
                    '1. After hitting <strong>Import</strong>, select <strong>Local</strong> and click <strong>Continue</strong>.'
                ),
            },
            {
                type: 'text',
                content: localize('2. Select your XML file and hit <strong>Open</strong>.'),
            },
            {
                type: 'text',
                content: localize('3. Your bot will be loaded accordingly.'),
            },
            {
                type: 'text',
                content: localize('<strong>Import from your Google Drive</strong>'),
            },
            {
                type: 'text',
                content: localize(
                    '1. After hitting <strong>Import</strong>, select <strong>Google Drive</strong> and click <strong>Continue</strong>.'
                ),
            },
            {
                type: 'text',
                content: localize('2. Select your XML file and hit <strong>Select</strong>.'),
            },
            {
                type: 'text',
                content: localize('3. Your bot will be loaded accordingly.'),
            },
        ],
        search_id: 'faq-7',
    },
    {
        title: localize('How do I reset the workspace?'),
        description: [
            {
                type: 'text',
                content: localize(
                    'In <strong>Bot Builder</strong>, hit <strong>Reset</strong> on the toolbar at the top. This will clear the workspace. Please note that any unsaved changes will be lost.'
                ),
            },
        ],
        search_id: 'faq-8',
    },
    {
        title: localize('How do I clear my transaction log?'),
        description: [
            {
                type: 'text',
                content: localize('1. Hit <strong>Reset</strong> at the bottom of stats panel.'),
            },
            {
                type: 'image',
                src: getImageLocation('reset_transaction_log.png'),
            },
            {
                type: 'text',
                content: localize('2. Hit <strong>Ok</strong> to confirm.'),
            },
            {
                type: 'image',
                src: getImageLocation('reset_transaction_log_message.png'),
            },
        ],
        search_id: 'faq-9',
    },
    {
        title: localize('How do I control my losses with Deriv Bot?'),
        description: [
            {
                type: 'text',
                content: localize(
                    'There are several ways to control your losses with Deriv Bot. Here’s a simple example of how you can implement loss control in your strategy:'
                ),
            },
            {
                type: 'image',
                src: getImageLocation('loss_control_all_block.png'),
                imageclass: 'loss-control',
            },
            {
                type: 'text',
                content: localize(
                    '<strong>1.</strong> Create the following variables and place them under <strong>Run once at start</strong>:'
                ),
            },
            {
                type: 'text',
                content: localize(
                    '• <strong>Stop loss threshold</strong>: Use this variable to store your loss limit. You can assign any amount you want. Your bot will stop when your losses hits or exceeds this amount.'
                ),
            },
            {
                type: 'text',
                content: localize('Example:'),
            },
            {
                type: 'image',
                src: getImageLocation('loss_control_set_stop_loss.png'),
            },
            {
                type: 'text',
                content: localize(
                    '• <strong>Current stake</strong>: Use this variable to store the stake amount. You can assign any amount you want, but it must be a positive number.'
                ),
            },
            {
                type: 'text',
                content: localize('Example:'),
            },
            {
                type: 'image',
                src: getImageLocation('loss_control_set_current_stake.png'),
            },
            {
                type: 'text',
                content: localize('This is how your trade parameters, variables, and trade options should look like:'),
            },
            {
                type: 'image',
                src: getImageLocation('loss_control_trade_parameters.png'),
            },
            {
                type: 'text',
                content: localize(
                    '<strong>2.</strong> Set the <strong>Purchase conditions</strong>. In this example, your bot will purchase a <strong>Rise</strong> contract when it starts and after a contract closes.'
                ),
            },
            {
                type: 'image',
                src: getImageLocation('loss_control_purchase_conditions.png'),
            },
            {
                type: 'text',
                content: localize(
                    '<strong>3.</strong> Use a logic block to check if <strong>Total profit/loss</strong> is more than the <strong>Stop loss threshold</strong> amount. You can find the <strong>Total profit/loss</strong> variable under <strong>Analysis > Stats</strong> on the <strong>Blocks menu</strong> on the left. Your bot will continue to purchase new contracts until the <strong>Total profit/loss</strong> amount exceeds the <strong>Stop loss threshold</strong> amount.'
                ),
            },
            {
                type: 'image',
                src: getImageLocation('loss_control_restart_trade_conditions.png'),
            },
        ],
        search_id: 'faq-10',
    },
    {
        title: localize('Can I run Deriv Bot on multiple tabs in my web browser?'),
        description: [
            {
                type: 'text',
                content: localize(
                    'Yes, you can. However, there are limits on your account, such as maximum number of open positions and maximum aggregate payouts on open positions. So, just keep these limits in mind when opening multiple positions. You can find more info about these limits at <a href="https://app.deriv.com/account/account-limits" rel="noopener noreferrer" target="_blank">Settings > Account limits</a>.'
                ),
            },
        ],
        search_id: 'faq-11',
    },
    {
        title: localize('Can I trade cryptocurrencies on Deriv Bot?'),
        description: [
            {
                type: 'text',
                content: localize("No, we don't offer cryptocurrencies on Deriv Bot."),
            },
        ],
        search_id: 'faq-12',
    },
    {
        title: localize('Do you sell trading bots?'),
        description: [
            {
                type: 'text',
                content: localize(
                    "No, we don't. However, you'll find quick strategies on Deriv Bot that'll help you build your own trading bot for free."
                ),
            },
        ],
        search_id: 'faq-13',
    },
    {
        title: localize('In which countries is Deriv Bot available?'),
        description: [
            {
                type: 'text',
                content: localize(
                    'We offer our services in all countries, except for the ones <a href="https://deriv.com/tnc/general-terms.pdf" rel="noopener noreferrer" target="_blank">mentioned in our terms and conditions.</a>'
                ),
            },
        ],
        search_id: 'faq-14',
    },
    {
        title: localize('If I close my web browser, will Deriv Bot continue to run?'),
        description: [
            {
                type: 'text',
                content: localize('No, Deriv Bot will stop running when your web browser is closed.'),
            },
        ],
        search_id: 'faq-15',
    },
    {
        title: localize('What are the most popular strategies for automated trading?'),
        description: [
            {
                type: 'text',
                content: localize(
                    "Three of the most commonly used strategies in automated trading are Martingale, D'Alembert, and Oscar's Grind — you can find them all ready-made and waiting for you in Deriv Bot."
                ),
            },
        ],
        search_id: 'faq-16',
    },
    {
        title: localize('How do I build a trading bot?'),
        description: [
            {
                type: 'text',
                content: localize(
                    '<a href="https://www.youtube.com/watch?v=QdI5zCkO4Gk&t=203s" rel="noopener noreferrer" target="_blank">Watch this video</a> to learn how to build a trading bot on Deriv Bot. Also, <a href="https://blog.deriv.com/posts/how-to-build-a-basic-trading-bot-with-dbot/" rel="noopener noreferrer" target="_blank">check out this blog post</a> on building a trading bot.'
                ),
            },
        ],
        search_id: 'faq-17',
    },
];

export const quick_strategy_content: TQuickStrategyContent[] = [
    {
        qs_name: 'MARTINGALE',
        type: localize('About Martingale'),
        content: [
            localize('Exploring the Martingale strategy in Deriv Bot'),
            localize('An example of Martingale strategy'),
        ],
        search_id: `${QUICK_STRATEGY_GUIDES}-0`,
    },
    {
        qs_name: 'D_ALEMBERT',
        type: localize("About D'Alembert"),
        content: [
            localize('Exploring the D’Alembert strategy in Deriv Bot'),
            localize('An example of D’Alembert strategy'),
        ],
        search_id: `${QUICK_STRATEGY_GUIDES}-1`,
    },
    {
        qs_name: 'OSCARS_GRIND',
        type: localize("About Oscar's Grind"),
        content: [
            localize('Exploring the Oscar’s Grind strategy in Deriv Bot'),
            localize('An example of Oscar’s Grind strategy'),
        ],
        search_id: `${QUICK_STRATEGY_GUIDES}-2`,
    },
    {
        qs_name: 'REVERSE_MARTINGALE',
        type: localize('About Reverse Martingale'),
        content: [
            localize('Exploring the Reverse Martingale strategy in Deriv Bot'),
            localize('An example of Reverse Martingale strategy'),
        ],
        search_id: `${QUICK_STRATEGY_GUIDES}-3`,
    },
    {
        qs_name: 'REVERSE_D_ALEMBERT',
        type: localize('About Reverse D’Alembert'),
        content: [
            localize('Exploring the Reverse D’Alembert strategy in Deriv Bot'),
            localize('An example of Reverse D’Alembert strategy'),
        ],
        search_id: `${QUICK_STRATEGY_GUIDES}-4`,
    },
    {
        qs_name: 'STRATEGY_1_3_2_6',
        type: localize('About 1-3-2-6'),
        content: [localize('Exploring the 1-3-2-6 strategy in Deriv Bot'), localize('An example of 1-3-2-6 strategy')],
        search_id: `${QUICK_STRATEGY_GUIDES}-5`,
    },
];

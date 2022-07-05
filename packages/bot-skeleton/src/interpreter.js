import { localize } from '@deriv/translations';
import {
    cloneThorough,
    findValueByKeyRecursively,
    getFormattedText,
    formatTime,
    getRoundedNumber,
    isEmptyObject,
} from '@deriv/shared';
import JSInterpreter from '@deriv/js-interpreter';
import getInterface from './services';
import { config, log_types, unrecoverable_errors } from './constants';
import { observer as globalObserver } from './utils';
import api from './services/api/ws';
import TicksService, { getUUID } from './services/api/ticks_service';
import { DBotStore, highlightBlock } from './scratch';

JSInterpreter.prototype.takeStateSnapshot = function () {
    const newStateStack = cloneThorough(this.stateStack, undefined, undefined, undefined, true);
    return newStateStack;
};

JSInterpreter.prototype.restoreStateSnapshot = function (snapshot) {
    this.stateStack = cloneThorough(snapshot, undefined, undefined, undefined, true);
    this.global = this.stateStack[0].scope.object || this.stateStack[0].scope;
    this.initFunc_(this, this.global);
};

const botStarted = $scope => $scope.tradeOptions;
const shouldRestartOnError = ($scope, errorName = '') =>
    !unrecoverable_errors.includes(errorName) && $scope.options.shouldRestartOnError;

const shouldStopOnError = (errorName = '') => {
    const stopErrors = ['SellNotAvailableCustom', 'ContractCreationFailure'];
    if (stopErrors.includes(errorName)) {
        return true;
    }
    return false;
};

const timeMachineEnabled = $scope => $scope.options.timeMachineEnabled;

// TODO chek beforState & duringState & startState
const Interpreter = () => {
    const shared = {
        findValueByKeyRecursively,
        formatTime,
        getFormattedText,
        getRoundedNumber,
        isEmptyObject,
    };
    const ticksService = new TicksService(api);
    // [Todo] Needs to reduce the number of inputs
    const bot_interface = getInterface(
        api,
        ticksService,
        globalObserver,
        config,
        localize,
        log_types,
        DBotStore?.instance?.populateConfig,
        getUUID,
        shared
    );
    const $scope = bot_interface.scope;

    bot_interface.tradeEngineObserver();
    bot_interface.highlightBlock = highlightBlock;
    let interpreter = {};
    let onFinish;

    globalObserver.register('REVERT', watchName =>
        revert(watchName === 'before' ? $scope.beforeState : $scope.duringState)
    );

    function revert(state) {
        interpreter.restoreStateSnapshot(state);
        interpreter.paused_ = false;
        loop();
    }

    function loop() {
        if ($scope.stopped || !interpreter.run()) {
            onFinish(interpreter.pseudoToNative(interpreter.value));
        }
    }

    function createAsync(js_interpreter, func) {
        const asyncFunc = (...args) => {
            const callback = args.pop();

            // Workaround for unknown number of args
            const reversed_args = args.slice().reverse();
            const first_defined_arg_idx = reversed_args.findIndex(arg => arg !== undefined);

            // Remove extra undefined args from end of the args
            const function_args = first_defined_arg_idx < 0 ? [] : reversed_args.slice(first_defined_arg_idx).reverse();
            // End of workaround

            func(...function_args.map(arg => js_interpreter.pseudoToNative(arg)))
                .then(rv => {
                    callback(js_interpreter.nativeToPseudo(rv));
                    loop();
                })
                .catch(e => {
                    // e.error for errors get from API, e for code errors
                    globalObserver.emit('Error', e.error || e);
                });
        };

        // TODO: This is a workaround, create issue on original repo, once fixed
        // remove this. We don't know how many args are going to be passed, so we
        // assume a max of 100.
        const MAX_ACCEPTABLE_FUNC_ARGS = 100;
        Object.defineProperty(asyncFunc, 'length', { value: MAX_ACCEPTABLE_FUNC_ARGS + 1 });
        return js_interpreter.createAsyncFunction(asyncFunc);
    }

    function initFunc(js_interpreter, scope) {
        const pseudo_bot_interface = js_interpreter.nativeToPseudo(bot_interface);
        // Add methods to the sandbox;
        const interpreter_properties = {
            console: { type: 'pseudo', scope, custom_func: bot_interface.console },
            alert: { type: 'pseudo', scope, custom_func: bot_interface.alert },
            prompt: { type: 'pseudo', scope, custom_func: bot_interface.prompt },
            sleep: { type: 'async', scope, custom_func: bot_interface.sleep },
            getPurchaseReference: { type: 'pseudo', scope, custom_func: bot_interface.getPurchaseReference },
            purchase: { type: 'async', scope: pseudo_bot_interface, custom_func: bot_interface.purchase },
            sellAtMarket: { type: 'async', scope: pseudo_bot_interface, custom_func: bot_interface.sellAtMarket },
            checkDirection: { type: 'async', scope: pseudo_bot_interface, custom_func: bot_interface.checkDirection },
            getLastDigit: { type: 'async', scope: pseudo_bot_interface, custom_func: bot_interface.getLastDigit },
            getLastDigitList: {
                type: 'async',
                scope: pseudo_bot_interface,
                custom_func: bot_interface.getLastDigitList,
            },
            getLastTick: { type: 'async', scope: pseudo_bot_interface, custom_func: bot_interface.getLastTick },
            getOhlc: { type: 'async', scope: pseudo_bot_interface, custom_func: bot_interface.getOhlc },
            getOhlcFromEnd: { type: 'async', scope: pseudo_bot_interface, custom_func: bot_interface.getOhlcFromEnd },
            getTicks: { type: 'async', scope: pseudo_bot_interface, custom_func: bot_interface.getTicks },
            Bot: {
                type: 'pure',
                scope,
                custom_func: pseudo_bot_interface,
            },
            start: {
                type: 'pseudo',
                scope: pseudo_bot_interface,
                custom_func: (...args) => {
                    if (shouldRestartOnError($scope)) {
                        $scope.startState = js_interpreter.takeStateSnapshot();
                    }
                    bot_interface.start(...args);
                },
            },
            watch: {
                type: 'async',
                scope,
                custom_func: watchName => {
                    if (timeMachineEnabled($scope)) {
                        const snapshot = interpreter.takeStateSnapshot();
                        if (watchName === 'before') {
                            $scope.beforeState = snapshot;
                        } else {
                            $scope.duringState = snapshot;
                        }
                    }
                    return bot_interface.watch(watchName);
                },
            },
        };

        Object.keys(interpreter_properties).forEach(property => {
            const item = interpreter_properties[property];
            let custom_func;
            if (item.type === 'pseudo') {
                custom_func = js_interpreter.nativeToPseudo(item.custom_func);
            }
            if (item.type === 'async') {
                custom_func = createAsync(js_interpreter, item.custom_func);
            }
            if (item.type === 'pure') {
                custom_func = item.custom_func;
            }
            js_interpreter.setProperty(item.scope, property, custom_func);
        });
    }

    function stop() {
        const global_timeouts = globalObserver.getState('global_timeouts') ?? [];
        const is_timeouts_cancellable = Object.keys(global_timeouts).every(
            timeout => global_timeouts[timeout].is_cancellable
        );

        if (!$scope.contract_id && is_timeouts_cancellable) {
            // When user is rate limited, allow them to stop the bot immediately
            // granted there is no active contract.
            global_timeouts.forEach(timeout => clearTimeout(global_timeouts[timeout]));
            terminateSession();
        } else if ($scope.contract_flags.is_sold === false && !$scope.is_error_triggered) {
            globalObserver.register('contract.status', contractStatus => {
                if (contractStatus.id === 'contract.sold') {
                    terminateSession();
                }
            });
        } else {
            terminateSession();
        }
    }

    function terminateSession() {
        const { connection } = api;
        if (connection.readyState === 0) {
            connection.addEventListener('open', () => connection.close());
        } else if (connection.readyState === 1) {
            connection.close();
        }
        $scope.stopped = true;
        $scope.is_error_triggered = false;
        globalObserver.emit('bot.stop');
    }

    function run(code) {
        return new Promise((resolve, reject) => {
            const onError = e => {
                if ($scope.stopped) {
                    return;
                }
                // DBot handles 'InvalidToken' internally
                if (e.code === 'InvalidToken') {
                    globalObserver.emit('client.invalid_token');
                    return;
                }
                if (shouldStopOnError(e?.code)) {
                    globalObserver.emit('ui.log.error', e.message);
                    globalObserver.emit('bot.click_stop');
                    return;
                }

                $scope.is_error_triggered = true;
                if (!shouldRestartOnError($scope, e.code) || !botStarted($scope)) {
                    reject(e);
                    return;
                }
                globalObserver.emit('Error', e);
                const { initArgs, tradeOptions } = $scope;

                terminateSession();
                globalObserver.register('Error', onError);
                const { init, start } = bot_interface;
                init(...initArgs);
                start(tradeOptions);
                revert($scope.startState);
            };
            globalObserver.register('Error', onError);
            interpreter = new JSInterpreter(code, initFunc);
            onFinish = resolve;

            loop();
        });
    }

    return { stop, run, terminateSession, $scope };
};
export default Interpreter;

export const createInterpreter = () => new Interpreter();

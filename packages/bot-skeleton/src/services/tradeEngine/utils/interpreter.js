import { cloneThorough, isMultiplierContract } from '@deriv/shared';
import JSInterpreter from '@deriv/js-interpreter';
import { createScope } from './cliTools';
import Interface from '../Interface';
import { unrecoverable_errors } from '../../../constants/messages';
import { observer as globalObserver } from '../../../utils/observer';
import { api_base } from '../../api/api-base';

JSInterpreter.prototype.takeStateSnapshot = function () {
    const newStateStack = cloneThorough(this.stateStack, undefined, undefined, undefined, true);
    return newStateStack;
};

JSInterpreter.prototype.restoreStateSnapshot = function (snapshot) {
    this.stateStack = cloneThorough(snapshot, undefined, undefined, undefined, true);
    this.global = this.stateStack[0].scope.object || this.stateStack[0].scope;
    this.initFunc_(this, this.global);
};

const botInitialized = bot => bot && bot.tradeEngine.options;
const botStarted = bot => botInitialized(bot) && bot.tradeEngine.tradeOptions;
const shouldRestartOnError = (bot, errorName = '') =>
    !unrecoverable_errors.includes(errorName) && botInitialized(bot) && bot.tradeEngine.options.shouldRestartOnError;

const shouldStopOnError = (bot, errorName = '') => {
    const stopErrors = ['SellNotAvailableCustom', 'ContractCreationFailure', 'InvalidtoBuy'];
    if (stopErrors.includes(errorName) && botInitialized(bot)) {
        return true;
    }
    return false;
};

const timeMachineEnabled = bot => botInitialized(bot) && bot.tradeEngine.options.timeMachineEnabled;

// TODO chek beforState & duringState & startState
const Interpreter = () => {
    let $scope = createScope();
    let bot = Interface($scope);
    let interpreter = {};
    let onFinish;

    $scope.observer.register('REVERT', watchName =>
        revert(watchName === 'before' ? $scope.beforeState : $scope.duringState)
    );

    function init() {
        $scope = createScope();
        bot = Interface($scope);
        interpreter = {};
        onFinish = () => {};
    }

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
                    $scope.observer.emit('Error', e.error || e);
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
        const bot_interface = bot.getInterface();
        const { getTicksInterface, alert, prompt, sleep, console: custom_console } = bot_interface;
        const ticks_interface = getTicksInterface;

        js_interpreter.setProperty(scope, 'console', js_interpreter.nativeToPseudo(custom_console));
        js_interpreter.setProperty(scope, 'alert', js_interpreter.nativeToPseudo(alert));
        js_interpreter.setProperty(scope, 'prompt', js_interpreter.nativeToPseudo(prompt));
        js_interpreter.setProperty(
            scope,
            'getPurchaseReference',
            js_interpreter.nativeToPseudo(bot_interface.getPurchaseReference)
        );

        const pseudo_bot_interface = js_interpreter.nativeToPseudo(bot_interface);

        Object.entries(ticks_interface).forEach(([name, f]) =>
            js_interpreter.setProperty(pseudo_bot_interface, name, createAsync(js_interpreter, f))
        );

        js_interpreter.setProperty(
            pseudo_bot_interface,
            'start',
            js_interpreter.nativeToPseudo((...args) => {
                const { start } = bot_interface;
                if (shouldRestartOnError(bot)) {
                    $scope.startState = js_interpreter.takeStateSnapshot();
                }
                start(...args);
            })
        );

        js_interpreter.setProperty(
            pseudo_bot_interface,
            'purchase',
            createAsync(js_interpreter, bot_interface.purchase)
        );
        js_interpreter.setProperty(
            pseudo_bot_interface,
            'sellAtMarket',
            createAsync(js_interpreter, bot_interface.sellAtMarket)
        );
        js_interpreter.setProperty(scope, 'Bot', pseudo_bot_interface);
        js_interpreter.setProperty(
            scope,
            'watch',
            createAsync(js_interpreter, watchName => {
                const { watch } = bot.getInterface();

                if (timeMachineEnabled(bot)) {
                    const snapshot = interpreter.takeStateSnapshot();
                    if (watchName === 'before') {
                        $scope.beforeState = snapshot;
                    } else {
                        $scope.duringState = snapshot;
                    }
                }

                return watch(watchName);
            })
        );

        js_interpreter.setProperty(scope, 'sleep', createAsync(js_interpreter, sleep));
    }

    async function stop() {
        return new Promise((resolve, reject) => {
            try {
                const global_timeouts = globalObserver.getState('global_timeouts') ?? [];
                const is_timeouts_cancellable = Object.keys(global_timeouts).every(
                    timeout => global_timeouts[timeout].is_cancellable
                );

                if (!bot.tradeEngine.contractId && is_timeouts_cancellable) {
                    api_base.is_stopping = true;
                    // When user is rate limited, allow them to stop the bot immediately
                    // granted there is no active contract.
                    global_timeouts.forEach(timeout => clearTimeout(global_timeouts[timeout]));
                    terminateSession().then(() => {
                        api_base.is_stopping = false;
                        resolve();
                    });
                } else if (
                    bot.tradeEngine.isSold === false &&
                    !$scope.is_error_triggered &&
                    isMultiplierContract(bot?.tradeEngine?.data?.contract?.contract_type ?? '')
                ) {
                    globalObserver.register('contract.status', async contractStatus => {
                        if (contractStatus.id === 'contract.sold') {
                            terminateSession().then(() => resolve());
                        }
                    });
                } else {
                    api_base.is_stopping = true;
                    terminateSession().then(() => {
                        api_base.is_stopping = false;
                        resolve();
                    });
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    async function terminateSession() {
        return new Promise((resolve, reject) => {
            try {
                $scope.stopped = true;
                $scope.is_error_triggered = false;
                globalObserver.emit('bot.stop');
                const { ticksService } = $scope;
                // Unsubscribe previous ticks_history subscription
                // Unsubscribe the subscriptions from Proposal, Balance and OpenContract
                api_base.clearSubscriptions();

                ticksService.unsubscribeFromTicksService().then(() => {
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async function unsubscribeFromTicksService() {
        const { ticksService } = $scope;
        return new Promise((resolve, reject) => {
            try {
                ticksService.unsubscribeFromTicksService().then(() => {
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
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
                if (shouldStopOnError(bot, e?.code)) {
                    globalObserver.emit('ui.log.error', e.message);
                    globalObserver.emit('bot.click_stop');
                    return;
                }

                $scope.is_error_triggered = true;
                if (!shouldRestartOnError(bot, e.code) || !botStarted(bot)) {
                    reject(e);
                    return;
                }

                globalObserver.emit('Error', e);
                const { initArgs, tradeOptions } = bot.tradeEngine;
                terminateSession();
                init();
                $scope.observer.register('Error', onError);
                bot.tradeEngine.init(...initArgs);
                bot.tradeEngine.start(tradeOptions);
                revert($scope.startState);
            };

            $scope.observer.register('Error', onError);

            interpreter = new JSInterpreter(code, initFunc);
            onFinish = resolve;

            loop();
        });
    }

    return { stop, run, terminateSession, bot, unsubscribeFromTicksService };
};
export default Interpreter;

export const createInterpreter = () => new Interpreter();

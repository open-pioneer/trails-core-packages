// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { deprecated } from "./deprecated";
import { Resource } from "./resources";
import {
    emit,
    emitter,
    on,
    EventEmitter as ReactivityEmitter,
    SubscribeOptions
} from "@conterra/reactivity-events";

const state = Symbol("EventEmitterState");

export type EventNames<Events extends {}> = keyof Events & string;

type ArgType<T> = [T] extends [void] ? [] : [event: T];

type EventType<Events extends {}, Name extends keyof Events> = ArgType<Events[Name]>;

const deprecatedHelper = deprecated({
    name: "EventEmitter",
    packageName: "@open-pioneer/core",
    since: "v4.2.0",
    alternative: "use @conterra/reactivity-events instead"
});

const SYNC_OPT = { dispatch: "sync" } as const satisfies SubscribeOptions;
const ONCE_OPT = { dispatch: "sync", once: true } as const satisfies SubscribeOptions;

/**
 * A support class that implements emitting and listening for events.
 *
 * This class supports inheritance or direct use:
 *
 * ```js
 * const emitter = new EventEmitter();
 * class MyClass extends EventEmitter {};
 * ```
 *
 * When using this class from TypeScript, declare your supported event
 * types using an interface first:
 *
 * ```ts
 * interface Events {
 *      // key: event name, value: event type
 *      "mouse-clicked": MouseEvent;
 * }
 *
 * const emitter = new EventEmitter<Events>();
 * emitter.on("mouse-clicked", (event) => {
 *      // event is a MouseEvent
 * });
 * emitter.emit("mouse-clicked", new MouseEvent(...));
 * ```
 *
 * @deprecated Use the package [@conterra/reactivity-events](https://www.npmjs.com/package/@conterra/reactivity-events) instead.
 */
export class EventEmitter<Events extends {}> {
    private [state] = new EventEmitterState();

    constructor() {
        deprecatedHelper();
    }

    /**
     * Registers the given listener function as an event handler for `eventName`.
     *
     * The listener function should be unregistered by destroying the returned {@link Resource}
     * when it is no longer needed.
     */
    on<Name extends EventNames<Events>>(
        eventName: Name,
        listener: (...args: EventType<Events, Name>) => void
    ): Resource {
        const e = this[state].getEmitter(eventName, true);
        return on(e, listener as InternalListener, SYNC_OPT);
    }

    /**
     * Registers the given listener function to listen for `eventName` events _once_.
     * The listener function will automatically be unregistered after it has been called.
     *
     * The listener function should be unregistered by destroying the returned {@link Resource}.
     */
    once<Name extends EventNames<Events>>(
        eventName: Name,
        listener: (...args: EventType<Events, Name>) => void
    ): Resource {
        const e = this[state].getEmitter(eventName, true);
        return on(e, listener as InternalListener, ONCE_OPT);
    }

    /**
     * Emits an event of the given name and calls the registered event handlers.
     *
     * _Note:_ event handlers run synchronously.
     * After `emit()` has completed, all listeners will already have been invoked.
     */
    emit<Name extends EventNames<Events>>(eventName: Name, ...args: EventType<Events, Name>): void {
        const e = this[state].getEmitter(eventName);
        if (e) {
            emit(e, args[0]);
        }
    }
}

/**
 * Read-only version of the {@link EventEmitter} interface that only allows listening for events.
 *
 * @deprecated Use the package [@conterra/reactivity-events](https://www.npmjs.com/package/@conterra/reactivity-events) instead.
 */
export type EventSource<Events extends {}> = Pick<EventEmitter<Events>, "on" | "once">;

type InternalListener = (event: unknown) => void;

class EventEmitterState {
    private emitters = new Map<string, ReactivityEmitter<unknown>>();

    getEmitter(name: string): ReactivityEmitter<unknown> | undefined;
    getEmitter(name: string, init: true): ReactivityEmitter<unknown>;
    getEmitter(name: string, init = false) {
        let e = this.emitters.get(name);
        if (!e && init) {
            e = emitter();
            this.emitters.set(name, e);
        }
        return e;
    }
}

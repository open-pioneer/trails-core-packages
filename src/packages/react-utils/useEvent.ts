// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { useInsertionEffect, useRef } from "react";

/**
 * Creates an event handler with stable function identity.
 * The returned function will always invoke the most recent implementation of `handler`.
 *
 * The returned event handler can be used, for example, as an event handler in `useEffect()`.
 * Because the function identity is stable, `useEffect()` will not re-trigger if the implementation changes.
 *
 * > Warning: the function returned by `useEvent` must **not** be called during rendering.
 * > It can only be used in an effect or in a event handler callback.
 *
 * See also: https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
 */
export function useEvent<Args extends unknown[], Ret>(
    handler: (...args: Args) => Ret
): typeof handler {
    const handlerRef = useRef<typeof handler>(undefined);

    // Earliest timing as of React 19
    useInsertionEffect(() => {
        handlerRef.current = handler;
    });

    // useRef instead of useMemo/useCallback for guaranteed single time construction.
    const stableRef = useRef<typeof handler>(undefined);
    stableRef.current ??= function useEventHandler(...args: Args): Ret {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const currentHandler = handlerRef.current!;
        return currentHandler(...args);
    };
    return stableRef.current;
}

// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useLayoutEffect, useRef } from "react";

// TODO: Remove this hook and use useEvent from @open-pioneer/react-utils instead
// once that hook has moved in this repository.

/**
 * Creates an event handler with stable function identity.
 * The returned function will always invoke the most recent implementation of `handler`.
 *
 * The returned event handler can be used, for example, as an event handler in `useEffect()`.
 * Because the function identity is stable, `useEffect()` will not re-trigger if the implementation changes.
 *
 * NOTE: the event handler must not be called during rendering!
 *
 * See also: https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
 */
export function useEvent<Args extends unknown[], Ret>(
    handler: (...args: Args) => Ret
): typeof handler {
    const handlerRef = useRef<typeof handler | null>(null);

    useLayoutEffect(() => {
        handlerRef.current = handler;
    });

    const stableHandler = useCallback((...args: Args): Ret => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const currentHandler = handlerRef.current!;
        return currentHandler(...args);
    }, []);
    return stableHandler;
}

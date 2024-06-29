// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { ReactNode, useEffect, useState } from "react";
import { DevToolsBadge } from "./DevToolsBadge";
import { createLogger } from "@open-pioneer/core";
import { ServiceLayer } from "../service-layer/ServiceLayer";
const LOG = createLogger("runtime:dev-tools");

export interface DevToolsProps {
    /**
     * Reference to the service layer, for introspection.
     * This is kept via internal props instead of generic hooks because
     * it is not exposed via a public API.
     */
    serviceLayer: ServiceLayer;
}

export function DevTools(props: DevToolsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [devToolsContent, setDevToolsContent] = useState<ReactNode>(undefined);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        // Lazy loading without suspense.
        // Note that the content is a modal (not part of the normal document flow).
        import("./DevToolsContent")
            .then(({ DevToolsContent }) => {
                setDevToolsContent(
                    <DevToolsContent
                        onClose={() => setIsOpen(false)}
                        serviceLayer={props.serviceLayer}
                    />
                );
            })
            .catch((error) => {
                LOG.error("Failed to load dev tools content", error);
            });
    }, [isOpen, props.serviceLayer]);

    return (
        <>
            {!isOpen && <DevToolsBadge onOpen={() => setIsOpen(true)} />}{" "}
            {isOpen && devToolsContent}
        </>
    );
}

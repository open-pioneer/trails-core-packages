// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0
import { PackageContextMethods } from "@open-pioneer/runtime-react-support";
import { ComponentType, createElement } from "react";
import { Root, createRoot } from "react-dom/client";
import { RootUI } from "./RootUI";

export interface ReactIntegrationOptions {
    /** Div where react may render itself. */
    containerNode: HTMLDivElement;

    /** Component root node (e.g. shadow root), parent of `containerNode`. */
    rootNode: Node;

    /**
     * Enable or disable the global error handler.
     * Used for testing, should be `true` in production.
     */
    enableErrorHandler: boolean;
}

export interface UiStateLoading {
    type: "loading";
}

export interface UiStateError {
    type: "error";
    error: Error;
}

export interface UiStateReady {
    type: "ready";
    packageContext: PackageContextMethods;
    Component: ComponentType;
    componentProps: Record<string, unknown>;
}

export type UiState = UiStateLoading | UiStateError | UiStateReady;

export class ReactIntegration {
    private rootNode: Node;
    private reactRoot: Root;
    private enableErrorHandler: boolean;

    constructor(options: ReactIntegrationOptions) {
        this.rootNode = options.rootNode;
        this.reactRoot = createRoot(options.containerNode);
        this.enableErrorHandler = options.enableErrorHandler;
    }

    destroy() {
        this.reactRoot.unmount();
    }

    render(state: UiState) {
        this.reactRoot.render(
            createElement(RootUI, {
                rootNode: this.rootNode,
                enableErrorBoundary: this.enableErrorHandler,
                state: state
            })
        );
    }
}

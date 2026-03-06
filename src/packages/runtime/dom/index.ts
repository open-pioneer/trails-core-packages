// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

/**
 * The root node of an application.
 */
export type RootNode = Document | ShadowRoot;

/**
 * Class of the <div> that contains the entire application.
 */
export const APP_ROOT_CLASS = "pioneer-root";

export function isShadowRoot(node: RootNode): node is ShadowRoot {
    return node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && "host" in node;
}

export function isDocument(node: RootNode): node is Document {
    return !isShadowRoot(node);
}

/**
 * Returns the parent node for <style> elements.
 */
export function getStylesRoot(node: RootNode): ShadowRoot | HTMLHeadElement {
    return isShadowRoot(node) ? node : node.head;
}

/**
 * Creates the node that contains all other application content.
 */
export function createAppRoot(locale: string): HTMLDivElement {
    // Setup application root node in the shadow dom
    const container = document.createElement("div");
    container.classList.add("pioneer-root");
    container.style.minHeight = "100%";
    container.style.height = "100%";
    if (locale) {
        container.lang = locale;
    }
    return container;
}

/**
 * Returns the styles for host element (the web component node).
 */
export function getBuiltinStyles(rootNode: RootNode, hostElement: HTMLElement | undefined) {
    // Prevent inheritance of certain css values and normalize to display: block by default.
    // See https://open-wc.org/guides/knowledge/styling/styles-piercing-shadow-dom/
    // NOTE: layer base comes from chakra (used for css resets etc).
    const selector =
        isShadowRoot(rootNode) || !hostElement ? ":host" : hostElement.tagName.toLowerCase();
    return `@layer base { ${selector} { all: initial; display: block; } }`;
}

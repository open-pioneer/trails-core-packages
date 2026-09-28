// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { DeclaredService } from "@open-pioneer/runtime";

/**
 * Provides access to the browser's [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
 * for Open Pioneer Trails packages through a convenient API.
 *
 * Values are persistent and shared between all tabs of the same origin.
 *
 * Use the interface name `"local-storage.LocalStorageService"` to inject an instance of this interface.
 */
export interface LocalStorageService
    extends StorageService, DeclaredService<"local-storage.LocalStorageService"> {}

/**
 * Provides access to the browser's [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
 * for Open Pioneer Trails packages through a convenient API.
 *
 * Values are scoped to the current browser tab and are discarded when it is closed.
 *
 * Use the interface name `"local-storage.SessionStorageService"` to inject an instance of this interface.
 */
export interface SessionStorageService
    extends StorageService, DeclaredService<"local-storage.SessionStorageService"> {}

/**
 * The common interface implemented by {@link LocalStorageService} and {@link SessionStorageService}.
 *
 * Use this type to write code that works with either kind of storage.
 */
export interface StorageService extends StorageAPI {
    /**
     * Whether the underlying browser storage is supported by the current environment.
     *
     * Getters and setters working on the storage will throw if this value is `false`.
     */
    readonly isSupported: boolean;
}

/**
 * A namespace provides access to the properties of an object in the browser's storage.
 * This can be used to manage groups of related values under a common name.
 */
export type StorageNamespace = StorageAPI;

/**
 * Provides basic operations to interact with the browser's storage.
 *
 * The operations provided by this interface always act on an object in the storage:
 * either the root value or a nested object.
 */
export interface StorageAPI {
    /**
     * Returns the value associated with the given `key`, or `undefined` if
     * no such value exists.
     */
    get(key: string): unknown;

    /**
     * Associates the given `value` with `key`.
     *
     * This method supports arbitrary [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) compatible values,
     * including objects and arrays.
     * If you store an object, you can later access (or modify) its individual properties using {@link getNamespace}.
     *
     * > NOTE: This function creates a clone of the original value to protect against accidental side effects.
     * > Updating the original value after `set()` will have no effect on the stored value.
     */
    set(key: string, value: unknown): void;

    /**
     * Removes any value associated with `key`.
     */
    remove(key: string): void;

    /**
     * Removes all entries associated managed by this instance.
     *
     * If `this` represents the root object, _all_ entries will be removed.
     * If `this` represents a (possibly nested) namespace, only the contents of that
     * namespace will be removed.
     */
    removeAll(): void;

    /**
     * Returns a storage namespace operating on the given `key` that can be used to group
     * multiple related properties.
     * `key` should either be associated with an object or it's value should be undefined.
     * If `key` is not associated with a value, a new empty object will be created.
     *
     * Namespaces allow you to treat an object in the storage as a group of properties.
     * Getting (or setting) a key using a {@link StorageNamespace | Namespace} object
     * will simply read (or update) properties on the managed object instead.
     *
     * If `key` has already been set to something that is _not_ an object, you will receive an error
     * if you attempt to call this method.
     *
     * Example:
     *
     * ```js
     * const storageService = ...; // injected
     *
     * // Namespace operates on the "my-package-name" object (which may not exist yet)
     * const packageNamespace = storageService.getNamespace("my-package-name");
     *
     * // Setting the first value will ensure that the object exists
     * packageNamespace.set("foo", "bar"); // actually sets `"my-package-name" -> "foo"`
     *
     * // Retrieving the same object ("my-package-name") via get():
     * const backingObject = storageService.get("my-package-name"); // {"foo": "bar"}
     * console.log(backingObject);
     * ```
     */
    getNamespace(key: string): StorageNamespace;
}

/** Package properties of the `"local-storage"` package. */
export interface StorageProperties {
    /**
     * The root storage key used to store application state.
     * Both services use this key, each in its own storage area.
     */
    storageId: string | null;
}

/**
 * Kept for compatibility.
 * @deprecated Use {@link StorageAPI} instead.
 */
export interface LocalStorageAPI extends StorageAPI {}

/**
 * Kept for compatibility.
 * @deprecated Use {@link StorageNamespace} instead.
 */
export type LocalStorageNamespace = StorageNamespace;

/**
 * Kept for compatibility.
 * @deprecated Use {@link StorageProperties} instead.
 */
export interface LocalStorageProperties extends StorageProperties {}

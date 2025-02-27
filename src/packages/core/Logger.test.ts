// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { afterEach, it, vi, expect } from "vitest";
import { LoggerImpl } from "./Logger";

afterEach(() => {
    vi.restoreAllMocks();
});

it("logs complete DEBUG message with additional value", function () {
    const logger = new LoggerImpl("test-prefix:LoggerTest", "DEBUG");
    const logSpy = vi.spyOn(console, "debug").mockImplementation(doNothing);
    logger.debug("Test message", [{ test: 12345 }]);
    expect(logSpy).toHaveBeenCalledWith("[DEBUG] test-prefix:LoggerTest: Test message", [
        { test: 12345 }
    ]);
});

it("logs arbitrary message values formatted as strings", function () {
    const logger = new LoggerImpl("test-prefix:LoggerTest", "DEBUG");
    const logSpy = vi.spyOn(console, "debug").mockImplementation(doNothing);
    logger.debug(12345);
    expect(logSpy).toHaveBeenCalledWith("[DEBUG] test-prefix:LoggerTest: 12345");
});

it("logs INFO message", function () {
    const logger = new LoggerImpl("test-prefix:LoggerTest", "INFO");
    const logSpy = vi.spyOn(console, "info").mockImplementation(doNothing);
    logger.info("Test message");
    expect(logSpy).toHaveBeenCalledWith("[INFO] test-prefix:LoggerTest: Test message");
});

it("logs WARN message", function () {
    const logger = new LoggerImpl("test-prefix:LoggerTest", "WARN");
    const logSpy = vi.spyOn(console, "warn").mockImplementation(doNothing);
    logger.warn("Test message");
    expect(logSpy).toHaveBeenCalledWith("[WARN] test-prefix:LoggerTest: Test message");
});

it("logs ERROR message", function () {
    const logger = new LoggerImpl("test-prefix:LoggerTest", "WARN");
    const logSpy = vi.spyOn(console, "error").mockImplementation(doNothing);
    logger.error("Test message");
    expect(logSpy).toHaveBeenCalledWith("[ERROR] test-prefix:LoggerTest: Test message");
});

it("logs ERROR message with Error as message", function () {
    const logger = new LoggerImpl("test-prefix:LoggerTest", "ERROR");
    const logSpy = vi.spyOn(console, "error").mockImplementation(doNothing);
    const err = new Error("test");
    logger.error(err);
    expect(logSpy).toHaveBeenCalledWith("[ERROR] test-prefix:LoggerTest:", err);
});

it("does not log DEBUG message if WARN level configured", function () {
    const logger = new LoggerImpl("test-prefix:LoggerTest", "WARN");
    const logSpy = vi.spyOn(console, "debug").mockImplementation(doNothing);
    logger.debug("Test message");
    expect(logSpy).toBeCalledTimes(0);
});

it("isDebug method depends on log level", function () {
    const debugLogger = new LoggerImpl("test-prefix:LoggerTest", "DEBUG");
    expect(debugLogger.isDebug()).toBe(true);

    const errorLogger = new LoggerImpl("test-prefix:LoggerTest", "ERROR");
    expect(errorLogger.isDebug()).toBe(false);
});

function doNothing() {
    return;
}

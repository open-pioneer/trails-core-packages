// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { useIntl, useService } from "open-pioneer:react-hooks";
import { ReactNode } from "react";
import { ApplicationContext } from "@open-pioneer/runtime";
import {
    Center,
    Container,
    Text,
    Heading,
    List,
    Separator,
    Button,
    VStack,
    HStack
} from "@chakra-ui/react";
import { SamplePackageComponent } from "i18n-sample-package/SamplePackageComponent";

export function I18nUI() {
    const intl = useIntl();
    const appCtx = useService<ApplicationContext>("runtime.ApplicationContext");
    const locale = appCtx.getLocale();
    const supportedLocales = appCtx.getSupportedLocales();
    const name = "Müller";
    const list = ["Hans", "Peter", "Hape"];

    return (
        <Container maxWidth="xl">
            <Heading size="lg" mb={4}>
                {intl.formatMessage({ id: "content.header" })}
            </Heading>

            <Text mb={4}>{intl.formatMessage({ id: "content.description" })}</Text>

            <List.Root mb={4}>
                <List.Item>Current locale: {locale}</List.Item>
                <List.Item>Supported locales: {supportedLocales.join(", ")}</List.Item>
                <List.Item>
                    Current date and time:{" "}
                    {intl.formatDate(new Date(), { dateStyle: "full", timeStyle: "short" })}
                </List.Item>
                <List.Item>
                    Relative Time - 1:{" "}
                    {intl.formatRelativeTime(1, "minute", { numeric: "auto", style: "long" })}
                </List.Item>
                <List.Item>
                    Relative Time - 15:{" "}
                    {intl.formatRelativeTime(15, "minute", { numeric: "auto", style: "long" })}
                </List.Item>
                <List.Item>
                    Relative Time - 0:{" "}
                    {intl.formatRelativeTime(0, "minute", { numeric: "auto", style: "long" })}
                </List.Item>
                <List.Item>
                    Large number (Currency):{" "}
                    {intl.formatNumber(1234567.89, { style: "currency", currency: "EUR" })}
                </List.Item>
                <List.Item>
                    Large number (Unit):{" "}
                    {intl.formatNumber(1234567.89, { style: "unit", unit: "kilogram-per-second" })}
                </List.Item>
                <List.Item>
                    Plural - Count 0: {intl.formatMessage({ id: "content.testplural" }, { n: 0 })}
                </List.Item>
                <List.Item>
                    Plural - Count 1: {intl.formatMessage({ id: "content.testplural" }, { n: 1 })}
                </List.Item>
                <List.Item>
                    Plural - Count 2: {intl.formatMessage({ id: "content.testplural" }, { n: 2 })}
                </List.Item>
                <List.Item>List: {intl.formatList(list, { type: "conjunction" })}</List.Item>
                <List.Item>
                    Gender - female:{" "}
                    {intl.formatMessage(
                        { id: "content.testgender" },
                        { gender: "female", name: name }
                    )}
                </List.Item>
                <List.Item>
                    Gender - male:{" "}
                    {intl.formatMessage(
                        { id: "content.testgender" },
                        { gender: "male", name: name }
                    )}
                </List.Item>
                <List.Item>
                    Gender - other:{" "}
                    {intl.formatMessage(
                        { id: "content.testgender" },
                        { gender: "other", name: name }
                    )}
                </List.Item>
            </List.Root>

            <Center mb={4}>
                <LocalePicker />
            </Center>

            <Separator my={4} />

            <Text mb={4}>
                This component is from another package which does <em>not</em> support de-simple by
                itself:
            </Text>
            <SamplePackageComponent />
        </Container>
    );
}

function LocalePicker() {
    const appCtx = useService<ApplicationContext>("runtime.ApplicationContext");
    const intl = useIntl();
    const locales = appCtx.getSupportedLocales();

    // One entry for every supported locale (to force it) and one empty
    // to pick the default behavior.
    const makeButton = (locale: string | undefined) => (
        <Button key={locale ?? ""} onClick={() => appCtx.setLocale(locale)}>
            {locale ?? intl.formatMessage({ id: "picker.default" })}
        </Button>
    );
    const buttons: ReactNode[] = locales.map((locale) => makeButton(locale));
    buttons.unshift(makeButton(undefined));

    return (
        <VStack>
            <Text>{intl.formatMessage({ id: "picker.choose" })}</Text>
            <HStack gap={2}>{buttons}</HStack>
        </VStack>
    );
}

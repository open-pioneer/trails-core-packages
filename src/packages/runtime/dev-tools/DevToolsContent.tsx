// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Code,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    Heading,
    ListItem,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Table,
    Tabs,
    Tbody,
    Td,
    Tooltip,
    Tr,
    Text,
    UnorderedList,
    useDisclosure
} from "@open-pioneer/chakra-integration";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { ApplicationContext } from "../api";
import { ServiceLayer } from "../service-layer/ServiceLayer";
import { ReadonlyPackageRepr } from "../service-layer/PackageRepr";
import { useServiceInternal } from "../react-integration";
import { RUNTIME_PACKAGE_NAME } from "../builtin-services";
import type { useService as useServiceAPI } from "open-pioneer:react-hooks";

// Don't use the normal `useService` hook (generates self import).
const useService = useServiceInternal.bind(undefined, RUNTIME_PACKAGE_NAME) as typeof useServiceAPI;

export interface DevToolsContentProps {
    serviceLayer: ServiceLayer;

    onClose: () => void;
}

export function DevToolsContent(props: DevToolsContentProps) {
    const { onClose } = props;

    return (
        <DevToolsDrawer onClose={onClose}>
            <Tabs isLazy>
                <TabList>
                    <Tab>App State</Tab>
                    <Tab>Packages</Tab>
                    <Tab>Service Graph</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel px={0}>
                        <AppState />
                    </TabPanel>
                    <TabPanel px={0}>
                        <PackagesOverview serviceLayer={props.serviceLayer} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </DevToolsDrawer>
    );
}

function AppState() {
    const appContext = useService<ApplicationContext>("runtime.ApplicationContext");
    const hostElement = appContext.getHostElement();
    const shadowRoot = appContext.getShadowRoot();
    const appContainer = appContext.getApplicationContainer();
    const supportedMessageLocales = appContext.getSupportedLocales();
    const currentLocale = appContext.getLocale();
    return (
        <Table>
            <Tbody>
                <Tr>
                    <Td>Host element</Td>
                    <Td>
                        <ObjectInspector object={hostElement} />
                    </Td>
                </Tr>
                <Tr>
                    <Td>Shadow root</Td>
                    <Td>
                        <ObjectInspector object={shadowRoot} />
                    </Td>
                </Tr>
                <Tr>
                    <Td>Application container</Td>
                    <Td>
                        <ObjectInspector object={appContainer} />
                    </Td>
                </Tr>
                <Tr>
                    <Td>Supported message locales</Td>
                    <Td>
                        <ObjectInspector object={supportedMessageLocales} />
                    </Td>
                </Tr>
                <Tr>
                    <Td>Current locale</Td>
                    <Td>
                        <ObjectInspector object={currentLocale} />
                    </Td>
                </Tr>
            </Tbody>
        </Table>
    );
}

function PackagesOverview(props: { serviceLayer: ServiceLayer }) {
    const { serviceLayer } = props;
    const packages = serviceLayer.packages;

    const [activeIndices, setActiveIndices] = useState<number | number[]>([]);
    const onAccordionChange = (indices: number | number[]) => {
        setActiveIndices(indices);
    };

    const packageItems = useMemo(() => {
        const sortedPackages = Array.from(packages).sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        return sortedPackages.map((pkg) => {
            return (
                <AccordionItem key={pkg.name}>
                    <Heading as="h2" size="md">
                        <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                                {pkg.name}
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </Heading>
                    <AccordionPanel>
                        <PackageDetails pkg={pkg} />
                    </AccordionPanel>
                </AccordionItem>
            );
        });
    }, [packages]);

    return (
        <>
            <Text textAlign="center" mb={1}>
                <em>Note: only lists trails packages.</em>
            </Text>
            <HStack justify="end" spacing={4} mb={1}>
                <Button
                    variant="link"
                    size="sm"
                    // indices from 0 to N-1
                    onClick={() => setActiveIndices([...Array(packageItems.length).keys()])}
                >
                    Show all
                </Button>
                <Button variant="link" size="sm" onClick={() => setActiveIndices([])}>
                    Hide all
                </Button>
            </HStack>
            <Accordion allowMultiple index={activeIndices} onChange={onAccordionChange}>
                {packageItems}
            </Accordion>
        </>
    );
}

function PackageDetails(props: { pkg: ReadonlyPackageRepr }) {
    const { name, services, properties } = props.pkg;

    const serviceList = useMemo(() => {
        return (
            <UnorderedList>
                {services.map((service) => {
                    return <ListItem key={service.id}>{service.id}</ListItem>;
                })}
            </UnorderedList>
        );
    }, [services]);

    return (
        <Table>
            <Tbody>
                <Tr>
                    <Td>Name</Td>
                    <Td>{name}</Td>
                </Tr>
                <Tr>
                    <Td>Properties</Td>
                    <Td>
                        <CodeBlock>{JSON.stringify(properties, undefined, 4)}</CodeBlock>
                    </Td>
                </Tr>
                <Tr>
                    <Td>Services</Td>
                    <Td>{serviceList}</Td>
                </Tr>
            </Tbody>
        </Table>
    );
}

function ObjectInspector(props: { object: unknown; displayText?: string }) {
    const { object, displayText } = props;
    const renderedObject = displayText ?? String(object);

    return (
        <Box position="relative">
            <Code>{renderedObject}</Code>
            <Tooltip label="Dump to console" placement="top">
                <Button
                    position="absolute"
                    top="0"
                    right="0"
                    p={0}
                    pl={1}
                    m={0}
                    minWidth={0}
                    transform="translateX(100%)"
                    variant="link"
                    size="sm"
                    onClick={() => {
                        console.log(object);
                    }}
                >
                    ⬇️
                </Button>
            </Tooltip>
        </Box>
    );
}

function DevToolsDrawer(props: { onClose: () => void; children: ReactNode }) {
    const { isOpen, onClose, onOpen } = useDisclosure();
    useEffect(() => {
        // Defer opening the drawer.. overlay does not work correctly otherwise for some reason
        onOpen();
    }, [onOpen]);

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            onCloseComplete={props.onClose}
            closeOnOverlayClick={false}
            size="md"
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px">
                    <Heading as="h1" size="lg">
                        Trails Dev Tools
                    </Heading>
                </DrawerHeader>
                <DrawerBody>{props.children}</DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}

function CodeBlock(props: { children: string }) {
    return (
        <Code display="block" whiteSpace="pre">
            {props.children}
        </Code>
    );
}

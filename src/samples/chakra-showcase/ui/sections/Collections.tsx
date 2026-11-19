// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import {
    Box,
    Button,
    Combobox,
    Command,
    createListCollection,
    createTreeCollection,
    HStack,
    Kbd,
    KbdGroup,
    Listbox,
    Portal,
    Select,
    TreeView,
    useCommandCollection,
    useFilter,
    useListCollection
} from "@chakra-ui/react";
import { useMemo } from "react";
import {
    LuFile,
    LuFolder,
    LuArchive,
    LuCircleDot,
    LuCopy,
    LuFilePlus,
    LuFolderKanban,
    LuInbox,
    LuLayoutList,
    LuLink,
    LuMoon,
    LuPanelLeft,
    LuSearch,
    LuUserPlus
} from "react-icons/lu";
import { Presenter } from "../components/Presenter";

interface Node {
    id: string;
    name: string;
    children?: Node[];
}

const frameworks = [
    { value: "next", title: "Next.js" },
    { value: "remix", title: "Remix" },
    { value: "vite", title: "Vite" },
    { value: "astro", title: "Astro" }
];

interface CommandItem extends Command.Item {
    label: string;
    value: string;
    group: string;
    icon: React.ReactNode;
    shortcut?: string[];
}

const commands: CommandItem[] = [
    {
        label: "Create issue",
        value: "create-issue",
        group: "Issues",
        icon: <LuFilePlus />,
        shortcut: ["C"]
    },
    {
        label: "Change status",
        value: "change-status",
        group: "Issues",
        icon: <LuCircleDot />,
        shortcut: ["S"]
    },
    {
        label: "Assign to...",
        value: "assign",
        group: "Issues",
        icon: <LuUserPlus />,
        shortcut: ["A"]
    },
    {
        label: "Copy issue link",
        value: "copy-link",
        group: "Issues",
        icon: <LuLink />,
        shortcut: ["⌘", "⇧", ","]
    },
    {
        label: "Archive issue",
        value: "archive",
        group: "Issues",
        icon: <LuArchive />
    },
    {
        label: "Go to inbox",
        value: "inbox",
        group: "Navigation",
        icon: <LuInbox />,
        shortcut: ["G", "I"]
    },
    {
        label: "Go to my issues",
        value: "my-issues",
        group: "Navigation",
        icon: <LuLayoutList />,
        shortcut: ["G", "M"]
    },
    {
        label: "Go to projects",
        value: "projects",
        group: "Navigation",
        icon: <LuFolderKanban />,
        shortcut: ["G", "P"]
    },
    {
        label: "Toggle sidebar",
        value: "sidebar",
        group: "View",
        icon: <LuPanelLeft />,
        shortcut: ["⌘", "B"]
    },
    {
        label: "Duplicate view",
        value: "duplicate-view",
        group: "View",
        icon: <LuCopy />
    },
    {
        label: "Switch theme",
        value: "theme",
        group: "View",
        icon: <LuMoon />,
        shortcut: ["⌘", "⇧", "L"]
    }
];

export function Collections() {
    const frameworksCollection = useMemo(() => createListCollection({ items: frameworks }), []);

    const { contains: comboboxContains } = useFilter({ sensitivity: "base" });
    const { collection: comboboxCollection, filter } = useListCollection({
        initialItems: frameworks,
        filter: comboboxContains
    });

    const treeCollection = useMemo(
        () =>
            createTreeCollection<Node>({
                nodeToValue: (node) => node.id,
                nodeToString: (node) => node.name,
                rootNode: {
                    id: "ROOT",
                    name: "",
                    children: [
                        {
                            id: "node_modules",
                            name: "node_modules",
                            children: [
                                { id: "node_modules/zag-js", name: "zag-js" },
                                { id: "node_modules/pandacss", name: "panda" },
                                {
                                    id: "node_modules/@types",
                                    name: "@types",
                                    children: [
                                        { id: "node_modules/@types/react", name: "react" },
                                        { id: "node_modules/@types/react-dom", name: "react-dom" }
                                    ]
                                }
                            ]
                        },
                        {
                            id: "src",
                            name: "src",
                            children: [
                                { id: "src/app.tsx", name: "app.tsx" },
                                { id: "src/index.ts", name: "index.ts" }
                            ]
                        },
                        { id: "panda.config", name: "panda.config.ts" },
                        { id: "package.json", name: "package.json" },
                        { id: "renovate.json", name: "renovate.json" },
                        { id: "readme.md", name: "README.md" }
                    ]
                }
            }),
        []
    );

    const commandCollection = useCommandCollection({
        initialItems: commands,
        groupBy: (item) => item.group
    });

    return (
        <Box spaceY="4">
            <Presenter title="Combobox" link="https://chakra-ui.com/docs/components/combobox">
                <Combobox.Root
                    collection={comboboxCollection}
                    onInputValueChange={(e) => filter(e.inputValue)}
                    width="320px"
                >
                    <Combobox.Label>Select framework</Combobox.Label>
                    <Combobox.Control>
                        <Combobox.Input placeholder="Type to search" />
                        <Combobox.IndicatorGroup>
                            <Combobox.ClearTrigger />
                            <Combobox.Trigger />
                        </Combobox.IndicatorGroup>
                    </Combobox.Control>
                    <Portal>
                        <Combobox.Positioner>
                            <Combobox.Content>
                                <Combobox.Empty>No items found</Combobox.Empty>
                                {comboboxCollection.items.map((item) => (
                                    <Combobox.Item item={item} key={item.value}>
                                        {item.title}
                                        <Combobox.ItemIndicator />
                                    </Combobox.Item>
                                ))}
                            </Combobox.Content>
                        </Combobox.Positioner>
                    </Portal>
                </Combobox.Root>
            </Presenter>

            <Presenter title="Listbox" link="https://chakra-ui.com/docs/components/listbox">
                <Listbox.Root collection={frameworksCollection} width="320px">
                    <Listbox.Label>Select framework</Listbox.Label>
                    <Listbox.Content>
                        {frameworksCollection.items.map((framework) => (
                            <Listbox.Item item={framework} key={framework.value}>
                                <Listbox.ItemText>{framework.title}</Listbox.ItemText>
                                <Listbox.ItemIndicator />
                            </Listbox.Item>
                        ))}
                    </Listbox.Content>
                </Listbox.Root>
            </Presenter>

            <Presenter title="Select" link="https://chakra-ui.com/docs/components/select">
                <Select.Root collection={frameworksCollection} size="sm" width="320px">
                    <Select.HiddenSelect />
                    <Select.Label>Select framework</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Select framework" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {frameworksCollection.items.map((framework) => (
                                    <Select.Item item={framework} key={framework.value}>
                                        {framework.title}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Presenter>

            <Presenter title="TreeView" link="https://chakra-ui.com/docs/components/tree-view">
                <TreeView.Root collection={treeCollection} maxW="sm">
                    <TreeView.Label>Tree</TreeView.Label>
                    <TreeView.Tree>
                        <TreeView.Node
                            indentGuide={<TreeView.BranchIndentGuide />}
                            render={({ node, nodeState }) =>
                                nodeState.isBranch ? (
                                    <TreeView.BranchControl>
                                        <LuFolder />
                                        <TreeView.BranchText>{node.name}</TreeView.BranchText>
                                    </TreeView.BranchControl>
                                ) : (
                                    <TreeView.Item>
                                        <LuFile />
                                        <TreeView.ItemText>{node.name}</TreeView.ItemText>
                                    </TreeView.Item>
                                )
                            }
                        />
                    </TreeView.Tree>
                </TreeView.Root>
            </Presenter>

            <Presenter title="Command" link="https://chakra-ui.com/docs/components/command">
                <Command.Provider value={commandCollection}>
                    <Command.Dialog>
                        <Command.DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                minW="64"
                                justifyContent="flex-start"
                                color="fg.muted"
                            >
                                <LuSearch /> Search...
                            </Button>
                        </Command.DialogTrigger>
                        <Portal>
                            <Command.DialogBackdrop />
                            <Command.DialogContent>
                                <Command.Root>
                                    <Command.Control>
                                        <Command.Indicator />
                                        <Command.Input placeholder="Type a command or search..." />
                                    </Command.Control>
                                    <Command.List>
                                        {commandCollection.collection
                                            .group()
                                            .map(([group, items]) => (
                                                <Command.ItemGroup key={group}>
                                                    <Command.ItemGroupLabel>
                                                        {group}
                                                    </Command.ItemGroupLabel>
                                                    {items.map((item) => (
                                                        <Command.Item item={item} key={item.value}>
                                                            {item.icon}
                                                            <Command.ItemText highlight>
                                                                {item.label}
                                                            </Command.ItemText>
                                                            {item.shortcut?.map((key) => (
                                                                <Command.ItemCommand key={key}>
                                                                    {key}
                                                                </Command.ItemCommand>
                                                            ))}
                                                        </Command.Item>
                                                    ))}
                                                </Command.ItemGroup>
                                            ))}
                                        <Command.Empty>No results found</Command.Empty>
                                    </Command.List>
                                    <Command.Footer>
                                        <HStack gap="1.5">
                                            <KbdGroup size="sm" variant="subtle">
                                                <Kbd>↑</Kbd>
                                                <Kbd>↓</Kbd>
                                            </KbdGroup>
                                            Navigate
                                        </HStack>
                                        <HStack gap="1.5">
                                            <Kbd size="sm" variant="subtle">
                                                ↵
                                            </Kbd>
                                            Select
                                        </HStack>
                                        <HStack gap="1.5">
                                            <Kbd size="sm" variant="subtle">
                                                esc
                                            </Kbd>
                                            Close
                                        </HStack>
                                    </Command.Footer>
                                </Command.Root>
                            </Command.DialogContent>
                        </Portal>
                    </Command.Dialog>
                </Command.Provider>
            </Presenter>
        </Box>
    );
}

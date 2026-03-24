// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Box,
    Combobox,
    createListCollection,
    createTreeCollection,
    Listbox,
    Portal,
    Select,
    TreeView,
    useFilter,
    useListCollection
} from "@chakra-ui/react";
import { LuFile, LuFolder } from "react-icons/lu";
import { Presenter } from "../components/Presenter";

interface Node {
    id: string;
    name: string;
    children?: Node[];
}

export function Collections() {
    const frameworks = [
        { value: "next", title: "Next.js" },
        { value: "remix", title: "Remix" },
        { value: "vite", title: "Vite" },
        { value: "astro", title: "Astro" }
    ];
    const frameworksCollection = createListCollection({ items: frameworks });
    const { contains } = useFilter({ sensitivity: "base" });
    const { collection, filter } = useListCollection({
        initialItems: frameworks,
        filter: contains
    });

    const treeCollection = createTreeCollection<Node>({
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
    });

    return (
        <Box spaceY="4">
            <Presenter title="Combobox" link="https://chakra-ui.com/docs/components/combobox">
                <Combobox.Root
                    collection={collection}
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
                                {collection.items.map((item) => (
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
        </Box>
    );
}

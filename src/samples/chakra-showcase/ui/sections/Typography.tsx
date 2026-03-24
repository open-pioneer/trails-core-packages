// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Blockquote,
    Box,
    Code,
    CodeBlock,
    createShikiAdapter,
    Em,
    Heading,
    Highlight,
    Kbd,
    Link,
    LinkBox,
    LinkOverlay,
    List,
    Mark,
    Text
} from "@chakra-ui/react";
import { Prose } from "@open-pioneer/chakra-snippets/prose";
import { LuCircleCheck, LuCircleDashed } from "react-icons/lu";
import type { HighlighterGeneric } from "shiki";
import { Presenter } from "../components/Presenter";
import { useMemo } from "react";

const file = {
    code: `
<div class="container">
    <h1>Hello, world!</h1>
</div>
`,
    language: "html",
    title: "index.html"
};

const proseContent = String.raw`
    <h1>Title Heading 1</h1>
    <h2>Title Heading 2</h2>
    <h3>Title Heading 3</h3>
    <h4>Title Heading 4</h4>

    <h4>Title Heading 4 <code>testing</code></h4>

    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at dolor nec ex rutrum
        semper. Praesent ultricies purus eget lectus tristique egestas ac in lacus. Nulla eleifend
        lorem risus, sit amet dictum nisi gravida eget. Suspendisse odio sem, scelerisque congue
        luctus nec, scelerisque ultrices orci. Praesent tincidunt, risus ut commodo cursus, ligula
        orci tristique justo, vitae sollicitudin lacus risus dictum orci. Press <kbd>Ctrl</kbd> +
        <kbd>C</kbd> to copy
    </p>

    <p>
        Vivamus vel enim at lorem ultricies faucibus. Cras vitae ipsum ut quam varius dignissim a ac
        tellus. Aliquam maximus mauris eget tincidunt interdum. Fusce vitae massa non risus congue
        tincidunt. Pellentesque maximus elit quis eros lobortis dictum.
    </p>

    <hr />

    <p>
        Fusce placerat ipsum vel sollicitudin imperdiet. Morbi vulputate non diam at consequat.
        Donec vitae sem eu arcu auctor scelerisque vel in turpis. Pellentesque dapibus justo dui,
        quis egestas sapien porttitor in.
    </p>
`;

export function Typography() {
    const shikiAdapter = useMemo(
        () =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            createShikiAdapter<HighlighterGeneric<any, any>>({
                async load() {
                    const { createHighlighter } = await import("shiki");
                    return createHighlighter({
                        langs: ["tsx", "scss", "html", "bash", "json"],
                        themes: ["github-dark"]
                    });
                },
                theme: "github-dark"
            }),
        []
    );

    return (
        <Box spaceY="4">
            <Presenter title="Blockquote" link="https://chakra-ui.com/docs/components/blockquote">
                <Blockquote.Root>
                    <Blockquote.Content cite="Dummy Text">
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
                        ligula eget dolor.
                    </Blockquote.Content>
                    <Blockquote.Caption>
                        — <cite>Dummy Text</cite>
                    </Blockquote.Caption>
                </Blockquote.Root>
            </Presenter>

            <Presenter title="Code" link="https://chakra-ui.com/docs/components/code">
                <Code>{`console.log("Hello, world!")`}</Code>
            </Presenter>

            <Presenter title="Code Block" link="https://chakra-ui.com/docs/components/code-block">
                <CodeBlock.AdapterProvider value={shikiAdapter}>
                    <CodeBlock.Root
                        code={file.code}
                        language={file.language}
                        colorPalette={"black"}
                    >
                        <CodeBlock.Content>
                            <CodeBlock.Code>
                                <CodeBlock.CodeText />
                            </CodeBlock.Code>
                        </CodeBlock.Content>
                    </CodeBlock.Root>
                </CodeBlock.AdapterProvider>
            </Presenter>

            <Presenter title="Em" link="https://chakra-ui.com/docs/components/em">
                <Text>
                    This is an <Em>emphasis text</Em>.
                </Text>
            </Presenter>

            <Presenter title="Heading" link="https://chakra-ui.com/docs/components/heading">
                <Heading>This is a Heading</Heading>
            </Presenter>

            <Presenter title="Highlight" link="https://chakra-ui.com/docs/components/highlight">
                <Highlight
                    query="highlighted text"
                    styles={{ px: "0.5", bg: "orange.subtle", color: "orange.fg" }}
                >
                    This is a highlighted text.
                </Highlight>
            </Presenter>

            <Presenter title="Kbd" link="https://chakra-ui.com/docs/components/kbd">
                Please use <Kbd>F12</Kbd> to check errors in the developer console.
            </Presenter>

            <Presenter title="Link" link="https://chakra-ui.com/docs/components/link">
                <Text>
                    This is a link to the{" "}
                    <Link href="https://github.com/open-pioneer/trails-starter/tree/main/docs">
                        Open Pioneer Trails documentation.
                    </Link>
                </Text>
            </Presenter>

            <Presenter
                title="Link Overlay"
                link="https://chakra-ui.com/docs/components/link-overlay"
            >
                <LinkBox
                    as="article"
                    borderWidth="1px"
                    borderRadius="md"
                    padding="4"
                    marginTop="4"
                    _hover={{ shadow: "md" }}
                >
                    <Heading size="md" marginBottom="2">
                        <LinkOverlay href="https://github.com/open-pioneer/trails-starter/tree/main/docs">
                            LinkOverlay Example
                        </LinkOverlay>
                    </Heading>
                    <Text>
                        This entire card is clickable thanks to LinkOverlay. It wraps the entire
                        LinkBox and makes it interactive while maintaining semantic HTML structure.
                    </Text>
                    <Text marginTop="2" fontSize="sm" color="gray.500">
                        Click anywhere on this card to navigate to Open Pioneer Trails
                        documentation.
                    </Text>
                </LinkBox>
            </Presenter>

            <Presenter title="List" link="https://chakra-ui.com/docs/components/list">
                <List.Root gap="2" variant="plain" align="center">
                    <List.Item>
                        <List.Indicator asChild color="green.500">
                            <LuCircleCheck />
                        </List.Indicator>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit
                    </List.Item>
                    <List.Item>
                        <List.Indicator asChild color="green.500">
                            <LuCircleCheck />
                        </List.Indicator>
                        Assumenda, quia temporibus eveniet a libero incidunt suscipit
                    </List.Item>
                    <List.Item>
                        <List.Indicator asChild color="green.500">
                            <LuCircleDashed />
                        </List.Indicator>
                        Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
                    </List.Item>
                </List.Root>
            </Presenter>

            <Presenter title="Mark" link="https://chakra-ui.com/docs/components/mark">
                <Text>
                    This is a <Mark variant={"solid"}>marked text</Mark>.
                </Text>
            </Presenter>

            <Presenter title="Prose" link="https://chakra-ui.com/docs/components/prose">
                <Prose
                    dangerouslySetInnerHTML={{ __html: proseContent }}
                    borderColor="border.disabled"
                    color="fg.disabled"
                />
            </Presenter>

            <Presenter title="Text" link="https://chakra-ui.com/docs/components/text">
                <Text>Sphinx of black quartz, judge my vow.</Text>
            </Presenter>
        </Box>
    );
}

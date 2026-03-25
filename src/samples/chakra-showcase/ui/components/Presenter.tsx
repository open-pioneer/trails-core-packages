// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { Card, Heading, HStack, IconButton, Link, Box, List, Text } from "@chakra-ui/react";
import { Tooltip } from "@open-pioneer/chakra-snippets/tooltip";
import { type ReactNode } from "react";
import { LuExternalLink } from "react-icons/lu";
import { PiWarningBold } from "react-icons/pi";

export interface PresenterProps {
    title?: string;
    link?: string;
    issues?: string[];
    children?: ReactNode;
}

export function Presenter({ title, link, issues, children }: Readonly<PresenterProps>) {
    return (
        <Card.Root variant="outline" size="sm" w="full">
            {title && (
                <Card.Header>
                    <HStack justify="space-between">
                        <Heading size="sm" fontWeight="medium">
                            {title}
                        </Heading>
                        <HStack gap="1">
                            {issues && issues.length > 0 && (
                                <Tooltip
                                    content={
                                        <>
                                            <Text>
                                                <b>Known issues:</b>
                                            </Text>
                                            <List.Root listStyleType="disc" ps="4">
                                                {issues.map((issue) => (
                                                    <List.Item key={issue}>{issue}</List.Item>
                                                ))}
                                            </List.Root>
                                        </>
                                    }
                                    showArrow
                                >
                                    <IconButton
                                        variant="ghost"
                                        size="xs"
                                        aria-label="Known issues"
                                        colorPalette="orange"
                                    >
                                        <PiWarningBold />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {link && (
                                <IconButton
                                    asChild
                                    variant="ghost"
                                    size="xs"
                                    aria-label="View docs"
                                >
                                    <Link href={link} target="_blank" rel="noopener noreferrer">
                                        <LuExternalLink />
                                    </Link>
                                </IconButton>
                            )}
                        </HStack>
                    </HStack>
                </Card.Header>
            )}
            <Card.Body>
                <Box>{children}</Box>
            </Card.Body>
        </Card.Root>
    );
}

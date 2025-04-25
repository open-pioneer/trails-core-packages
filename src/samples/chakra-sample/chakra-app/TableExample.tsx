// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Table } from "@chakra-ui/react";

export function TableExampleComponent() {
    return (
        <Table.Root variant="outline" striped>
            <Table.Caption>This is the table cation</Table.Caption>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>First</Table.ColumnHeader>
                    <Table.ColumnHeader>Test</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Third (textAlign=end)</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell>one</Table.Cell>
                    <Table.Cell>bla</Table.Cell>
                    <Table.Cell textAlign="end">22,3</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>two</Table.Cell>
                    <Table.Cell>blub</Table.Cell>
                    <Table.Cell textAlign="end">23.4</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>three</Table.Cell>
                    <Table.Cell>blob</Table.Cell>
                    <Table.Cell textAlign="end">12</Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table.Root>
    );
}

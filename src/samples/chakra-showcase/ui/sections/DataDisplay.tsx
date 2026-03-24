// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Avatar,
    AvatarGroup,
    Badge,
    Box,
    Button,
    Card,
    Clipboard,
    DataList,
    HStack,
    Icon,
    IconButton,
    Image,
    QrCode,
    Stack,
    Stat,
    Table,
    Tag,
    Text,
    Timeline
} from "@chakra-ui/react";
import { HiHeart } from "react-icons/hi";
import { LuCheck, LuPackage, LuShip } from "react-icons/lu";
import { Presenter } from "../components/Presenter";

export function DataDisplay() {
    const dataListStats = [
        { label: "New Users", value: "234", diff: -12, helpText: "Till date" },
        { label: "Sales", value: "£12,340", diff: 12, helpText: "Last 30 days" },
        { label: "Revenue", value: "3,450", diff: 4.5, helpText: "Last 30 days" }
    ];

    const tableItems = [
        { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
        { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
        { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
        { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
        { id: 5, name: "Headphones", category: "Accessories", price: 199.99 }
    ];

    return (
        <Box spaceY="4">
            <Presenter title="Avatar" link="https://chakra-ui.com/docs/components/avatar">
                <AvatarGroup>
                    <Avatar.Root>
                        <Avatar.Fallback name="Segun Adebayo" />
                        <Avatar.Image src="https://bit.ly/sage-adebayo" />
                    </Avatar.Root>
                </AvatarGroup>
            </Presenter>

            <Presenter title="Badge" link="https://chakra-ui.com/docs/components/badge">
                <Stack direction="row">
                    <Badge>Default</Badge>
                    <Badge colorPalette="green">Success</Badge>
                    <Badge colorPalette="red">Removed</Badge>
                    <Badge colorPalette="purple">New</Badge>
                </Stack>
            </Presenter>

            <Presenter title="Card" link="https://chakra-ui.com/docs/components/card">
                <Card.Root width="320px">
                    <Card.Body gap="2">
                        <Avatar.Root size="lg" shape="rounded">
                            <Avatar.Image src="https://picsum.photos/200/300" />
                            <Avatar.Fallback name="Nue Camp" />
                        </Avatar.Root>
                        <Card.Title mt="2">Nue Camp</Card.Title>
                        <Card.Description>
                            This is the card body. Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Curabitur nec odio vel dui euismod fermentum. Curabitur
                            nec odio vel dui euismod fermentum.
                        </Card.Description>
                    </Card.Body>
                    <Card.Footer justifyContent="flex-end">
                        <Button variant="outline">View</Button>
                        <Button>Join</Button>
                    </Card.Footer>
                </Card.Root>
            </Presenter>

            <Presenter title="Clipboard" link="https://chakra-ui.com/docs/components/clipboard">
                <Clipboard.Root value="https://github.com/open-pioneer/trails-starter">
                    <Clipboard.Trigger asChild>
                        <IconButton variant="surface" size="xs">
                            <Clipboard.Indicator />
                        </IconButton>
                    </Clipboard.Trigger>
                </Clipboard.Root>
            </Presenter>

            <Presenter title="Image" link="https://chakra-ui.com/docs/components/image">
                <Image rounded="md" src="https://i.pravatar.cc/300?img=4" alt="John Doe" />
            </Presenter>

            <Presenter title="Data List" link="https://chakra-ui.com/docs/components/data-list">
                <DataList.Root
                    orientation="horizontal"
                    borderColor="border.disabled"
                    color="fg.disabled"
                >
                    {dataListStats.map((item) => (
                        <DataList.Item key={item.label}>
                            <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
                            <DataList.ItemValue>{item.value}</DataList.ItemValue>
                        </DataList.Item>
                    ))}
                </DataList.Root>
            </Presenter>

            <Presenter title="Icon" link="https://chakra-ui.com/docs/components/icon">
                <Icon size="lg" color="pink.700">
                    <HiHeart />
                </Icon>
            </Presenter>

            <Presenter title="QR Code" link="https://chakra-ui.com/docs/components/qr-code">
                <QrCode.Root value="https://github.com/open-pioneer/trails-starter">
                    <QrCode.Frame>
                        <QrCode.Pattern />
                    </QrCode.Frame>
                </QrCode.Root>
            </Presenter>

            <Presenter title="Stat" link="https://chakra-ui.com/docs/components/stat">
                <Stat.Root borderColor="border.disabled" color="fg.disabled">
                    <Stat.Label>Unique visitors</Stat.Label>
                    <Stat.ValueText>192.1k</Stat.ValueText>
                </Stat.Root>
            </Presenter>

            <Presenter title="Table" link="https://chakra-ui.com/docs/components/table">
                <Table.Root size="sm" borderColor="border.disabled" color="fg.disabled">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Product</Table.ColumnHeader>
                            <Table.ColumnHeader>Category</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="end">Price</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {tableItems.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>{item.name}</Table.Cell>
                                <Table.Cell>{item.category}</Table.Cell>
                                <Table.Cell textAlign="end">{item.price}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Presenter>

            <Presenter title="Tag" link="https://chakra-ui.com/docs/components/tag">
                <HStack>
                    <Tag.Root>
                        <Tag.Label>Plain Tag</Tag.Label>
                    </Tag.Root>
                    <Tag.Root>
                        <Tag.Label>Closable Tag</Tag.Label>
                        <Tag.EndElement>
                            <Tag.CloseTrigger />
                        </Tag.EndElement>
                    </Tag.Root>
                </HStack>
            </Presenter>

            <Presenter title="Timeline" link="https://chakra-ui.com/docs/components/timeline">
                <Timeline.Root maxW="400px" borderColor="border.disabled" color="fg.disabled">
                    <Timeline.Item>
                        <Timeline.Connector>
                            <Timeline.Separator />
                            <Timeline.Indicator>
                                <LuShip />
                            </Timeline.Indicator>
                        </Timeline.Connector>
                        <Timeline.Content>
                            <Timeline.Title>Product Shipped</Timeline.Title>
                            <Timeline.Description>13th May 2021</Timeline.Description>
                            <Text textStyle="sm">
                                We shipped your product via <strong>FedEx</strong> and it should
                                arrive within 3-5 business days.
                            </Text>
                        </Timeline.Content>
                    </Timeline.Item>

                    <Timeline.Item>
                        <Timeline.Connector>
                            <Timeline.Separator />
                            <Timeline.Indicator>
                                <LuCheck />
                            </Timeline.Indicator>
                        </Timeline.Connector>
                        <Timeline.Content>
                            <Timeline.Title textStyle="sm">Order Confirmed</Timeline.Title>
                            <Timeline.Description>18th May 2021</Timeline.Description>
                        </Timeline.Content>
                    </Timeline.Item>

                    <Timeline.Item>
                        <Timeline.Connector>
                            <Timeline.Separator />
                            <Timeline.Indicator>
                                <LuPackage />
                            </Timeline.Indicator>
                        </Timeline.Connector>
                        <Timeline.Content>
                            <Timeline.Title textStyle="sm">Order Delivered</Timeline.Title>
                            <Timeline.Description>20th May 2021, 10:30am</Timeline.Description>
                        </Timeline.Content>
                    </Timeline.Item>
                </Timeline.Root>
            </Presenter>
        </Box>
    );
}

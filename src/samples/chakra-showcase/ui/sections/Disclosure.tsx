// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Accordion,
    Box,
    Breadcrumb,
    Button,
    ButtonGroup,
    Carousel,
    Collapsible,
    IconButton,
    Pagination,
    Span,
    Steps,
    Tabs
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight, LuFolder, LuSquareCheck, LuUser } from "react-icons/lu";
import { Presenter } from "../components/Presenter";

export function Disclosure() {
    const accordionItems = [
        { value: "a", title: "First Item", text: "Some value 1..." },
        { value: "b", title: "Second Item", text: "Some value 2..." },
        { value: "c", title: "Third Item", text: "Some value 3..." }
    ];
    const carouselItems = Array.from({ length: 5 });
    const steps = [
        {
            title: "Step 1",
            description: "Step 1 description"
        },
        {
            title: "Step 2",
            description: "Step 2 description"
        },
        {
            title: "Step 3",
            description: "Step 3 description"
        }
    ];

    return (
        <Box spaceY="4">
            <Presenter title="Accordion" link="https://chakra-ui.com/docs/components/accordion">
                <Accordion.Root
                    collapsible
                    defaultValue={["b"]}
                    borderColor="border.disabled"
                    color="fg.disabled"
                >
                    {accordionItems.map((item, index) => (
                        <Accordion.Item key={index} value={item.value}>
                            <Accordion.ItemTrigger>
                                <Span flex="1">{item.title}</Span>
                                <Accordion.ItemIndicator />
                            </Accordion.ItemTrigger>
                            <Accordion.ItemContent>
                                <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>
            </Presenter>

            <Presenter title="Breadcrumb" link="https://chakra-ui.com/docs/components/breadcrumb">
                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="#">Docs</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator />
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="#">Components</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator />
                        <Breadcrumb.Item>
                            <Breadcrumb.CurrentLink>Props</Breadcrumb.CurrentLink>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
            </Presenter>

            <Presenter title="Carousel" link="https://chakra-ui.com/docs/components/carousel">
                <Carousel.Root slideCount={carouselItems.length} maxW="md" mx="90">
                    <Carousel.ItemGroup>
                        {carouselItems.map((_, index) => (
                            <Carousel.Item key={index} index={index}>
                                <Box
                                    w="100%"
                                    h="300px"
                                    rounded="lg"
                                    fontSize="2.5rem"
                                    bg="bg.emphasized"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    {index + 1}
                                </Box>
                            </Carousel.Item>
                        ))}
                    </Carousel.ItemGroup>

                    <Carousel.Control justifyContent="center" gap="4">
                        <Carousel.PrevTrigger asChild>
                            <IconButton size="xs" variant="ghost">
                                <LuChevronLeft />
                            </IconButton>
                        </Carousel.PrevTrigger>

                        <Carousel.Indicators />

                        <Carousel.NextTrigger asChild>
                            <IconButton size="xs" variant="ghost">
                                <LuChevronRight />
                            </IconButton>
                        </Carousel.NextTrigger>
                    </Carousel.Control>
                </Carousel.Root>
            </Presenter>

            <Presenter title="Collapsible" link="https://chakra-ui.com/docs/components/collapsible">
                <Collapsible.Root>
                    <Collapsible.Trigger paddingY="3">Toggle Collapsible</Collapsible.Trigger>
                    <Collapsible.Content>
                        <Box padding="4" borderWidth="1px">
                            <strong>Chakra UI</strong> embraces this philosophy in the world of
                            design and development. Just like chakras align energy in the body,
                            Chakra UI aligns your design system — bringing flow, consistency, and
                            peace of mind to your codebase. It helps developers focus on creating
                            beautiful, accessible UIs without friction.
                            <br />
                            <br />
                            Think of each component as a wheel in your app’s UI — smooth, connected,
                            and full of potential. Build with harmony. Build with
                            <strong>Chakra UI</strong>.
                        </Box>
                    </Collapsible.Content>
                </Collapsible.Root>
            </Presenter>

            <Presenter title="Pagination" link="https://chakra-ui.com/docs/components/pagination">
                <Pagination.Root count={20} pageSize={2} defaultPage={1}>
                    <ButtonGroup variant="ghost" size="sm">
                        <Pagination.PrevTrigger asChild>
                            <IconButton>
                                <LuChevronLeft />
                            </IconButton>
                        </Pagination.PrevTrigger>

                        <Pagination.Items
                            render={(page) => (
                                <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                                    {page.value}
                                </IconButton>
                            )}
                        />

                        <Pagination.NextTrigger asChild>
                            <IconButton>
                                <LuChevronRight />
                            </IconButton>
                        </Pagination.NextTrigger>
                    </ButtonGroup>
                </Pagination.Root>
            </Presenter>

            <Presenter title="Steps" link="https://chakra-ui.com/docs/components/steps">
                <Steps.Root
                    defaultStep={1}
                    count={steps.length}
                    borderColor="border.disabled"
                    color="fg.disabled"
                >
                    <Steps.List>
                        {steps.map((step, index) => (
                            <Steps.Item key={index} index={index} title={step.title}>
                                <Steps.Indicator />
                                <Steps.Title>{step.title}</Steps.Title>
                                <Steps.Separator />
                            </Steps.Item>
                        ))}
                    </Steps.List>

                    {steps.map((step, index) => (
                        <Steps.Content key={index} index={index}>
                            {step.description}
                        </Steps.Content>
                    ))}
                    <Steps.CompletedContent>All steps are complete!</Steps.CompletedContent>

                    <ButtonGroup size="sm" variant="outline">
                        <Steps.PrevTrigger asChild>
                            <Button>Prev</Button>
                        </Steps.PrevTrigger>
                        <Steps.NextTrigger asChild>
                            <Button>Next</Button>
                        </Steps.NextTrigger>
                    </ButtonGroup>
                </Steps.Root>
            </Presenter>

            <Presenter title="Tabs" link="https://chakra-ui.com/docs/components/tabs">
                <Tabs.Root defaultValue="members" borderColor="border.disabled" color="fg.disabled">
                    <Tabs.List>
                        <Tabs.Trigger value="members">
                            <LuUser />
                            Members
                        </Tabs.Trigger>
                        <Tabs.Trigger value="projects">
                            <LuFolder />
                            Projects
                        </Tabs.Trigger>
                        <Tabs.Trigger value="tasks">
                            <LuSquareCheck />
                            Settings
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="members">Manage your team members</Tabs.Content>
                    <Tabs.Content value="projects">Manage your projects</Tabs.Content>
                    <Tabs.Content value="tasks">Manage your tasks for freelancers</Tabs.Content>
                </Tabs.Root>
            </Presenter>
        </Box>
    );
}

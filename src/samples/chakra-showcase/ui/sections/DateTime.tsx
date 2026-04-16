// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Box, DatePicker, Portal } from "@chakra-ui/react";
import { Presenter } from "../components/Presenter";
import { LuCalendar } from "react-icons/lu";

export function DateTime() {
    return (
        <Box display="flex" flexDirection="column" gap="4" alignItems="flex-start">
            <Presenter title="Date Picker" link="https://chakra-ui.com/docs/components/date-picker">
                <DatePicker.Root maxWidth="20rem">
                    <DatePicker.Label>Date of birth</DatePicker.Label>
                    <DatePicker.Control>
                        <DatePicker.Input />
                        <DatePicker.IndicatorGroup>
                            <DatePicker.Context>
                                {(context) =>
                                    context.value.length ? (
                                        <DatePicker.ClearTrigger />
                                    ) : (
                                        <DatePicker.Trigger>
                                            <LuCalendar />
                                        </DatePicker.Trigger>
                                    )
                                }
                            </DatePicker.Context>
                        </DatePicker.IndicatorGroup>
                    </DatePicker.Control>
                    <Portal>
                        <DatePicker.Positioner>
                            <DatePicker.Content>
                                <DatePicker.View view="day">
                                    <DatePicker.Header />
                                    <DatePicker.DayTable />
                                </DatePicker.View>
                                <DatePicker.View view="month">
                                    <DatePicker.Header />
                                    <DatePicker.MonthTable />
                                </DatePicker.View>
                                <DatePicker.View view="year">
                                    <DatePicker.Header />
                                    <DatePicker.YearTable />
                                </DatePicker.View>
                            </DatePicker.Content>
                        </DatePicker.Positioner>
                    </Portal>
                </DatePicker.Root>
            </Presenter>
            <Presenter title="Calendar" link="https://chakra-ui.com/docs/components/calendar">
                <DatePicker.Root inline width="fit-content">
                    <DatePicker.Content unstyled>
                        <DatePicker.View view="day">
                            <DatePicker.Header />
                            <DatePicker.DayTable />
                        </DatePicker.View>
                        <DatePicker.View view="month">
                            <DatePicker.Header />
                            <DatePicker.MonthTable />
                        </DatePicker.View>
                        <DatePicker.View view="year">
                            <DatePicker.Header />
                            <DatePicker.YearTable />
                        </DatePicker.View>
                    </DatePicker.Content>
                </DatePicker.Root>
            </Presenter>
        </Box>
    );
}

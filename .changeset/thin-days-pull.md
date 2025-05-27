---
"@open-pioneer/react-utils": minor
---

Allow using `SectionHeading` in the children of a `TitledSection` instead of the `title` prop.
This is more flexible and more readable compared to complex components in the `title` prop.

For example:

```jsx
<TitledSection>
    <SectionHeading>Top level heading (H1)</SectionHeading>
    .. Some Content ..
    <TitledSection>
        <Box backgroundColor="green.500">
            <SectionHeading>Other Heading (H2)</SectionHeading>
        </Box>
        .. More Content ..
    </TitledSection>
</TitledSection>
```

Note that you should be using exactly one `<SectionHeading />` for each `<TitledSection />`.

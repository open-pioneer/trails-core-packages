// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { ConfigureTitledSection, SectionHeading, TitledSection } from "./TitledSection";
import { ReactNode } from "react";
import { PackageContextProvider } from "@open-pioneer/test-utils/react";

it("renders a hierarchy of headings", () => {
    const content = renderContent(
        <main>
            <TitledSection title="Site title">
                <article>
                    <TitledSection title="Article Title">
                        <TitledSection title="Article Child"></TitledSection>
                    </TitledSection>
                    <TitledSection title="Heading ???"></TitledSection>
                </article>
                <article>
                    <TitledSection title="Other Article"></TitledSection>
                </article>
            </TitledSection>
        </main>
    );

    expect(content).toMatchInlineSnapshot(`
      <div
        data-testid="content"
      >
        <main>
          <h1
            class="chakra-heading css-1dklj6k"
            data-theme="light"
          >
            Site title
          </h1>
          <article>
            <h2
              class="chakra-heading css-1dklj6k"
              data-theme="light"
            >
              Article Title
            </h2>
            <h3
              class="chakra-heading css-1dklj6k"
              data-theme="light"
            >
              Article Child
            </h3>
            <h2
              class="chakra-heading css-1dklj6k"
              data-theme="light"
            >
              Heading ???
            </h2>
          </article>
          <article>
            <h2
              class="chakra-heading css-1dklj6k"
              data-theme="light"
            >
              Other Article
            </h2>
          </article>
        </main>
      </div>
    `);
});

it("renders its children", () => {
    const content = renderContent(
        <main>
            <TitledSection title="Site title">Arbitrary content...</TitledSection>
        </main>
    );

    expect(content).toMatchInlineSnapshot(`
      <div
        data-testid="content"
      >
        <main>
          <h1
            class="chakra-heading css-1dklj6k"
            data-theme="light"
          >
            Site title
          </h1>
          Arbitrary content...
        </main>
      </div>
    `);
});

it("supports manual react nodes as heading", () => {
    const content = renderContent(
        <TitledSection
            title={
                <div className="useless">
                    <SectionHeading>Heading</SectionHeading>
                </div>
            }
        >
            <TitledSection
                title={
                    <div className="useless2">
                        <SectionHeading>Sub Heading</SectionHeading>
                    </div>
                }
            >
                Arbitrary content...
            </TitledSection>
        </TitledSection>
    );

    expect(content).toMatchInlineSnapshot(`
      <div
        data-testid="content"
      >
        <div
          class="useless"
        >
          <h1
            class="chakra-heading css-1dklj6k"
            data-theme="light"
          >
            Heading
          </h1>
        </div>
        <div
          class="useless2"
        >
          <h2
            class="chakra-heading css-1dklj6k"
            data-theme="light"
          >
            Sub Heading
          </h2>
        </div>
        Arbitrary content...
      </div>
    `);
});

it("limits heading level to 6", () => {
    const content = renderContent(
        <TitledSection title="1">
            <TitledSection title="2">
                <TitledSection title="3">
                    <TitledSection title="4">
                        <TitledSection title="5">
                            <TitledSection title="6">
                                <TitledSection title="7"></TitledSection>
                            </TitledSection>
                        </TitledSection>
                    </TitledSection>
                </TitledSection>
            </TitledSection>
        </TitledSection>
    );

    expect(content).toMatchInlineSnapshot(`
      <div
        data-testid="content"
      >
        <h1
          class="chakra-heading css-1dklj6k"
          data-theme="light"
        >
          1
        </h1>
        <h2
          class="chakra-heading css-1dklj6k"
          data-theme="light"
        >
          2
        </h2>
        <h3
          class="chakra-heading css-1dklj6k"
          data-theme="light"
        >
          3
        </h3>
        <h4
          class="chakra-heading css-1dklj6k"
          data-theme="light"
        >
          4
        </h4>
        <h5
          class="chakra-heading css-1dklj6k"
          data-theme="light"
        >
          5
        </h5>
        <h6
          class="chakra-heading css-1dklj6k"
          data-theme="light"
        >
          6
        </h6>
        <h6
          class="chakra-heading css-1dklj6k"
          data-theme="light"
        >
          7
        </h6>
      </div>
    `);
});

it("allows to configure the current heading level", () => {
    const Widget = () => {
        return (
            <TitledSection title="Some header in widget">
                Some content in Widget
                <TitledSection title="Some nested header in widget">
                    Nested content in Widget
                </TitledSection>
            </TitledSection>
        );
    };

    const content = renderContent(
        <TitledSection title="Root Header">
            <ConfigureTitledSection level={5}>
                <Widget /> {/* Renders as h5, h6 instead of h2, h3 */}
            </ConfigureTitledSection>
        </TitledSection>
    );

    expect(content).toMatchInlineSnapshot(`
      <div
        data-testid="content"
      >
        <h1
          class="chakra-heading css-1dklj6k"
          data-theme="light"
        >
          Root Header
        </h1>
        <h5
          class="chakra-heading css-1dklj6k"
          data-theme="light"
        >
          Some header in widget
        </h5>
        Some content in Widget
        <h6
          class="chakra-heading css-1dklj6k"
          data-theme="light"
        >
          Some nested header in widget
        </h6>
        Nested content in Widget
         
      </div>
    `);
});

function renderContent(children: ReactNode): HTMLElement {
    const result = render(
        <PackageContextProvider>
            <div data-testid="content">{children}</div>
        </PackageContextProvider>
    );
    const content = result.getByTestId("content");
    if (!content) {
        throw new Error("content did not render");
    }
    return content;
}
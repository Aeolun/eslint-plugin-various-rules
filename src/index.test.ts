import { resolve } from "path";
import { TSESLint } from "@typescript-eslint/experimental-utils";
import plugin from "./index";

const ruleTester = new TSESLint.RuleTester({
  parser: resolve("./node_modules/@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
});

ruleTester.run("intercept-order", plugin.rules["all-cy-intercept-at-top"], {
  valid: [
    `it('can confirm sucky', () => {
      cy.intercept('POST', 'url')
      cy.get('#idOriginal').should('have.value', '58757')
    })`,
  ],
  invalid: [
    {
      code: `it('can confirm last id is correct', () => {
        cy.get('#idOriginal').should('have.value', '97587')
        cy.intercept('POST', 'url')
      })`,
      errors: [
        {
          messageId: "noInterceptAfterActions",
          line: 3,
          column: 12,
          endLine: 3,
          endColumn: 21,
        },
      ],
    },
    {
      code: `it('can confirm id has the right value', () => {
        cy.get('#idOriginal').should('have.value', '77575')
        cy.intercept('POST', 'url').as('stuff')
        cy.wait('@stuff')
      })`,
      errors: [
        {
          messageId: "noInterceptAfterActions",
          line: 3,
          column: 12,
          endLine: 3,
          endColumn: 21,
        },
      ],
    },
  ],
});

ruleTester.run(
  "intercept-without-stub",
  plugin.rules["no-intercept-without-stub"],
  {
    valid: [
      `it('can confirm stuff works', () => {
      cy.intercept('POST', 'url', {})
    })`,
      `it('can confirm other stuff works too', () => {
      cy.intercept('Url', {})
    })`,
      `it('can confirm most of it is broken anyway', () => {
      cy.intercept('Url', variable)
    })`,
    ],
    invalid: [
      {
        code: `it('can confirm the brokenness of stuff', () => {
        cy.intercept('POST', 'url')
      })`,
        errors: [
          {
            messageId: "noInterceptWithoutStub",
            line: 2,
            column: 9,
            endLine: 2,
            endColumn: 36,
          },
        ],
      },
    ],
  }
);

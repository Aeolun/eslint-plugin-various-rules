eslint-plugin-various-rules
====

A combination package that adds some convenient rules for working with redux/saga/cypress.

Rules
---

Currently included rules are.

### all-cy-intercept-at-top (default)
To make sure that you always write all your intercepts before taking any actions.

### no-intercept-without-stub (default)
To prevent you from writing intercepts that simply check whether a request is sent instead of actually mocking the data.

### no-restricted-syntax-extra
Is a copy of [no-restricted-syntax](https://eslint.org/docs/rules/no-restricted-syntax) provided so that you can have
both error and warning rules at the same time.
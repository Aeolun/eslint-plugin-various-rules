import noRestrictedSyntax from "eslint/lib/rules/no-restricted-syntax";
import { TSESTree } from "@typescript-eslint/types";
import { TSESLint } from "@typescript-eslint/experimental-utils";

const interceptAtTop: TSESLint.RuleModule<string, any[]> = {
  create: function (context: TSESLint.RuleContext<string, any[]>) {
    // rule implementation ...
    return {
      ["BlockStatement"](node) {
        if (node.body) {
          const items = node.body
            .map((expression) => {
              const simpleNode = (expression as any)?.expression?.callee
                ?.property as TSESTree.Identifier;
              const intendedNode = (expression as any)?.expression?.callee
                ?.object?.callee?.property as TSESTree.Identifier;

              return intendedNode ?? simpleNode;
            })
            .filter((i) => !!i);

          let hadNonIntercept = false;
          items.forEach((node) => {
            if (node.name !== "intercept") {
              hadNonIntercept = true;
            } else if (hadNonIntercept === true) {
              context.report({
                messageId: "noInterceptAfterActions",
                //@ts-ignore
                node: node,
              });
            }
          });
        }

        return;
      },
    };
  },
  meta: {
    type: "problem",
    messages: {
      noInterceptAfterActions:
        "Don't call intercept after other actions. Intercepts should be set at the top of every handler.",
    },
    schema: {},
    docs: {
      category: "Possible Errors",
      recommended: false,
      url: "",
      description: "Good stuff",
    },
  },
};

const noInterceptWithoutStub: TSESLint.RuleModule<string, any[]> = {
  create: function (context: TSESLint.RuleContext<string, any[]>) {
    // rule implementation ...
    return {
      ["CallExpression"](node) {
        if (node.callee.type === "MemberExpression") {
          if (
            node.callee.object.type === "Identifier" &&
            node.callee.object.name === "cy" &&
            node.callee.property.type === "Identifier" &&
            node.callee.property.name === "intercept" &&
            node.arguments[0].type === "Literal" &&
            node.arguments[1].type === "Literal" &&
            node.arguments.length < 3
          ) {
            context.report({
              messageId: "noInterceptWithoutStub",
              node: node,
            });
          }
        }

        return;
      },
    };
  },
  meta: {
    type: "problem",
    messages: {
      noInterceptWithoutStub:
        "Don't call intercept without a stub, this will send the request to the actual backend service.",
    },
    schema: {},
    docs: {
      category: "Possible Errors",
      recommended: false,
      url: "",
      description: "Good stuff",
    },
  },
};

export = {
  rules: {
    "all-cy-intercept-at-top": interceptAtTop,
    "no-intercept-without-stub": noInterceptWithoutStub,
    "no-restricted-syntax-extra": noRestrictedSyntax,
  },
  configs: {
    default: {
      plugins: ["various-rules"],
      rules: {
        "various-rules/all-cy-intercept-at-top": "error",
        "various-rules/no-intercept-without-stub": "error",
      },
    },
  },
};

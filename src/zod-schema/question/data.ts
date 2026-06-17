import { z } from "zod";
import { MediaType } from "../common";

const minOptions = 2;
const maxOptions = 8;

export const OptionMediaSchema = z.object({
  id: z.string().uuid(),
  type: MediaType,
  url: z.string().url(),
});

export const SingleChoiceQuestionSchema = z
  .object({
    options: z
      .array(
        z.object({
          choiceId: z.string().trim().min(1),
          text: z.string().trim().min(1),
          media: OptionMediaSchema.optional(),
        }),
      )
      .min(minOptions, { message: "At least 2 choices required" })
      .max(maxOptions, { message: "At most 8 choices allowed" }),
    correctChoiceId: z.string().trim().min(1),
  })
  .superRefine((data, ctx) => {
    const texts = data.options.map((o) => o.text);
    if (new Set(texts).size !== texts.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each option text must be unique",
        path: ["options"],
      });
    }
    const ids = data.options.map((o) => o.choiceId);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each choiceId must be unique",
        path: ["options"],
      });
    }
    if (!ids.includes(data.correctChoiceId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "correctChoiceId must reference an existing option",
        path: ["correctChoiceId"],
      });
    }
  });

export const MultipleChoiceQuestionSchema = z
  .object({
    options: z
      .array(
        z.object({
          choiceId: z.string().trim().min(1),
          text: z.string().trim().min(1),
          media: OptionMediaSchema.optional(),
        }),
      )
      .min(minOptions, { message: "At least 2 choices required" })
      .max(maxOptions, { message: "At most 8 choices allowed" }),
    correctChoiceIds: z
      .array(z.string().trim().min(1))
      .min(1, { message: "At least 1 correct choice required" }),
  })
  .superRefine((data, ctx) => {
    const texts = data.options.map((o) => o.text);
    if (new Set(texts).size !== texts.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each option text must be unique",
        path: ["options"],
      });
    }
    const ids = data.options.map((o) => o.choiceId);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each choiceId must be unique",
        path: ["options"],
      });
    }
    for (const cid of data.correctChoiceIds) {
      if (!ids.includes(cid)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `correctChoiceId "${cid}" not found in options`,
          path: ["correctChoiceIds"],
        });
      }
    }
  });

export const FillInTheBlankQuestionSchema = z
  .object({
    template: z.string().trim().min(1, "Template text is required"),
    blanks: z
      .array(
        z.object({
          position: z.number().min(0),
          correctChoiceId: z.string().trim().min(1, "Correct choice ID is required"),
          options: z
            .array(z.object({ choiceId: z.string().trim().min(1), text: z.string().trim().min(1) }))
            .min(minOptions, "At least two options per blank are required")
            .max(
              maxOptions,
              "No more than eight options per blank are allowed",
            ),
        }),
      )
      .min(1, "At least one blank is required"),
  })
  .superRefine((data, ctx) => {
    for (const [i, blank] of data.blanks.entries()) {
      const texts = blank.options.map((o) => o.text);
      if (new Set(texts).size !== texts.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Each option text within a blank must be unique",
          path: ["blanks", i, "options"],
        });
      }
      const ids = blank.options.map((o) => o.choiceId);
      if (new Set(ids).size !== ids.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Each choiceId within a blank must be unique",
          path: ["blanks", i, "options"],
        });
      }
      if (!ids.includes(blank.correctChoiceId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "correctChoiceId must reference an existing option in this blank",
          path: ["blanks", i, "correctChoiceId"],
        });
      }
    }
  });

export const MatchingQuestionSchema = z
  .object({
    left: z
      .array(
        z.object({
          leftId: z.string().trim().min(1),
          text: z.string().trim().min(1),
          media: OptionMediaSchema.optional(),
        }),
      )
      .min(2),
    right: z
      .array(
        z.object({
          rightId: z.string().trim().min(1),
          text: z.string().trim().min(1),
          media: OptionMediaSchema.optional(),
        }),
      )
      .min(2),
    correctMatches: z
      .array(
        z.object({
          leftId: z.string().trim().min(1),
          rightId: z.string().trim().min(1),
        }),
      )
      .min(1),
  })
  .superRefine((data, ctx) => {
    const leftTexts = data.left.map((l) => l.text);
    if (new Set(leftTexts).size !== leftTexts.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each text in left options must be unique",
        path: ["left"],
      });
    }
    const rightTexts = data.right.map((r) => r.text);
    if (new Set(rightTexts).size !== rightTexts.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each text in right options must be unique",
        path: ["right"],
      });
    }
    const leftIdSet = new Set(data.left.map((l) => l.leftId));
    const rightIdSet = new Set(data.right.map((r) => r.rightId));

    if (leftIdSet.size !== data.left.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each leftId must be unique",
        path: ["left"],
      });
    }
    if (rightIdSet.size !== data.right.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each rightId must be unique",
        path: ["right"],
      });
    }

    const matchLeftIds = data.correctMatches.map((m) => m.leftId);
    if (new Set(matchLeftIds).size !== matchLeftIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each leftId in correctMatches must be unique",
        path: ["correctMatches"],
      });
    }
    const matchRightIds = data.correctMatches.map((m) => m.rightId);
    if (new Set(matchRightIds).size !== matchRightIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each rightId in correctMatches must be unique",
        path: ["correctMatches"],
      });
    }

    for (const match of data.correctMatches) {
      if (!leftIdSet.has(match.leftId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `leftId "${match.leftId}" not found in left items`,
          path: ["correctMatches"],
        });
      }
      if (!rightIdSet.has(match.rightId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `rightId "${match.rightId}" not found in right items`,
          path: ["correctMatches"],
        });
      }
    }
  });

export const OrderingQuestionSchema = z
  .object({
    items: z
      .array(
        z.object({
          itemId: z.string().trim().min(1),
          text: z.string().trim().min(1),
          media: OptionMediaSchema.optional(),
        }),
      )
      .min(2, "At least two items are required")
      .max(10, "No more than ten items are allowed"),
    correctOrderItemIds: z
      .array(z.string().trim().min(1))
      .min(2, "At least two correct items are required"),
  })
  .superRefine((data, ctx) => {
    const texts = data.items.map((item) => item.text);
    if (new Set(texts).size !== texts.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each item text must be unique",
        path: ["items"],
      });
    }
    const ids = data.items.map((item) => item.itemId);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each itemId must be unique",
        path: ["items"],
      });
    }
    if (data.correctOrderItemIds.length !== data.items.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "correctOrderItemIds length must match items length",
        path: ["correctOrderItemIds"],
      });
    }
    for (const id of data.correctOrderItemIds) {
      if (!ids.includes(id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `correctOrderItemId "${id}" not found in items`,
          path: ["correctOrderItemIds"],
        });
      }
    }
  });

export const TrueFalseQuestionSchema = z.object({
  isTrue: z.boolean(),
});

export const OpenEndedQuestionSchema = z.object({
  maxLength: z.number().int().min(1).optional(),
  acceptedAnswers: z
    .array(
      z.string().transform((val) => val.trim().toLowerCase()),
    )
    .optional(),
  caseSensitive: z.boolean().optional(),
});

export const EssayQuestionSchema = z
  .object({
    minWords: z.number().int().min(0).optional(),
    maxWords: z.number().int().min(1).optional(),
    rubric: z.string().optional(),
    gradingCriteria: z
      .array(
        z.object({
          criterion: z.string(),
          maxPoints: z.number().int().min(0),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.minWords && data.maxWords && data.minWords > data.maxWords) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "minWords must be ≤ maxWords",
        path: ["minWords"],
      });
    }
  });

export const CodingQuestionSchema = z.object({
  languages: z.array(z.string().min(1)).min(1),
  starterCode: z.string().optional(),
  testCases: z
    .array(
      z.object({
        input: z.string(),
        expectedOutput: z.string(),
        isHidden: z.boolean().optional(),
        label: z.string().optional(),
      }),
    )
    .min(1, "At least one test case is required"),
  timeLimitSeconds: z.number().int().min(1).optional(),
  memoryLimitMb: z.number().int().min(1).optional(),
});

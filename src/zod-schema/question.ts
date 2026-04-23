import { z } from "zod";
import { QuestionType, DifficultyLevel, Visibility, MediaType } from "./common";
const minOptions = 2;
const maxOptions = 4;
export const OptionMediaSchema = z.object({
  id: z.string().uuid(),
  type: MediaType,
  url: z.string().url(),
});

export const SingleChoiceQuestionSchema = z.object({
  options: z
    .array(
      z.object({
        choiceId: z.string(),
        text: z.string(),
        media: OptionMediaSchema.optional(),
      }),
    )
    .min(minOptions, { message: "At least 2 correct choices required" })
    .max(maxOptions, { message: "At most 4 correct choices allowed" }),
  correctChoiceId: z.string("Correct choice is required"),
});

export const MultipleChoiceQuestionSchema = z.object({
  options: z.array(
    z.object({
      choiceId: z.string(),
      text: z.string(),
      media: OptionMediaSchema.optional(),
      isCorrect: z.boolean().optional(),
    }),
  ),
  correctChoiceIds: z
    .array(z.string())
    .min(minOptions, { message: "At least 2 correct choices required" })
    .max(maxOptions, { message: "At most 4 correct choices allowed" }),
});

export const FillInTheBlankQuestionSchema = z.object({
  template: z.string().min(1, "Template text is required"), // e.g., "The capital of France is ____. And the capital of Germany is ____."
  blanks: z
    .array(
      z.object({
        position: z.number().min(0),
        correctChoiceId: z.string().nonempty("Correct choice ID is required"),
        options: z
          .array(z.object({ choiceId: z.string(), text: z.string() }))
          .min(2, "At least two options per blank are required")
          .max(8, "No more than eight options per blank are allowed"),
      }),
    )
    .min(1, "At least one blank is required"),
});
export const MatchingQuestionSchema = z.object({
  // 1. The Pools of Items (Content)
  left: z
    .array(
      z.object({
        leftId: z.string(), // e.g. "L1"
        text: z.string(), // "Cat"
        media: OptionMediaSchema.optional(),
      }),
    )
    .min(2),

  right: z
    .array(
      z.object({
        rightId: z.string(), // e.g. "R1", "R2", "R3"
        text: z.string(), // "Animal", "Car", "Mineral" (Distractor)
        media: OptionMediaSchema.optional(),
      }),
    )
    .min(2),

  // 2. The Logic (References by ID)
  correctMatches: z
    .array(
      z.object({
        leftId: z.string(), // "L1"
        rightId: z.string(), // "R1"
      }),
    )
    .min(1),
});
export const OrderingQuestionSchema = z.object({
  items: z
    .array(
      z.object({
        itemId: z.string(),
        text: z.string(),
      }),
    )
    .min(2, "At least two items are required")
    .max(10, "No more than ten items are allowed"),
});

export const TrueFalseQuestionSchema = z.object({
  isTrue: z.boolean(),
});

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  type: QuestionType,
  difficulty: DifficultyLevel,
  tags: z.array(z.string()),
  text: z.string(),
  data: z.any().nullable(),
  explanation: z.string().nullable(),
  isDeleted: z.boolean(),
  defaultPoint: z.number().int(),
  visibility: Visibility,
  subjectId: z.string().uuid(),
  createdById: z.number().int().nullable(),
  passageId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const QuestionDataSchema = z.discriminatedUnion("type", [
  QuestionSchema.extend({
    type: z.literal(QuestionType.enum.SINGLE_CHOICE),
    data: SingleChoiceQuestionSchema,
  }),
  QuestionSchema.extend({
    type: z.literal(QuestionType.enum.MULTIPLE_CHOICE),
    data: MultipleChoiceQuestionSchema,
  }),
  QuestionSchema.extend({
    type: z.literal(QuestionType.enum.FILL_IN_THE_BLANK),
    data: FillInTheBlankQuestionSchema,
  }),
  QuestionSchema.extend({
    type: z.literal(QuestionType.enum.MATCHING),
    data: MatchingQuestionSchema,
  }),
  QuestionSchema.extend({
    type: z.literal(QuestionType.enum.TRUE_FALSE),
    data: TrueFalseQuestionSchema,
  }),
  QuestionSchema.extend({
    type: z.literal(QuestionType.enum.ORDERING),
    data: OrderingQuestionSchema,
  }),
]);




export const UpdateQuestionSchema = QuestionSchema.partial();
export type QuestionDataSchema = z.infer<typeof QuestionDataSchema>;
export type QuestionSchema = z.infer<typeof QuestionSchema>;
export type UpdateQuestionSchema = z.infer<typeof UpdateQuestionSchema>;

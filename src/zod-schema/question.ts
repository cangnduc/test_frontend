import { z } from "zod";
import { QuestionType, DifficultyLevel, Visibility, MediaType } from "./common";
const minOptions = 2;
const maxOptions = 8;
export const OptionMediaSchema = z.object({
  id: z.string().uuid(),
  type: MediaType,
  url: z.string().url(),
});

//each text in options is different
export const SingleChoiceQuestionSchema = z
  .object({
    options: z
      .array(
        z.object({
          choiceId: z.string(),
          text: z.string(),
          media: OptionMediaSchema.optional(),
        }),
      )
      .min(minOptions, { message: "At least 2 correct choices required" })
      .max(maxOptions, { message: "At most 8 correct choices allowed" }),
    //each text in options is different
    correctChoiceId: z.string("Correct choice is required"),
  })
  .refine(
    (data) => {
      const texts = data.options.map((option) => option.text);
      const uniqueTexts = new Set(texts);
      return texts.length === uniqueTexts.size;
    },
    { message: "Each text in options must be different" },
  );

export const MultipleChoiceQuestionSchema = z
  .object({
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
      .max(maxOptions, { message: "At most 8 correct choices allowed" }),
  })
  .refine(
    (data) => {
      const texts = data.options.map((option) => option.text);
      const uniqueTexts = new Set(texts);
      return texts.length === uniqueTexts.size;
    },
    { message: "Each text in options must be different" },
  );

export const FillInTheBlankQuestionSchema = z
  .object({
    template: z.string().min(1, "Template text is required"), // e.g., "The capital of France is ____. And the capital of Germany is ____."
    blanks: z
      .array(
        z.object({
          position: z.number().min(0),
          correctChoiceId: z.string().nonempty("Correct choice ID is required"),
          options: z
            .array(z.object({ choiceId: z.string(), text: z.string() }))
            .min(minOptions, "At least two options per blank are required")
            .max(
              maxOptions,
              "No more than eight options per blank are allowed",
            ),
        }),
      )
      .min(1, "At least one blank is required"),
  })
  .refine(
    (data) => {
      const texts = data.blanks.map((blank) =>
        blank.options.map((option) => option.text),
      );
      const uniqueTexts = new Set(texts);
      return texts.length === uniqueTexts.size;
    },
    { message: "Each text in options must be different" },
  );
export const MatchingQuestionSchema = z
  .object({
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
  })
  .refine(
    (data) => {
      const texts = data.left.map((left) => left.text);
      const uniqueTexts = new Set(texts);
      return texts.length === uniqueTexts.size;
    },
    { message: "Each text in options must be different" },
  )
  .refine(
    (data) => {
      const texts = data.right.map((right) => right.text);
      const uniqueTexts = new Set(texts);
      return texts.length === uniqueTexts.size;
    },
    { message: "Each text in options must be different" },
  )
  .refine(
    (data) => {
      const leftIds = data.correctMatches.map((match) => match.leftId);
      const uniqueLeftIds = new Set(leftIds);
      return leftIds.length === uniqueLeftIds.size;
    },
    { message: "Each leftId in correctMatches must be different" },
  )
  .refine(
    (data) => {
      const rightIds = data.correctMatches.map((match) => match.rightId);
      const uniqueRightIds = new Set(rightIds);
      return rightIds.length === uniqueRightIds.size;
    },
    { message: "Each rightId in correctMatches must be different" },
  );

export const OrderingQuestionSchema = z
  .object({
    items: z
      .array(
        z.object({
          itemId: z.string(),
          text: z.string(),
        }),
      )
      .min(2, "At least two items are required")
      .max(10, "No more than ten items are allowed"),
  })
  .refine(
    (data) => {
      const texts = data.items.map((item) => item.text);
      const uniqueTexts = new Set(texts);
      return texts.length === uniqueTexts.size;
    },
    { message: "Each text in options must be different" },
  );

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

const sampleQuestionData: z.infer<typeof QuestionDataSchema> = {
  id: "",
  type: "SINGLE_CHOICE",
  difficulty: "DL_1",
  tags: ["tag1", "tag2"],
  text: "Question text",
  explanation: "Explanation",
  defaultPoint: 1,
  visibility: Visibility.enum.PUBLIC,
  subjectId: "subject-id",
  data: {
    options: [
      { choiceId: "1", text: "First" },
      { choiceId: "2", text: "Second" },
      { choiceId: "3", text: "Third" },
    ],
    correctChoiceId: "1",
  },
  isDeleted: false,
  createdById: 1,
  passageId: "passage-id",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Request schemas
export const CreateQuestionSchema = z.object({
  type: QuestionType,
  difficulty: DifficultyLevel.optional(),
  tags: z.array(z.string()).optional(),
  text: z.string(),
  data: QuestionDataSchema.optional(),
  explanation: z.string().optional(),
  defaultPoint: z.number().int().optional(),
  visibility: Visibility.optional(),
  subjectId: z.string().uuid(),
  passageId: z.string().uuid().optional(),
});

export const UpdateQuestionSchema = CreateQuestionSchema.partial();

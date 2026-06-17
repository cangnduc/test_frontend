import { z } from "zod";

export const SingleChoiceResponseSchema = z.object({
  selectedChoiceId: z.string(),
});

export const MultipleChoiceResponseSchema = z.object({
  selectedChoiceIds: z.array(z.string()).min(1),
});

export const TrueFalseResponseSchema = z.object({
  answer: z.boolean(),
});

export const FillInTheBlankResponseSchema = z.object({
  blanks: z.array(
    z.object({
      position: z.number().int().min(0),
      selectedChoiceId: z.string(),
    }),
  ),
});

export const MatchingResponseSchema = z.object({
  matches: z.array(
    z.object({
      leftId: z.string(),
      rightId: z.string(),
    }),
  ),
});

export const OrderingResponseSchema = z.object({
  orderedItemIds: z.array(z.string()),
});

export const OpenEndedResponseSchema = z.object({
  answer: z.string(),
});

export const EssayResponseSchema = z.object({
  content: z.string(),
  wordCount: z.number().int().optional(),
});

export const CodingResponseSchema = z.object({
  language: z.string(),
  code: z.string(),
});

export const AttemptResponseSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("SINGLE_CHOICE"),
    response: SingleChoiceResponseSchema,
  }),
  z.object({
    type: z.literal("MULTIPLE_CHOICE"),
    response: MultipleChoiceResponseSchema,
  }),
  z.object({
    type: z.literal("TRUE_FALSE"),
    response: TrueFalseResponseSchema,
  }),
  z.object({
    type: z.literal("FILL_IN_THE_BLANK"),
    response: FillInTheBlankResponseSchema,
  }),
  z.object({ type: z.literal("MATCHING"), response: MatchingResponseSchema }),
  z.object({ type: z.literal("ORDERING"), response: OrderingResponseSchema }),
  z.object({
    type: z.literal("OPEN_ENDED"),
    response: OpenEndedResponseSchema,
  }),
  z.object({ type: z.literal("ESSAY"), response: EssayResponseSchema }),
  z.object({ type: z.literal("CODING"), response: CodingResponseSchema }),
]);

export const QuestionResponseSchema = z.union([
  SingleChoiceResponseSchema,
  MultipleChoiceResponseSchema,
  TrueFalseResponseSchema,
  FillInTheBlankResponseSchema,
  MatchingResponseSchema,
  OrderingResponseSchema,
  OpenEndedResponseSchema,
  EssayResponseSchema,
  CodingResponseSchema,
]);

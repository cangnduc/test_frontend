import { z } from "zod";
import { QuestionType, Visibility } from "../common";
import {
  SingleChoiceQuestionSchema,
  MultipleChoiceQuestionSchema,
  FillInTheBlankQuestionSchema,
  MatchingQuestionSchema,
  TrueFalseQuestionSchema,
  OrderingQuestionSchema,
  OpenEndedQuestionSchema,
  EssayQuestionSchema,
  CodingQuestionSchema,
} from "./data";

export const CreateQuestionBaseSchema = z.object({
  subjectId: z.string().uuid(),
  difficulty: z.number().int().min(1).max(10),
  text: z.string().trim().min(1),
  explanation: z.string().trim().min(1).optional(),
  defaultPoint: z.number().int().optional(),
  visibility: Visibility,
  passageVersionId: z.string().uuid().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export const CreateSingleChoiceQuestionSchema = CreateQuestionBaseSchema.extend(
  {
    type: z.literal(QuestionType.enum.SINGLE_CHOICE),
    data: SingleChoiceQuestionSchema,
  },
);
export const CreateMultipleChoiceQuestionSchema =
  CreateQuestionBaseSchema.extend({
    type: z.literal(QuestionType.enum.MULTIPLE_CHOICE),
    data: MultipleChoiceQuestionSchema,
  });
export const CreateFillInTheBlankQuestionSchema =
  CreateQuestionBaseSchema.extend({
    type: z.literal(QuestionType.enum.FILL_IN_THE_BLANK),
    data: FillInTheBlankQuestionSchema,
  });
export const CreateMatchingQuestionSchema = CreateQuestionBaseSchema.extend({
  type: z.literal(QuestionType.enum.MATCHING),
  data: MatchingQuestionSchema,
});
export const CreateTrueFalseQuestionSchema = CreateQuestionBaseSchema.extend({
  type: z.literal(QuestionType.enum.TRUE_FALSE),
  data: TrueFalseQuestionSchema,
});
export const CreateOrderingQuestionSchema = CreateQuestionBaseSchema.extend({
  type: z.literal(QuestionType.enum.ORDERING),
  data: OrderingQuestionSchema,
});
export const CreateOpenEndedQuestionSchema = CreateQuestionBaseSchema.extend({
  type: z.literal(QuestionType.enum.OPEN_ENDED),
  data: OpenEndedQuestionSchema,
});
export const CreateEssayQuestionSchema = CreateQuestionBaseSchema.extend({
  type: z.literal(QuestionType.enum.ESSAY),
  data: EssayQuestionSchema,
});
export const CreateCodingQuestionSchema = CreateQuestionBaseSchema.extend({
  type: z.literal(QuestionType.enum.CODING),
  data: CodingQuestionSchema,
});

export const CreateQuestionSchema = z.discriminatedUnion("type", [
  CreateSingleChoiceQuestionSchema,
  CreateMultipleChoiceQuestionSchema,
  CreateFillInTheBlankQuestionSchema,
  CreateMatchingQuestionSchema,
  CreateTrueFalseQuestionSchema,
  CreateOrderingQuestionSchema,
  CreateOpenEndedQuestionSchema,
  CreateEssayQuestionSchema,
  CreateCodingQuestionSchema,
]);

export const CreateQuestionVersionSchema = z.discriminatedUnion("type", [
  CreateSingleChoiceQuestionSchema.extend({ questionId: z.string().uuid() }),
  CreateMultipleChoiceQuestionSchema.extend({ questionId: z.string().uuid() }),
  CreateFillInTheBlankQuestionSchema.extend({ questionId: z.string().uuid() }),
  CreateMatchingQuestionSchema.extend({ questionId: z.string().uuid() }),
  CreateTrueFalseQuestionSchema.extend({ questionId: z.string().uuid() }),
  CreateOrderingQuestionSchema.extend({ questionId: z.string().uuid() }),
  CreateOpenEndedQuestionSchema.extend({ questionId: z.string().uuid() }),
  CreateEssayQuestionSchema.extend({ questionId: z.string().uuid() }),
  CreateCodingQuestionSchema.extend({ questionId: z.string().uuid() }),
]);

export const UpdateQuestionVersionSchema = z.discriminatedUnion("type", [
  CreateSingleChoiceQuestionSchema.omit({ subjectId: true })
    .partial()
    .extend({ type: z.literal(QuestionType.enum.SINGLE_CHOICE) }),
  CreateMultipleChoiceQuestionSchema.omit({ subjectId: true })
    .partial()
    .extend({ type: z.literal(QuestionType.enum.MULTIPLE_CHOICE) }),
  CreateFillInTheBlankQuestionSchema.omit({ subjectId: true })
    .partial()
    .extend({ type: z.literal(QuestionType.enum.FILL_IN_THE_BLANK) }),
  CreateMatchingQuestionSchema.omit({ subjectId: true })
    .partial()
    .extend({ type: z.literal(QuestionType.enum.MATCHING) }),
  CreateTrueFalseQuestionSchema.omit({ subjectId: true })
    .partial()
    .extend({ type: z.literal(QuestionType.enum.TRUE_FALSE) }),
  CreateOrderingQuestionSchema.omit({ subjectId: true })
    .partial()
    .extend({ type: z.literal(QuestionType.enum.ORDERING) }),
  CreateOpenEndedQuestionSchema.omit({ subjectId: true })
    .partial()
    .extend({ type: z.literal(QuestionType.enum.OPEN_ENDED) }),
  CreateEssayQuestionSchema.omit({ subjectId: true })
    .partial()
    .extend({ type: z.literal(QuestionType.enum.ESSAY) }),
  CreateCodingQuestionSchema.omit({ subjectId: true })
    .partial()
    .extend({ type: z.literal(QuestionType.enum.CODING) }),
]);

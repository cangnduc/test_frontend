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

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  subjectId: z.string().uuid(),
  createdById: z.number().int().nullable(),
  currentVersionId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const QuestionVersionSchema = z.object({
  id: z.string().uuid(),
  questionId: z.string().uuid(),
  version: z.number().int(),
  type: QuestionType,
  difficulty: z.number().int().min(1).max(10),
  text: z.string(),
  data: z.unknown(),
  explanation: z.string().nullable(),
  defaultPoint: z.number().int(),
  visibility: Visibility,
  passageVersionId: z.string().uuid().nullable(),
  createdById: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const QuestionVersionDataSchema = z.discriminatedUnion("type", [
  QuestionVersionSchema.extend({
    type: z.literal(QuestionType.enum.SINGLE_CHOICE),
    data: SingleChoiceQuestionSchema,
  }),
  QuestionVersionSchema.extend({
    type: z.literal(QuestionType.enum.MULTIPLE_CHOICE),
    data: MultipleChoiceQuestionSchema,
  }),
  QuestionVersionSchema.extend({
    type: z.literal(QuestionType.enum.FILL_IN_THE_BLANK),
    data: FillInTheBlankQuestionSchema,
  }),
  QuestionVersionSchema.extend({
    type: z.literal(QuestionType.enum.MATCHING),
    data: MatchingQuestionSchema,
  }),
  QuestionVersionSchema.extend({
    type: z.literal(QuestionType.enum.TRUE_FALSE),
    data: TrueFalseQuestionSchema,
  }),
  QuestionVersionSchema.extend({
    type: z.literal(QuestionType.enum.ORDERING),
    data: OrderingQuestionSchema,
  }),
  QuestionVersionSchema.extend({
    type: z.literal(QuestionType.enum.OPEN_ENDED),
    data: OpenEndedQuestionSchema,
  }),
  QuestionVersionSchema.extend({
    type: z.literal(QuestionType.enum.ESSAY),
    data: EssayQuestionSchema,
  }),
  QuestionVersionSchema.extend({
    type: z.literal(QuestionType.enum.CODING),
    data: CodingQuestionSchema,
  }),
]);

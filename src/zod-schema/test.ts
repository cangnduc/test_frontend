import { z } from "zod";
import { 
  PublishStatus, 
  DifficultyLevel, 
  ResultViewType, 
  SectionType, 
  SelectionMode 
} from "./common";

export const TestSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: PublishStatus,
  tokenRequired: z.number().int(),
  tags: z.array(z.string()),
  difficulty: DifficultyLevel,
  coverMediaId: z.string().uuid().nullable(),
  subjectId: z.string().uuid(),
  createdById: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TestSettingSchema = z.object({
  id: z.string().uuid(),
  availableFrom: z.date().nullable(),
  availableTo: z.date().nullable(),
  duration: z.number().int().nullable(),
  maxAttempts: z.number().int().nullable(),
  shuffleQuestions: z.boolean().nullable(),
  showResultImmediately: z.boolean().nullable(),
  requirePassword: z.string().nullable(),
  ipRestriction: z.string().nullable(),
  strictMode: z.boolean().nullable(),
  forwardOnly: z.boolean().nullable(),
  passingPercentage: z.number().int().nullable(),
  resultView: ResultViewType.nullable(),
  testId: z.string().uuid(),
});

export const TestSectionSchema = z.object({
  id: z.string().uuid(),
  type: SectionType,
  title: z.string(),
  order: z.number().int(),
  description: z.string().nullable(),
  timeLimit: z.number().int().nullable(),
  questionSelectionMode: SelectionMode,
  questionToSelect: z.number().int().nullable(),
  testId: z.string().uuid(),
  passageId: z.string().uuid().nullable(),
});

export const TestQuestionSchema = z.object({
  id: z.string().uuid(),
  sectionId: z.string().uuid(),
  questionId: z.string().uuid(),
  order: z.number().int(),
  point: z.number().int(),
});

// Request schemas
export const CreateTestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: PublishStatus.optional(),
  tokenRequired: z.number().int().optional(),
  tags: z.array(z.string()).optional(),
  difficulty: DifficultyLevel.optional(),
  subjectId: z.string().uuid(),
});

export const UpdateTestSchema = CreateTestSchema.partial();

export const CreateTestSectionSchema = z.object({
  type: SectionType,
  title: z.string(),
  order: z.number().int(),
  description: z.string().optional(),
  timeLimit: z.number().int().optional(),
  questionSelectionMode: SelectionMode.optional(),
  questionToSelect: z.number().int().optional(),
  testId: z.string().uuid(),
  passageId: z.string().uuid().optional(),
});

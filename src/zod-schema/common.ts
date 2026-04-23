import { z } from "zod";

export const UserRole = z.enum(["USER", "ADMIN", "TEACHER", "MOD", "PARENT"]);

export const DifficultyLevel = z.enum([
  "DL_1", "DL_2", "DL_3", "DL_4", "DL_5",
  "DL_6", "DL_7", "DL_8", "DL_9", "DL_10"
]);

export const PublishStatus = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "PRIVATE"]);

export const AttemptStatus = z.enum([
  "STARTED", "IN_PROGRESS", "SUBMITTED", "COMPLETED", "EXPIRED"
]);

export const PassageType = z.enum(["READING", "LISTENING"]);

export const QuestionType = z.enum([
  "MULTIPLE_CHOICE", "SINGLE_CHOICE", "TRUE_FALSE", "FILL_IN_THE_BLANK",
  "MATCHING", "ORDERING", "OPEN_ENDED", "ESSAY", "CODING"
]);

export const SubjectType = z.enum([
  "MATH", "ENGLISH", "SCIENCE", "HISTORY", "GEOGRAPHY",
  "ART", "MUSIC", "PHYSICAL_EDUCATION", "GENERAL_KNOWLEDGE"
]);

export const Visibility = z.enum(["PUBLIC", "PRIVATE"]);

export const ResultViewType = z.enum([
  "IMMEDIATE", "SCORE_ONLY", "MANUAL_GRADING", "NEVER"
]);

export const SectionType = z.enum(["STANDALONE", "PASSAGE_BASED"]);

export const MediaType = z.enum([
  "IMAGE", "AUDIO", "VIDEO", "PDF", "DOCUMENT", "YOUTUBE"
]);

export const SelectionMode = z.enum(["ALL_REQUIRED", "CHOOSE_N", "RANDOM_N"]);

export const SectionStatus = z.enum(["LOCKED", "ACTIVE", "COMPLETED"]);

export const TokenTransactionReason = z.enum([
  "TEST_ATTEMPT", "TEST_REFUND", "REWARD", "ADMIN_ADJUSTMENT"
]);

export const Gender = z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]);

export const ClassRole = z.enum(["STUDENT", "AUDITOR"]);

export const NotificationType = z.enum([
  "GRADE_READY", "TEST_ASSIGNED", "ACHIEVEMENT_UNLOCKED", "SYSTEM"
]);

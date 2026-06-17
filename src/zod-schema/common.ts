import { z } from "zod";

export const UserRole = z.enum(["USER", "ADMIN", "TEACHER", "MOD", "PARENT"]);

export const DifficultyLevel = z.number().int().min(1).max(10);

export const PublishStatus = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "PRIVATE"]);

export const AttemptStatus = z.enum([
  "STARTED", "IN_PROGRESS", "SUBMITTED", "COMPLETED", "EXPIRED"
]);

export const PassageType = z.enum(["READING", "LISTENING"]);

export const QuestionType = z.enum([
  "MULTIPLE_CHOICE", "SINGLE_CHOICE", "TRUE_FALSE", "FILL_IN_THE_BLANK",
  "MATCHING", "ORDERING", "OPEN_ENDED", "ESSAY", "CODING"
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

export const ClassRole = z.enum(["STUDENT", "AUDITOR", "TEACHER", "MOD", "ADMIN"]);

export const NotificationType = z.enum([
  "GRADE_READY", "TEST_ASSIGNED", "ACHIEVEMENT_UNLOCKED", "SYSTEM"
]);

export const HomeworkStatus = z.enum(["DRAFT", "PUBLISHED", "CLOSED"]);

export const SubmissionStatus = z.enum(["SUBMITTED", "GRADED", "RETURNED"]);

export const LeaderboardScope = z.enum(["GLOBAL", "CLASS", "SUBJECT"]);

export const AttendanceStatus = z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]);

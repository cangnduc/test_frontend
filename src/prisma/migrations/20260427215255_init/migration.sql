-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'TEACHER', 'MOD', 'PARENT');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('STARTED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PassageType" AS ENUM ('READING', 'LISTENING');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_THE_BLANK', 'MATCHING', 'ORDERING', 'OPEN_ENDED', 'ESSAY', 'CODING');

-- CreateEnum
CREATE TYPE "ResultViewType" AS ENUM ('IMMEDIATE', 'SCORE_ONLY', 'MANUAL_GRADING', 'NEVER');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('STANDALONE', 'PASSAGE_BASED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'AUDIO', 'VIDEO', 'PDF', 'DOCUMENT', 'YOUTUBE');

-- CreateEnum
CREATE TYPE "SelectionMode" AS ENUM ('ALL_REQUIRED', 'CHOOSE_N', 'RANDOM_N');

-- CreateEnum
CREATE TYPE "SectionStatus" AS ENUM ('LOCKED', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TokenTransactionReason" AS ENUM ('TEST_ATTEMPT', 'TEST_REFUND', 'REWARD', 'ADMIN_ADJUSTMENT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "ClassRole" AS ENUM ('STUDENT', 'AUDITOR', 'TEACHER', 'MOD', 'ADMIN');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('GRADE_READY', 'TEST_ASSIGNED', 'ACHIEVEMENT_UNLOCKED', 'SYSTEM');

-- CreateTable
CREATE TABLE "class" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "teacher_id" INTEGER NOT NULL,
    "subject_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_enrollment" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" "ClassRole" NOT NULL DEFAULT 'STUDENT',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_test_assignment" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "test_version_id" TEXT NOT NULL,
    "due_at" TIMESTAMP(3),
    "assigned_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_test_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_log" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "context" JSONB,
    "trace_id" TEXT,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "actor_id" INTEGER,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "alt" TEXT,
    "size" INTEGER,
    "mime_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "created_at_id" INTEGER,
    "current_version_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_version" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "type" "QuestionType" NOT NULL,
    "difficulty" SMALLINT NOT NULL DEFAULT 1,
    "tags" TEXT[],
    "text" TEXT NOT NULL,
    "data" JSONB,
    "explanation" TEXT,
    "default_point" INTEGER NOT NULL DEFAULT 1,
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "passage_version_id" TEXT,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passage" (
    "id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "created_by_id" INTEGER,
    "current_version_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passage_version" (
    "id" TEXT NOT NULL,
    "passage_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "type" "PassageType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "difficulty" SMALLINT NOT NULL DEFAULT 1,
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "tags" TEXT[],
    "explanation" TEXT,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passage_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_attempt" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "test_id" TEXT NOT NULL,
    "test_version_id" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "attempt_number" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "global_end_at" TIMESTAMP(3),
    "current_section_id" TEXT,
    "total_score" DOUBLE PRECISION DEFAULT 0,
    "max_score" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "passed" BOOLEAN,
    "config_snapshot" JSONB,
    "session_token" TEXT,
    "client_fingerprint" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_section" (
    "id" TEXT NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "test_version_section_id" TEXT NOT NULL,
    "status" "SectionStatus" NOT NULL DEFAULT 'LOCKED',
    "started_at" TIMESTAMP(3),
    "section_end_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attempt_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_question" (
    "id" TEXT NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "attempt_section_id" TEXT NOT NULL,
    "question_version_id" TEXT NOT NULL,
    "test_version_question_id" TEXT,
    "display_order" INTEGER NOT NULL,
    "point" INTEGER NOT NULL,
    "is_required" BOOLEAN NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attempt_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_answer" (
    "id" TEXT NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "attempt_question_id" TEXT NOT NULL,
    "question_version_id" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "points_awarded" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_correct" BOOLEAN,
    "saved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attempt_answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manual_grade" (
    "id" TEXT NOT NULL,
    "attempt_answer_id" TEXT NOT NULL,
    "graded_by_id" INTEGER NOT NULL,
    "points_awarded" DOUBLE PRECISION NOT NULL,
    "feedback" TEXT,
    "graded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manual_grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "subject_id" TEXT NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_version" (
    "id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "token_required" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "difficulty" SMALLINT NOT NULL DEFAULT 1,
    "cover_media_id" TEXT,
    "created_by_id" INTEGER NOT NULL,
    "available_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "available_to" TIMESTAMP(3),
    "duration" INTEGER,
    "max_attempts" INTEGER DEFAULT -1,
    "shuffle_questions" BOOLEAN DEFAULT false,
    "show_result_immediately" BOOLEAN DEFAULT true,
    "require_password" TEXT,
    "ip_restriction" TEXT,
    "strict_mode" BOOLEAN DEFAULT false,
    "forward_only" BOOLEAN DEFAULT false,
    "passing_percentage" INTEGER DEFAULT 50,
    "result_view" "ResultViewType" DEFAULT 'IMMEDIATE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_version_section" (
    "id" TEXT NOT NULL,
    "test_version_id" TEXT NOT NULL,
    "type" "SectionType" NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "description" TEXT,
    "time_limit" INTEGER DEFAULT -1,
    "question_selection_mode" "SelectionMode" NOT NULL DEFAULT 'ALL_REQUIRED',
    "question_to_select" INTEGER DEFAULT -1,
    "passage_version_id" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_version_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_version_question" (
    "id" TEXT NOT NULL,
    "test_version_section_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "question_version_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_version_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" TIMESTAMP(3),
    "refresh_token_expires_at" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "bio" TEXT,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "gender" "Gender",
    "language" TEXT DEFAULT 'en',
    "timezone" TEXT DEFAULT 'UTC',
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_student_link" (
    "id" TEXT NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parent_student_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_stats" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "tests_taken" INTEGER NOT NULL DEFAULT 0,
    "tests_completed" INTEGER NOT NULL DEFAULT 0,
    "tests_passed" INTEGER NOT NULL DEFAULT 0,
    "last_active_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_transaction" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "reason" "TokenTransactionReason" NOT NULL,
    "test_id" TEXT,
    "attempt_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_test_progress" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "test_id" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL,
    "score" DOUBLE PRECISION,
    "max_score" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "last_attempt_id" TEXT,
    "last_activity_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_test_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MediaToQuestionVersion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MediaToQuestionVersion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MediaToPassageVersion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MediaToPassageVersion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "class_code_key" ON "class"("code");

-- CreateIndex
CREATE INDEX "class_enrollment_user_id_idx" ON "class_enrollment"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "class_enrollment_class_id_user_id_key" ON "class_enrollment"("class_id", "user_id");

-- CreateIndex
CREATE INDEX "class_test_assignment_class_id_idx" ON "class_test_assignment"("class_id");

-- CreateIndex
CREATE INDEX "class_test_assignment_test_id_idx" ON "class_test_assignment"("test_id");

-- CreateIndex
CREATE UNIQUE INDEX "class_test_assignment_class_id_test_version_id_key" ON "class_test_assignment"("class_id", "test_version_id");

-- CreateIndex
CREATE INDEX "system_log_level_idx" ON "system_log"("level");

-- CreateIndex
CREATE INDEX "system_log_user_id_idx" ON "system_log"("user_id");

-- CreateIndex
CREATE INDEX "system_log_trace_id_idx" ON "system_log"("trace_id");

-- CreateIndex
CREATE INDEX "system_log_created_at_idx" ON "system_log"("created_at");

-- CreateIndex
CREATE INDEX "audit_log_resource_resource_id_idx" ON "audit_log"("resource", "resource_id");

-- CreateIndex
CREATE INDEX "audit_log_actor_id_created_at_idx" ON "audit_log"("actor_id", "created_at");

-- CreateIndex
CREATE INDEX "media_owner_id_idx" ON "media"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "subject_code_key" ON "subject"("code");

-- CreateIndex
CREATE UNIQUE INDEX "question_current_version_id_key" ON "question"("current_version_id");

-- CreateIndex
CREATE INDEX "question_subject_id_idx" ON "question"("subject_id");

-- CreateIndex
CREATE INDEX "question_created_at_id_idx" ON "question"("created_at_id");

-- CreateIndex
CREATE INDEX "question_version_question_id_version_idx" ON "question_version"("question_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "passage_current_version_id_key" ON "passage"("current_version_id");

-- CreateIndex
CREATE INDEX "passage_version_passage_id_version_idx" ON "passage_version"("passage_id", "version");

-- CreateIndex
CREATE INDEX "passage_version_created_by_id_idx" ON "passage_version"("created_by_id");

-- CreateIndex
CREATE INDEX "test_attempt_user_id_test_id_status_idx" ON "test_attempt"("user_id", "test_id", "status");

-- CreateIndex
CREATE INDEX "test_attempt_test_version_id_idx" ON "test_attempt"("test_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "test_attempt_user_id_test_id_attempt_number_key" ON "test_attempt"("user_id", "test_id", "attempt_number");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_section_attempt_id_test_version_section_id_key" ON "attempt_section"("attempt_id", "test_version_section_id");

-- CreateIndex
CREATE INDEX "attempt_question_attempt_id_attempt_section_id_display_orde_idx" ON "attempt_question"("attempt_id", "attempt_section_id", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_question_attempt_id_question_version_id_key" ON "attempt_question"("attempt_id", "question_version_id");

-- CreateIndex
CREATE INDEX "attempt_answer_attempt_id_idx" ON "attempt_answer"("attempt_id");

-- CreateIndex
CREATE INDEX "attempt_answer_attempt_question_id_idx" ON "attempt_answer"("attempt_question_id");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_answer_attempt_id_attempt_question_id_key" ON "attempt_answer"("attempt_id", "attempt_question_id");

-- CreateIndex
CREATE UNIQUE INDEX "manual_grade_attempt_answer_id_key" ON "manual_grade"("attempt_answer_id");

-- CreateIndex
CREATE INDEX "test_subject_id_idx" ON "test"("subject_id");

-- CreateIndex
CREATE INDEX "test_created_by_id_idx" ON "test"("created_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "test_version_cover_media_id_key" ON "test_version"("cover_media_id");

-- CreateIndex
CREATE INDEX "test_version_test_id_status_idx" ON "test_version"("test_id", "status");

-- CreateIndex
CREATE INDEX "test_version_test_id_version_idx" ON "test_version"("test_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "test_version_test_id_version_key" ON "test_version"("test_id", "version");

-- CreateIndex
CREATE INDEX "test_version_section_test_version_id_order_idx" ON "test_version_section"("test_version_id", "order");

-- CreateIndex
CREATE INDEX "test_version_question_test_version_section_id_order_idx" ON "test_version_question"("test_version_section_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "test_version_question_test_version_section_id_question_vers_key" ON "test_version_question"("test_version_section_id", "question_version_id");

-- CreateIndex
CREATE INDEX "account_user_id_idx" ON "account"("user_id");

-- CreateIndex
CREATE INDEX "session_user_id_idx" ON "session"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "profile_user_id_key" ON "profile"("user_id");

-- CreateIndex
CREATE INDEX "parent_student_link_student_id_idx" ON "parent_student_link"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "parent_student_link_parent_id_student_id_key" ON "parent_student_link"("parent_id", "student_id");

-- CreateIndex
CREATE INDEX "notification_user_id_is_read_idx" ON "notification"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "notification_created_at_idx" ON "notification"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_stats_user_id_key" ON "user_stats"("user_id");

-- CreateIndex
CREATE INDEX "token_transaction_user_id_created_at_idx" ON "token_transaction"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "user_test_progress_user_id_status_idx" ON "user_test_progress"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "user_test_progress_user_id_test_id_key" ON "user_test_progress"("user_id", "test_id");

-- CreateIndex
CREATE INDEX "_MediaToQuestionVersion_B_index" ON "_MediaToQuestionVersion"("B");

-- CreateIndex
CREATE INDEX "_MediaToPassageVersion_B_index" ON "_MediaToPassageVersion"("B");

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_enrollment" ADD CONSTRAINT "class_enrollment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_enrollment" ADD CONSTRAINT "class_enrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_test_assignment" ADD CONSTRAINT "class_test_assignment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_test_assignment" ADD CONSTRAINT "class_test_assignment_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_test_assignment" ADD CONSTRAINT "class_test_assignment_test_version_id_fkey" FOREIGN KEY ("test_version_id") REFERENCES "test_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_test_assignment" ADD CONSTRAINT "class_test_assignment_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_log" ADD CONSTRAINT "system_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_created_at_id_fkey" FOREIGN KEY ("created_at_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_current_version_id_fkey" FOREIGN KEY ("current_version_id") REFERENCES "question_version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_version" ADD CONSTRAINT "question_version_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_version" ADD CONSTRAINT "question_version_passage_version_id_fkey" FOREIGN KEY ("passage_version_id") REFERENCES "passage_version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_version" ADD CONSTRAINT "question_version_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passage" ADD CONSTRAINT "passage_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passage" ADD CONSTRAINT "passage_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passage" ADD CONSTRAINT "passage_current_version_id_fkey" FOREIGN KEY ("current_version_id") REFERENCES "passage_version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passage_version" ADD CONSTRAINT "passage_version_passage_id_fkey" FOREIGN KEY ("passage_id") REFERENCES "passage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passage_version" ADD CONSTRAINT "passage_version_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_attempt" ADD CONSTRAINT "test_attempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_attempt" ADD CONSTRAINT "test_attempt_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_attempt" ADD CONSTRAINT "test_attempt_test_version_id_fkey" FOREIGN KEY ("test_version_id") REFERENCES "test_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_attempt" ADD CONSTRAINT "test_attempt_current_section_id_fkey" FOREIGN KEY ("current_section_id") REFERENCES "attempt_section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_section" ADD CONSTRAINT "attempt_section_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "test_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_section" ADD CONSTRAINT "attempt_section_test_version_section_id_fkey" FOREIGN KEY ("test_version_section_id") REFERENCES "test_version_section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_question" ADD CONSTRAINT "attempt_question_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "test_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_question" ADD CONSTRAINT "attempt_question_attempt_section_id_fkey" FOREIGN KEY ("attempt_section_id") REFERENCES "attempt_section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_question" ADD CONSTRAINT "attempt_question_question_version_id_fkey" FOREIGN KEY ("question_version_id") REFERENCES "question_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_question" ADD CONSTRAINT "attempt_question_test_version_question_id_fkey" FOREIGN KEY ("test_version_question_id") REFERENCES "test_version_question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answer" ADD CONSTRAINT "attempt_answer_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "test_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answer" ADD CONSTRAINT "attempt_answer_attempt_question_id_fkey" FOREIGN KEY ("attempt_question_id") REFERENCES "attempt_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answer" ADD CONSTRAINT "attempt_answer_question_version_id_fkey" FOREIGN KEY ("question_version_id") REFERENCES "question_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_grade" ADD CONSTRAINT "manual_grade_attempt_answer_id_fkey" FOREIGN KEY ("attempt_answer_id") REFERENCES "attempt_answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_grade" ADD CONSTRAINT "manual_grade_graded_by_id_fkey" FOREIGN KEY ("graded_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_version" ADD CONSTRAINT "test_version_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_version" ADD CONSTRAINT "test_version_cover_media_id_fkey" FOREIGN KEY ("cover_media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_version" ADD CONSTRAINT "test_version_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_version_section" ADD CONSTRAINT "test_version_section_test_version_id_fkey" FOREIGN KEY ("test_version_id") REFERENCES "test_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_version_section" ADD CONSTRAINT "test_version_section_passage_version_id_fkey" FOREIGN KEY ("passage_version_id") REFERENCES "passage_version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_version_question" ADD CONSTRAINT "test_version_question_test_version_section_id_fkey" FOREIGN KEY ("test_version_section_id") REFERENCES "test_version_section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_version_question" ADD CONSTRAINT "test_version_question_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_version_question" ADD CONSTRAINT "test_version_question_question_version_id_fkey" FOREIGN KEY ("question_version_id") REFERENCES "question_version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_student_link" ADD CONSTRAINT "parent_student_link_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_student_link" ADD CONSTRAINT "parent_student_link_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_transaction" ADD CONSTRAINT "token_transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_transaction" ADD CONSTRAINT "token_transaction_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_transaction" ADD CONSTRAINT "token_transaction_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "test_attempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_test_progress" ADD CONSTRAINT "user_test_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_test_progress" ADD CONSTRAINT "user_test_progress_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_test_progress" ADD CONSTRAINT "user_test_progress_last_attempt_id_fkey" FOREIGN KEY ("last_attempt_id") REFERENCES "test_attempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToQuestionVersion" ADD CONSTRAINT "_MediaToQuestionVersion_A_fkey" FOREIGN KEY ("A") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToQuestionVersion" ADD CONSTRAINT "_MediaToQuestionVersion_B_fkey" FOREIGN KEY ("B") REFERENCES "question_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToPassageVersion" ADD CONSTRAINT "_MediaToPassageVersion_A_fkey" FOREIGN KEY ("A") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToPassageVersion" ADD CONSTRAINT "_MediaToPassageVersion_B_fkey" FOREIGN KEY ("B") REFERENCES "passage_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

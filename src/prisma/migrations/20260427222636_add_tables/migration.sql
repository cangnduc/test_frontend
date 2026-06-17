-- CreateEnum
CREATE TYPE "HomeworkStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('SUBMITTED', 'GRADED', 'RETURNED');

-- CreateEnum
CREATE TYPE "LeaderboardScope" AS ENUM ('GLOBAL', 'CLASS', 'SUBJECT');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateTable
CREATE TABLE "achievement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "category" TEXT,
    "condition" JSONB NOT NULL,
    "xp_reward" INTEGER NOT NULL DEFAULT 0,
    "token_reward" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievement_unlock" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "achievement_id" TEXT NOT NULL,
    "unlocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "achievement_unlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboard" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "scope" "LeaderboardScope" NOT NULL,
    "scope_id" TEXT,
    "rank" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "period" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "term" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "term_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "student_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "note" TEXT,
    "recorded_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_book" (
    "id" TEXT NOT NULL,
    "student_id" INTEGER NOT NULL,
    "class_id" TEXT NOT NULL,
    "term_id" TEXT,
    "total_score" DOUBLE PRECISION,
    "max_score" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "grade" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grade_book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homework_assignment" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_at" TIMESTAMP(3),
    "is_late_allowed" BOOLEAN NOT NULL DEFAULT true,
    "late_penalty_percent" INTEGER,
    "max_score" DOUBLE PRECISION,
    "status" "HomeworkStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homework_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homework_submission" (
    "id" TEXT NOT NULL,
    "homework_id" TEXT NOT NULL,
    "student_id" INTEGER NOT NULL,
    "content" TEXT,
    "score" DOUBLE PRECISION,
    "feedback" TEXT,
    "graded_by_id" INTEGER,
    "graded_at" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_late" BOOLEAN NOT NULL DEFAULT false,
    "attempt_number" INTEGER NOT NULL DEFAULT 1,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homework_submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_file" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "label" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "achievement_name_key" ON "achievement"("name");

-- CreateIndex
CREATE INDEX "achievement_unlock_user_id_idx" ON "achievement_unlock"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "achievement_unlock_user_id_achievement_id_key" ON "achievement_unlock"("user_id", "achievement_id");

-- CreateIndex
CREATE INDEX "leaderboard_scope_scope_id_period_idx" ON "leaderboard"("scope", "scope_id", "period");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboard_user_id_scope_scope_id_period_key" ON "leaderboard"("user_id", "scope", "scope_id", "period");

-- CreateIndex
CREATE INDEX "attendance_class_id_date_idx" ON "attendance"("class_id", "date");

-- CreateIndex
CREATE INDEX "attendance_student_id_idx" ON "attendance"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_class_id_student_id_date_key" ON "attendance"("class_id", "student_id", "date");

-- CreateIndex
CREATE INDEX "grade_book_class_id_term_id_idx" ON "grade_book"("class_id", "term_id");

-- CreateIndex
CREATE UNIQUE INDEX "grade_book_student_id_class_id_term_id_key" ON "grade_book"("student_id", "class_id", "term_id");

-- CreateIndex
CREATE INDEX "homework_assignment_class_id_idx" ON "homework_assignment"("class_id");

-- CreateIndex
CREATE INDEX "homework_assignment_created_by_id_idx" ON "homework_assignment"("created_by_id");

-- CreateIndex
CREATE INDEX "homework_submission_homework_id_idx" ON "homework_submission"("homework_id");

-- CreateIndex
CREATE INDEX "homework_submission_student_id_idx" ON "homework_submission"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "homework_submission_homework_id_student_id_attempt_number_key" ON "homework_submission"("homework_id", "student_id", "attempt_number");

-- CreateIndex
CREATE INDEX "submission_file_submission_id_idx" ON "submission_file"("submission_id");

-- AddForeignKey
ALTER TABLE "achievement_unlock" ADD CONSTRAINT "achievement_unlock_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement_unlock" ADD CONSTRAINT "achievement_unlock_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_recorded_by_id_fkey" FOREIGN KEY ("recorded_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_book" ADD CONSTRAINT "grade_book_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_book" ADD CONSTRAINT "grade_book_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_book" ADD CONSTRAINT "grade_book_term_id_fkey" FOREIGN KEY ("term_id") REFERENCES "term"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework_assignment" ADD CONSTRAINT "homework_assignment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework_assignment" ADD CONSTRAINT "homework_assignment_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework_submission" ADD CONSTRAINT "homework_submission_homework_id_fkey" FOREIGN KEY ("homework_id") REFERENCES "homework_assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework_submission" ADD CONSTRAINT "homework_submission_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework_submission" ADD CONSTRAINT "homework_submission_graded_by_id_fkey" FOREIGN KEY ("graded_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_file" ADD CONSTRAINT "submission_file_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "homework_submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_file" ADD CONSTRAINT "submission_file_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

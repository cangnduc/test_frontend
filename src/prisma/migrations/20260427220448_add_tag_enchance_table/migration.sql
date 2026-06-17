/*
  Warnings:

  - You are about to drop the column `tags` on the `passage_version` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `question_version` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `test_version` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "class_enrollment" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "left_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "class_test_assignment" ADD COLUMN     "available_from" TIMESTAMP(3),
ADD COLUMN     "available_to" TIMESTAMP(3),
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "is_late_allowed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "late_penalty_percent" INTEGER;

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "hash" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "width" INTEGER;

-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "action_url" TEXT,
ADD COLUMN     "expires_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "passage_version" DROP COLUMN "tags";

-- AlterTable
ALTER TABLE "question_version" DROP COLUMN "tags";

-- AlterTable
ALTER TABLE "subject" ADD COLUMN     "color" TEXT,
ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "test" ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "test_attempt" ADD COLUMN     "browser_info" TEXT,
ADD COLUMN     "device_type" TEXT;

-- AlterTable
ALTER TABLE "test_version" DROP COLUMN "tags",
ADD COLUMN     "archived_at" TIMESTAMP(3),
ADD COLUMN     "changelog" TEXT,
ADD COLUMN     "published_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "description" TEXT,
    "type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_tag" (
    "tag_id" TEXT NOT NULL,
    "question_version_id" TEXT NOT NULL,

    CONSTRAINT "question_tag_pkey" PRIMARY KEY ("tag_id","question_version_id")
);

-- CreateTable
CREATE TABLE "test_tag" (
    "tag_id" TEXT NOT NULL,
    "test_version_id" TEXT NOT NULL,

    CONSTRAINT "test_tag_pkey" PRIMARY KEY ("tag_id","test_version_id")
);

-- CreateTable
CREATE TABLE "passage_tag" (
    "tag_id" TEXT NOT NULL,
    "passage_version_id" TEXT NOT NULL,

    CONSTRAINT "passage_tag_pkey" PRIMARY KEY ("tag_id","passage_version_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- AddForeignKey
ALTER TABLE "question_tag" ADD CONSTRAINT "question_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_tag" ADD CONSTRAINT "question_tag_question_version_id_fkey" FOREIGN KEY ("question_version_id") REFERENCES "question_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_tag" ADD CONSTRAINT "test_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_tag" ADD CONSTRAINT "test_tag_test_version_id_fkey" FOREIGN KEY ("test_version_id") REFERENCES "test_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passage_tag" ADD CONSTRAINT "passage_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passage_tag" ADD CONSTRAINT "passage_tag_passage_version_id_fkey" FOREIGN KEY ("passage_version_id") REFERENCES "passage_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

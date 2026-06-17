/*
  Warnings:

  - A unique constraint covering the columns `[passage_id,version]` on the table `passage_version` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[question_id,version]` on the table `question_version` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "passage_version_passage_id_version_idx";

-- DropIndex
DROP INDEX "question_version_question_id_version_idx";

-- CreateIndex
CREATE INDEX "passage_tag_passage_version_id_idx" ON "passage_tag"("passage_version_id");

-- CreateIndex
CREATE INDEX "passage_version_type_idx" ON "passage_version"("type");

-- CreateIndex
CREATE INDEX "passage_version_difficulty_idx" ON "passage_version"("difficulty");

-- CreateIndex
CREATE INDEX "passage_version_visibility_idx" ON "passage_version"("visibility");

-- CreateIndex
CREATE UNIQUE INDEX "passage_version_passage_id_version_key" ON "passage_version"("passage_id", "version");

-- CreateIndex
CREATE INDEX "question_tag_question_version_id_idx" ON "question_tag"("question_version_id");

-- CreateIndex
CREATE INDEX "question_version_type_idx" ON "question_version"("type");

-- CreateIndex
CREATE INDEX "question_version_difficulty_idx" ON "question_version"("difficulty");

-- CreateIndex
CREATE INDEX "question_version_visibility_idx" ON "question_version"("visibility");

-- CreateIndex
CREATE INDEX "question_version_passage_version_id_idx" ON "question_version"("passage_version_id");

-- CreateIndex
CREATE INDEX "question_version_created_at_idx" ON "question_version"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "question_version_question_id_version_key" ON "question_version"("question_id", "version");

-- CreateIndex
CREATE INDEX "test_tag_test_version_id_idx" ON "test_tag"("test_version_id");

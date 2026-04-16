-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'TEACHER', 'MOD', 'PARENT');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('DL_1', 'DL_2', 'DL_3', 'DL_4', 'DL_5', 'DL_6', 'DL_7', 'DL_8', 'DL_9', 'DL_10');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('STARTED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PassageType" AS ENUM ('READING', 'LISTENING');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_THE_BLANK', 'MATCHING', 'ORDERING', 'OPEN_ENDED', 'ESSAY', 'CODING');

-- CreateEnum
CREATE TYPE "SubjectType" AS ENUM ('MATH', 'ENGLISH', 'SCIENCE', 'HISTORY', 'GEOGRAPHY', 'ART', 'MUSIC', 'PHYSICAL_EDUCATION', 'GENERAL_KNOWLEDGE');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ResultViewType" AS ENUM ('Immediate', 'ScoreOnly', 'ManualGrading', 'Never');

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

-- CreateTable
CREATE TABLE "SystemLog" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "context" JSONB,
    "trace_id" TEXT,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'DL_1',
    "tags" TEXT[],
    "text" TEXT NOT NULL,
    "data" JSONB,
    "explanation" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "defaultPoint" INTEGER NOT NULL DEFAULT 1,
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "subjectId" TEXT NOT NULL,
    "createdById" INTEGER,
    "passageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passage" (
    "id" TEXT NOT NULL,
    "type" "PassageType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'DL_1',
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "tags" TEXT[],
    "explanation" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "subjectId" TEXT NOT NULL DEFAULT '9',
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Passage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestAttempt" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "testId" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "attemptNumber" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "globalEndAt" TIMESTAMP(3),
    "currentSectionId" TEXT,
    "totalScore" DOUBLE PRECISION DEFAULT 0,
    "maxScore" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "passed" BOOLEAN,
    "configSnapshot" JSONB NOT NULL,
    "sessionToken" TEXT,
    "clientFingerprint" TEXT,
    "ipAddress" TEXT,

    CONSTRAINT "TestAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttemptSection" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "timeLimit" INTEGER,
    "selectionMode" "SelectionMode",
    "requiredAnswerCount" INTEGER,
    "status" "SectionStatus" NOT NULL DEFAULT 'LOCKED',
    "startedAt" TIMESTAMP(3),
    "sectionEndAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AttemptSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttemptQuestion" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "attemptSectionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 1,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "testQuestionId" TEXT,

    CONSTRAINT "AttemptQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttemptAnswer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "attemptQuestionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isCorrect" BOOLEAN,
    "pointsAwarded" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttemptAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "tokenRequired" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'DL_1',
    "coverMediaId" TEXT,
    "subjectId" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSetting" (
    "id" TEXT NOT NULL,
    "availableFrom" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "availableTo" TIMESTAMP(3),
    "duration" INTEGER,
    "maxAttempts" INTEGER DEFAULT -1,
    "shuffleQuestions" BOOLEAN DEFAULT false,
    "showResultImmediately" BOOLEAN DEFAULT true,
    "requirePassword" TEXT,
    "ipRestriction" TEXT,
    "strictMode" BOOLEAN DEFAULT false,
    "forwardOnly" BOOLEAN DEFAULT false,
    "passingPercentage" INTEGER DEFAULT 50,
    "resultView" "ResultViewType" DEFAULT 'Immediate',
    "testId" TEXT NOT NULL,

    CONSTRAINT "TestSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSection" (
    "id" TEXT NOT NULL,
    "type" "SectionType" NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "description" TEXT,
    "timeLimit" INTEGER DEFAULT -1,
    "questionSelectionMode" "SelectionMode" NOT NULL DEFAULT 'ALL_REQUIRED',
    "questionToSelect" INTEGER DEFAULT -1,
    "testId" TEXT NOT NULL,
    "passageId" TEXT,

    CONSTRAINT "TestSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestQuestion" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "TestQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "bio" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStats" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "testsTaken" INTEGER NOT NULL DEFAULT 0,
    "testsCompleted" INTEGER NOT NULL DEFAULT 0,
    "testsPassed" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenTransaction" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "reason" "TokenTransactionReason" NOT NULL,
    "testId" TEXT,
    "attemptId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTestProgress" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "testId" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL,
    "score" DOUBLE PRECISION,
    "maxScore" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "lastAttemptId" TEXT,
    "lastActivityAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTestProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MediaToQuestion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MediaToQuestion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MediaToPassage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MediaToPassage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "SystemLog_level_idx" ON "SystemLog"("level");

-- CreateIndex
CREATE INDEX "SystemLog_userId_idx" ON "SystemLog"("userId");

-- CreateIndex
CREATE INDEX "SystemLog_trace_id_idx" ON "SystemLog"("trace_id");

-- CreateIndex
CREATE INDEX "SystemLog_createdAt_idx" ON "SystemLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- CreateIndex
CREATE INDEX "Question_subjectId_type_idx" ON "Question"("subjectId", "type");

-- CreateIndex
CREATE INDEX "Question_createdById_idx" ON "Question"("createdById");

-- CreateIndex
CREATE INDEX "TestAttempt_userId_testId_status_idx" ON "TestAttempt"("userId", "testId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TestAttempt_userId_testId_attemptNumber_key" ON "TestAttempt"("userId", "testId", "attemptNumber");

-- CreateIndex
CREATE INDEX "AttemptSection_attemptId_order_idx" ON "AttemptSection"("attemptId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "AttemptSection_attemptId_sectionId_key" ON "AttemptSection"("attemptId", "sectionId");

-- CreateIndex
CREATE INDEX "AttemptQuestion_attemptId_attemptSectionId_displayOrder_idx" ON "AttemptQuestion"("attemptId", "attemptSectionId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "AttemptQuestion_attemptId_questionId_key" ON "AttemptQuestion"("attemptId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "AttemptAnswer_attemptId_attemptQuestionId_key" ON "AttemptAnswer"("attemptId", "attemptQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "TestSetting_testId_key" ON "TestSetting"("testId");

-- CreateIndex
CREATE INDEX "TestQuestion_sectionId_idx" ON "TestQuestion"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "TestQuestion_sectionId_questionId_key" ON "TestQuestion"("sectionId", "questionId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_key" ON "UserStats"("userId");

-- CreateIndex
CREATE INDEX "TokenTransaction_userId_createdAt_idx" ON "TokenTransaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UserTestProgress_userId_status_idx" ON "UserTestProgress"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "UserTestProgress_userId_testId_key" ON "UserTestProgress"("userId", "testId");

-- CreateIndex
CREATE INDEX "_MediaToQuestion_B_index" ON "_MediaToQuestion"("B");

-- CreateIndex
CREATE INDEX "_MediaToPassage_B_index" ON "_MediaToPassage"("B");

-- AddForeignKey
ALTER TABLE "SystemLog" ADD CONSTRAINT "SystemLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_passageId_fkey" FOREIGN KEY ("passageId") REFERENCES "Passage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passage" ADD CONSTRAINT "Passage_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passage" ADD CONSTRAINT "Passage_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_currentSectionId_fkey" FOREIGN KEY ("currentSectionId") REFERENCES "AttemptSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptSection" ADD CONSTRAINT "AttemptSection_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "TestSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptSection" ADD CONSTRAINT "AttemptSection_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "TestAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptQuestion" ADD CONSTRAINT "AttemptQuestion_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "TestAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptQuestion" ADD CONSTRAINT "AttemptQuestion_attemptSectionId_fkey" FOREIGN KEY ("attemptSectionId") REFERENCES "AttemptSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptQuestion" ADD CONSTRAINT "AttemptQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptQuestion" ADD CONSTRAINT "AttemptQuestion_testQuestionId_fkey" FOREIGN KEY ("testQuestionId") REFERENCES "TestQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptAnswer" ADD CONSTRAINT "AttemptAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "TestAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptAnswer" ADD CONSTRAINT "AttemptAnswer_attemptQuestionId_fkey" FOREIGN KEY ("attemptQuestionId") REFERENCES "AttemptQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptAnswer" ADD CONSTRAINT "AttemptAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSetting" ADD CONSTRAINT "TestSetting_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSection" ADD CONSTRAINT "TestSection_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSection" ADD CONSTRAINT "TestSection_passageId_fkey" FOREIGN KEY ("passageId") REFERENCES "Passage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestion" ADD CONSTRAINT "TestQuestion_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "TestSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestion" ADD CONSTRAINT "TestQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenTransaction" ADD CONSTRAINT "TokenTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTestProgress" ADD CONSTRAINT "UserTestProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTestProgress" ADD CONSTRAINT "UserTestProgress_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToQuestion" ADD CONSTRAINT "_MediaToQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToQuestion" ADD CONSTRAINT "_MediaToQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToPassage" ADD CONSTRAINT "_MediaToPassage_A_fkey" FOREIGN KEY ("A") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToPassage" ADD CONSTRAINT "_MediaToPassage_B_fkey" FOREIGN KEY ("B") REFERENCES "Passage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

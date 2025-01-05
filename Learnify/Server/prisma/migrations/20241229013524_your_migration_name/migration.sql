-- CreateTable
CREATE TABLE "answer" (
    "answerId" SERIAL NOT NULL,
    "chosenAnswer" VARCHAR(255) NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionid" INTEGER NOT NULL,

    CONSTRAINT "answer_pkey" PRIMARY KEY ("answerId")
);

-- CreateTable
CREATE TABLE "calenderevent" (
    "eventId" SERIAL NOT NULL,
    "eventTitle" VARCHAR(255) NOT NULL,
    "eventStart" TIMESTAMP(0) NOT NULL,
    "eventEnd" TIMESTAMP(0) NOT NULL,
    "eventDescription" VARCHAR(255) NOT NULL,
    "allDay" INTEGER NOT NULL DEFAULT 0,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "calenderevent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "course" (
    "courseId" SERIAL NOT NULL,
    "courseName" VARCHAR(255) NOT NULL,
    "courseDescription" VARCHAR(500),
    "courseTag" VARCHAR(100),
    "userid" INTEGER NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("courseId")
);

-- CreateTable
CREATE TABLE "exploreflashcard" (
    "ExploreFlashcardId" SERIAL NOT NULL,
    "ExploreFlashcardQ" VARCHAR(255),
    "exploreflashcardA" VARCHAR(255),
    "topicid" INTEGER,

    CONSTRAINT "exploreflashcard_pkey" PRIMARY KEY ("ExploreFlashcardId")
);

-- CreateTable
CREATE TABLE "file" (
    "fileId" SERIAL NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "fileDeadline" DATE,
    "fileURL" VARCHAR(500),
    "courseid" INTEGER NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "flashcard" (
    "flashcardId" SERIAL NOT NULL,
    "flashcardName" VARCHAR(255) NOT NULL,
    "flashcardQ" VARCHAR(255),
    "flashcardA" VARCHAR(255),
    "flashcardDeadline" DATE,
    "fileid" INTEGER NOT NULL,

    CONSTRAINT "flashcard_pkey" PRIMARY KEY ("flashcardId")
);

-- CreateTable
CREATE TABLE "habit" (
    "habitId" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "habitName" VARCHAR(255) NOT NULL,
    "habitDescription" VARCHAR(255),
    "reminderTime" DATE,
    "createdat" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habit_pkey" PRIMARY KEY ("habitId")
);

-- CreateTable
CREATE TABLE "keyterm" (
    "keytermId" SERIAL NOT NULL,
    "keytermText" VARCHAR(255),
    "keytermDef" VARCHAR(500),
    "fileid" INTEGER NOT NULL,

    CONSTRAINT "keyterm_pkey" PRIMARY KEY ("keytermId")
);

-- CreateTable
CREATE TABLE "question" (
    "questionId" SERIAL NOT NULL,
    "questionText" VARCHAR(500) NOT NULL,
    "correctAnswer" VARCHAR(255) NOT NULL,
    "choices" TEXT NOT NULL,
    "quizid" INTEGER NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "quiz" (
    "quizId" SERIAL NOT NULL,
    "numOfQuestions" INTEGER,
    "quizTitle" VARCHAR(255) NOT NULL,
    "quizDescription" VARCHAR(500),
    "fileid" INTEGER NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("quizId")
);

-- CreateTable
CREATE TABLE "streak" (
    "streakId" SERIAL NOT NULL,
    "habitid" INTEGER NOT NULL,
    "currentstreak" INTEGER DEFAULT 0,
    "longeststreak" INTEGER DEFAULT 0,
    "lastupdateddate" DATE NOT NULL,

    CONSTRAINT "streak_pkey" PRIMARY KEY ("streakId")
);

-- CreateTable
CREATE TABLE "topic" (
    "topicId" SERIAL NOT NULL,
    "topicname" VARCHAR(255) NOT NULL,

    CONSTRAINT "topic_pkey" PRIMARY KEY ("topicId")
);

-- CreateTable
CREATE TABLE "trackhabit" (
    "trackid" SERIAL NOT NULL,
    "habitid" INTEGER NOT NULL,
    "trackdate" DATE NOT NULL,
    "iscompleted" SMALLINT DEFAULT 0,

    CONSTRAINT "trackhabit_pkey" PRIMARY KEY ("trackid")
);

-- CreateTable
CREATE TABLE "user_" (
    "userId" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "major" VARCHAR(255),
    "flag" INTEGER,
    "subscription" INTEGER,
    "passwordResetExpires" DATE,
    "passwordResetToken" VARCHAR(255),
    "photo" VARCHAR(255),
    "active" SMALLINT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
    "googleId" VARCHAR(191),
    "isGoogleAccount" SMALLINT NOT NULL DEFAULT 0,
    "profilePicture" VARCHAR(191),
    "updatedAt" TIMESTAMP(3),
    "token" VARCHAR(255),
    "streak" INTEGER DEFAULT 0,

    CONSTRAINT "user__pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "questionId" ON "answer"("questionid");

-- CreateIndex
CREATE INDEX "fk_user" ON "calenderevent"("userid");

-- CreateIndex
CREATE INDEX "userId" ON "course"("userid");

-- CreateIndex
CREATE INDEX "topicid" ON "exploreflashcard"("topicid");

-- CreateIndex
CREATE INDEX "courseId" ON "file"("courseid");

-- CreateIndex
CREATE INDEX "fileId" ON "flashcard"("fileid");

-- CreateIndex
CREATE INDEX "fk_habit_user_" ON "habit"("userid");

-- CreateIndex
CREATE INDEX "quizid" ON "question"("quizid");

-- CreateIndex
CREATE UNIQUE INDEX "habitid" ON "streak"("habitid");

-- CreateIndex
CREATE UNIQUE INDEX "unique_habit_per_day" ON "trackhabit"("habitid", "trackdate");

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "user_"("email");

-- AddForeignKey
ALTER TABLE "answer" ADD CONSTRAINT "fk_answer_question" FOREIGN KEY ("questionid") REFERENCES "question"("questionId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "calenderevent" ADD CONSTRAINT "fk_calenderevent_user" FOREIGN KEY ("userid") REFERENCES "user_"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "fk_course_user" FOREIGN KEY ("userid") REFERENCES "user_"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exploreflashcard" ADD CONSTRAINT "fk_exploreflashcard_topic" FOREIGN KEY ("topicid") REFERENCES "topic"("topicId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "fk_file_course" FOREIGN KEY ("courseid") REFERENCES "course"("courseId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "flashcard" ADD CONSTRAINT "fk_flashcard_file" FOREIGN KEY ("fileid") REFERENCES "file"("fileId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "habit" ADD CONSTRAINT "fk_habit_user" FOREIGN KEY ("userid") REFERENCES "user_"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "keyterm" ADD CONSTRAINT "fk_keyterm_file" FOREIGN KEY ("fileid") REFERENCES "file"("fileId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "fk_question_quiz" FOREIGN KEY ("quizid") REFERENCES "quiz"("quizId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "fk_quiz_file" FOREIGN KEY ("fileid") REFERENCES "file"("fileId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "fk_quiz_user" FOREIGN KEY ("userid") REFERENCES "user_"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "streak" ADD CONSTRAINT "streak_habit" FOREIGN KEY ("habitid") REFERENCES "habit"("habitId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trackhabit" ADD CONSTRAINT "trackhabit_habit" FOREIGN KEY ("habitid") REFERENCES "habit"("habitId") ON DELETE CASCADE ON UPDATE CASCADE;

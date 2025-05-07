/*
  Warnings:

  - You are about to drop the column `groupId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the `announcements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `communities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `community_memberships` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `votes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chatId` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('NotStarted', 'InProgress', 'Paused', 'Completed');

-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('Streak', 'Consistency', 'Achievement', 'Milestone');

-- CreateEnum
CREATE TYPE "HabitType" AS ENUM ('GoodHabit', 'BadHabit');

-- CreateEnum
CREATE TYPE "HabitStatus" AS ENUM ('NotStarted', 'InProgress', 'Paused', 'Completed');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('Audio', 'Video', 'Image');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry');

-- CreateEnum
CREATE TYPE "Privacy" AS ENUM ('Public', 'Private', 'Restricted');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE', 'LINK', 'CALL');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENDING', 'DELIVERED', 'SENT', 'SEEN', 'FAILED', 'EDITED');

-- CreateEnum
CREATE TYPE "MessageCategory" AS ENUM ('NORMAL', 'SPAM');

-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('Image', 'Video', 'Audio', 'Document');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('ONGOING', 'COMPLETED', 'MISSED', 'DECLINED', 'FAILED');

-- CreateEnum
CREATE TYPE "CallType" AS ENUM ('VOICE', 'VIDEO', 'GROUP_VOICE', 'GROUP_VIDEO');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('Mention', 'Like', 'Comment', 'Follow', 'HabitReminder');

-- DropForeignKey
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_communityId_fkey";

-- DropForeignKey
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parentId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "communities" DROP CONSTRAINT "communities_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "community_memberships" DROP CONSTRAINT "community_memberships_communityId_fkey";

-- DropForeignKey
ALTER TABLE "community_memberships" DROP CONSTRAINT "community_memberships_userId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_groupId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_roomId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_communityId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_postId_fkey";

-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_userId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "groupId",
DROP COLUMN "roomId",
DROP COLUMN "sentAt",
ADD COLUMN     "category" "MessageCategory",
ADD COLUMN     "chatId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedForEveryone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'SENT',
ADD COLUMN     "type" "MessageType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "message",
DROP COLUMN "read",
DROP COLUMN "userId",
ADD COLUMN     "comment_id" TEXT,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "habit_id" TEXT,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "post_id" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "profileVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "website" TEXT;

-- DropTable
DROP TABLE "announcements";

-- DropTable
DROP TABLE "comments";

-- DropTable
DROP TABLE "communities";

-- DropTable
DROP TABLE "community_memberships";

-- DropTable
DROP TABLE "posts";

-- DropTable
DROP TABLE "votes";

-- CreateTable
CREATE TABLE "user_followers" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_followers_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateTable
CREATE TABLE "habits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalId" TEXT,
    "name" TEXT NOT NULL,
    "type" "HabitType" NOT NULL,
    "description" TEXT,
    "weeklyTarget" INTEGER NOT NULL DEFAULT 0,
    "status" "HabitStatus" NOT NULL DEFAULT 'NotStarted',
    "streak" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3),
    "status" "GoalStatus" NOT NULL DEFAULT 'InProgress',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "type" "BadgeType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habit_completions" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,

    CONSTRAINT "habit_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mediaType" "MediaType",
    "privacy" "Privacy" NOT NULL DEFAULT 'Public',
    "authorId" TEXT NOT NULL,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "isEdited" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_media" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT,
    "fileSize" DOUBLE PRECISION,
    "width" INTEGER,
    "height" INTEGER,
    "duration" DOUBLE PRECISION,
    "postId" TEXT NOT NULL,

    CONSTRAINT "post_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_reactions" (
    "id" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT,
    "commentId" TEXT,
    "messageId" TEXT,

    CONSTRAINT "post_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" TEXT,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_chats" (
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_chats_pkey" PRIMARY KEY ("userId","chatId")
);

-- CreateTable
CREATE TABLE "read_receipts" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "read_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "AttachmentType" NOT NULL,
    "fileName" TEXT,
    "fileSize" DOUBLE PRECISION,
    "width" INTEGER,
    "height" INTEGER,
    "duration" DOUBLE PRECISION,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_deletes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_deletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "type" "CallType" NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" "CallStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_participants" (
    "callId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "call_participants_pkey" PRIMARY KEY ("callId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_reactions_userId_postId_key" ON "post_reactions"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "post_reactions_userId_commentId_key" ON "post_reactions"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "post_reactions_userId_messageId_key" ON "post_reactions"("userId", "messageId");

-- CreateIndex
CREATE UNIQUE INDEX "read_receipts_userId_messageId_key" ON "read_receipts"("userId", "messageId");

-- CreateIndex
CREATE UNIQUE INDEX "message_deletes_userId_messageId_key" ON "message_deletes"("userId", "messageId");

-- AddForeignKey
ALTER TABLE "user_followers" ADD CONSTRAINT "user_followers_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_followers" ADD CONSTRAINT "user_followers_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habits" ADD CONSTRAINT "habits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id_users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habits" ADD CONSTRAINT "habits_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id_users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badges" ADD CONSTRAINT "badges_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_completions" ADD CONSTRAINT "habit_completions_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "post_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "post_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_chats" ADD CONSTRAINT "user_chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_chats" ADD CONSTRAINT "user_chats_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "read_receipts" ADD CONSTRAINT "read_receipts_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "read_receipts" ADD CONSTRAINT "read_receipts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_deletes" ADD CONSTRAINT "message_deletes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_deletes" ADD CONSTRAINT "message_deletes_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_participants" ADD CONSTRAINT "call_participants_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_participants" ADD CONSTRAINT "call_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "post_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

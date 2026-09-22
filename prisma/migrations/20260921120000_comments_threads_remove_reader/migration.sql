-- Comment threads, immediately published comments, and removal of reader accounts.
--
-- DESTRUCTIVE: DROP TABLE "Reader" permanently removes any stored reader
-- accounts. This is intentional — the only account on this site is the admin.
-- Verified against the live database on a pre-launch site with no reader rows.

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_readerId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "readerId",
ADD COLUMN     "parentId" TEXT,
ALTER COLUMN "approved" SET DEFAULT true;

-- DropTable
DROP TABLE "Reader";

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

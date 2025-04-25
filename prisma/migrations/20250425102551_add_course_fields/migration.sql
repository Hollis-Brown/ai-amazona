/*
  Warnings:

  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseDates` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseLength` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseTime` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_productId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "courseDates" TEXT NOT NULL,
ADD COLUMN     "courseLength" TEXT NOT NULL,
ADD COLUMN     "courseTime" TEXT NOT NULL;

-- DropTable
DROP TABLE "Review";

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateTable
CREATE TABLE "ProfileRelationship" (
    "id" TEXT NOT NULL,
    "isPending" BOOLEAN NOT NULL DEFAULT true,
    "profileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileRelationship_userId_profileId_key" ON "ProfileRelationship"("userId", "profileId");

-- AddForeignKey
ALTER TABLE "ProfileRelationship" ADD CONSTRAINT "ProfileRelationship_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileRelationship" ADD CONSTRAINT "ProfileRelationship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

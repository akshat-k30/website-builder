-- CreateTable
CREATE TABLE "LinkedInProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "linkedinUrl" TEXT,
    "rawText" TEXT NOT NULL DEFAULT '',
    "parsedName" TEXT NOT NULL DEFAULT '',
    "parsedHeadline" TEXT NOT NULL DEFAULT '',
    "parsedLocation" TEXT NOT NULL DEFAULT '',
    "parsedSummary" TEXT NOT NULL DEFAULT '',
    "parsedExperience" TEXT NOT NULL DEFAULT '[]',
    "parsedEducation" TEXT NOT NULL DEFAULT '[]',
    "parsedSkills" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LinkedInProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkedInProfile_userId_key" ON "LinkedInProfile"("userId");

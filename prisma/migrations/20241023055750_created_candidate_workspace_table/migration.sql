-- CreateTable
CREATE TABLE "candidateWorkspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidateWorkspace_pkey" PRIMARY KEY ("id")
);

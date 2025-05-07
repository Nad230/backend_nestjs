-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "street" TEXT,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaceDetail" (
    "id" SERIAL NOT NULL,
    "placeId" INTEGER NOT NULL,
    "operator" TEXT,
    "brand" TEXT,
    "stars" INTEGER,
    "phone" TEXT,
    "email" TEXT,

    CONSTRAINT "PlaceDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryPlace" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryPlace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaceDetail_placeId_key" ON "PlaceDetail"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryPlace_name_key" ON "CategoryPlace"("name");

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryPlace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceDetail" ADD CONSTRAINT "PlaceDetail_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

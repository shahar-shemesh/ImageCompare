

// this script compares two folders of images and copies the images that are different to the output folder


const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");

const newDir = process.argv[2];
const oldDir = process.argv[3];
const outputDir = process.argv[4];

if (!newDir || !oldDir || !outputDir) {
    console.log("Usage: node ImageCompare.js <newFolder> <oldFolder> <outputFolder>");
    process.exit(1);
}

async function ensureDir(dir) {
    await fs.promises.mkdir(dir, { recursive: true });
}

async function pixelHash(file) {
    const { data } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
    const hash = crypto.createHash("sha256");
    hash.update(data);
    return hash.digest("hex");
}

async function run() {

    await ensureDir(outputDir);

    const newFiles = await fs.promises.readdir(newDir);
    const oldFiles = await fs.promises.readdir(oldDir);

    const oldSet = new Set(oldFiles);

    for (const file of newFiles) {

        const newPath = path.join(newDir, file);
        const oldPath = path.join(oldDir, file);
        const outPath = path.join(outputDir, file);

        const newStat = await fs.promises.stat(newPath);
        if (!newStat.isFile()) continue;

        // if file is not in the old folder, copy it to the output directory
        if (!oldSet.has(file)) {
            await fs.promises.copyFile(newPath, outPath);
            console.log("Copied new:", file);
            continue;
        }

        const oldStat = await fs.promises.stat(oldPath);

        // if the size is different, copy the file to the output directory
        if (newStat.size !== oldStat.size) {
            await fs.promises.copyFile(newPath, outPath);
            console.log("Copied size changed:", file);
            continue;
        }

        // checking pixels - if the pixels are different, copy the file to the output directory
        const [newHash, oldHash] = await Promise.all([
            pixelHash(newPath),
            pixelHash(oldPath)
        ]);

        if (newHash !== oldHash) {
            await fs.promises.copyFile(newPath, outPath);
            console.log("Copied pixel changed:", file);
        }
    }

    console.log("Finished");
}

run();
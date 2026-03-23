# ImageCompare

Description:
A Node.js script for automated image regression and differencing.  
`ImageCompare.js` helps you keep track of changes between two folders of images:  
it detects new, changed, or "recently updated" files by comparing file names, sizes, pixel hashes, and file creation dates.

Unlike a normal folder sync, it only copies **images that are new or changed** (byte- or pixel-wise),  
plus any unchanged images where the original was added or refreshed after April 22, 2025.  
This helps ensure you only get images that matter—useful for CI checks, asset audits, or keeping history clean.

Error handling is built-in for pixel hash failures, and a log file is written for that edge case.
See below for requirements, usage, and details.



Compares two folders of images and copies **only** files from the “new” folder that differ from the “old” folder (or meet the “recent file” rule below) into an output folder.

## Requirements

- [Node.js](https://nodejs.org/)
- Dependencies: `sharp` (see `package.json`)

```bash
npm install
```

## Usage

```bash
node ImageCompare.js <newFolder> <oldFolder> <outputFolder>
```

| Argument | Meaning |
|----------|---------|
| `<newFolder>` | Source of truth; files are read from here |
| `<oldFolder>` | Baseline to compare against |
| `<outputFolder>` | Where differing (or selected) images are copied |

Example:

```bash
node ImageCompare.js ./new-assets ./old-assets ./result
```

## What gets copied

Only **image files** are considered: `.jpg`, `.jpeg`, `.png`, `.webp`, `.bmp`, `.tiff`, `.gif` (case-insensitive). Other files are skipped.

Copies from `<newFolder>` to `<outputFolder>` when:

1. **New file** — filename exists in the new folder but not in the old folder  
2. **Size changed** — same name in both folders, but byte size differs  
3. **Pixels changed** — same name and size; raw pixel data is hashed (SHA-256). If hashes differ, the file is copied  

If pixels **match**, the file is **not** copied by default—**unless** the old file’s creation time (`birthtime`) is on or after **April 22, 2025** (see `fromDate` in `ImageCompare.js`). In that case it is still copied and logged as `Copied recent file:`.

## Logging

- Console: short messages (`Copied new:`, `Copied size changed:`, `Copied pixel changed:`, `Copied recent file:`).  
- On pixel-hash failure (e.g. unsupported decode), a line is appended to **`logs.txt`** in the **current working directory** (where you run the command). The script then falls back to hashing the **entire file** for comparison.

## Output folder

The `result/` directory is documented in [`result/README.md`](result/README.md) as a typical output location.

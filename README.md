# Result folder

This folder is the **output** of the ImageCompare script.

When you run:

```bash
node ImageCompare.js <newFolder> <oldFolder> <outputFolder>
```

and pass this folder as `<outputFolder>`, it will contain copies of images from `<newFolder>` that are considered **different** from `<oldFolder>`:

- **New files** — images that exist in the new folder but not in the old folder
- **Size changed** — same filename in both folders, but file size differs
- **Pixel changed** — same filename and size, but pixel content differs (compared via SHA256 of raw pixel data)

Only images that are new or changed are copied here; unchanged images are skipped.

import { $ } from "zx";
import glob from "fast-glob";
import { unlinkSync } from "fs";
import { resolve } from "path";

const unwantedSnippets = new Set([
    "accordion.tsx",
    "action-bar.tsx",
    "color-mode.tsx",
    "color-picker.tsx",
    "dialog.tsx",
    "drawer.tsx",
    "file-upload.tsx",
    "hover-card.tsx",
    "menu.tsx",
    "pagination.tsx",
    "popover.tsx",
    "progress-circle.tsx",
    "progress.tsx",
    "provider.tsx",
    "segmented-control.tsx",
    "select.tsx",
    "skeleton.tsx",
    "stat.tsx",
    "steps.tsx",
    "timeline.tsx",
    "toaster.tsx",
]);

const targetDir = "./unedited";

// Download _all snippets_, overwrite existing ones.
await $`pnpm chakra snippet add --all --tsx --force --outdir ${targetDir}`

// Delete files we don't want
const newSnippets = await findSnippets();
for (const snippet of newSnippets) {
    if (unwantedSnippets.has(snippet)) {
        const file = resolve(targetDir, snippet);
        unlinkSync(file);
    }
}

// NOTE: Paths relative to target dir
async function findSnippets(): Promise<string[]> {
    const snippets = await glob("./**/*.tsx", {
        cwd: targetDir,
    });
    return snippets;
}
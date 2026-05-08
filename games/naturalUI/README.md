# Tearable Character Layers

Local learning clone of the tearable cloth interaction.

The app keeps the reference interaction model:

- drag to grab the cloth
- pull until the cloth tears
- torn layers drop away
- the next image layer appears
- the final layer is indestructible

Layer images live in `assets/layers/`.

Edit `assets/layers/manifest.json` to add, remove, replace, or reorder layers.
The app reads this file on page load, so no JavaScript edit or rebuild is needed
after changing the layer list.

## Layer Management

The manifest order is the peel order:

- the first entry is shown first
- each torn layer reveals the next entry
- the last entry is the final layer and does not tear away

Entries can be simple filenames in `assets/layers/`:

```json
{
  "layers": [
    "layer-001.jpg",
    "layer-002.jpg",
    "layer-003.jpg"
  ]
}
```

### Add An Image

1. Put the image file in `assets/layers/`.
2. Add the filename to `assets/layers/manifest.json`.
3. Reload the browser.

```json
{
  "layers": [
    "layer-001.jpg",
    "layer-002.jpg",
    "new-character.jpg",
    "layer-003.jpg"
  ]
}
```

### Replace An Image

Use either approach:

- overwrite the existing image file with the same filename
- add a new image file and change the matching manifest entry

Reload the browser after replacing. If the old image is still visible because of
browser cache, use a hard refresh or change the filename in the manifest.

### Remove An Image

1. Remove the filename from `assets/layers/manifest.json`.
2. Delete the image file from `assets/layers/` if it is no longer used.
3. Reload the browser.

Do not leave missing filenames in the manifest. A missing image can render as a
blank cloth layer.

### Change Layer Order

Move filenames up or down inside the manifest array.

```json
{
  "layers": [
    "layer-003.jpg",
    "layer-001.jpg",
    "layer-002.jpg"
  ]
}
```

In this example, `layer-003.jpg` appears first. `layer-002.jpg` is the final
indestructible layer because it is last.

### Use Remote Images

Manifest entries can also be full image URLs:

```json
{
  "layers": [
    "https://example.com/character-001.jpg",
    "layer-002.jpg"
  ]
}
```

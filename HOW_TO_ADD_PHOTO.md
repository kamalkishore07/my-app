# How to Add Your Photo to the Diary Cover

Follow these simple steps to add your personal photo to the diary cover landing page.

## Option 1: Using a Local Image File (Recommended)

### Step 1: Add Your Photo to the Project

1. Create a folder for your images (if it doesn't exist):
   ```
   calendar-finance-app/public/images/
   ```

2. Copy your photo to this folder. For example:
   ```
   public/images/kamal-photo.jpg
   ```

### Step 2: Update the Component

Open `src/components/DiaryCoverLogin.tsx` and find this section (around line 100):

**Replace this:**
```tsx
<div className="w-64 h-64 bg-gradient-to-br from-amber-200 to-amber-100 rounded-xl flex items-center justify-center overflow-hidden border-4 border-amber-300/50">
    {/* Placeholder - User should replace this */}
    <div className="text-center p-6">
        <User className="w-24 h-24 text-amber-700/40 mx-auto mb-4" strokeWidth={1.5} />
        <p className="text-amber-800/60 font-handwritten-alt text-sm">
            Your Photo Here
        </p>
        <p className="text-amber-700/40 text-xs mt-2 font-handwritten-alt">
            (Replace in code)
        </p>
    </div>
</div>
```

**With this:**
```tsx
<div className="w-64 h-64 bg-gradient-to-br from-amber-200 to-amber-100 rounded-xl flex items-center justify-center overflow-hidden border-4 border-amber-300/50">
    <img 
        src="/images/kamal-photo.jpg" 
        alt="Kamal" 
        className="w-full h-full object-cover"
    />
</div>
```

### Step 3: Adjust Image Fit (Optional)

If your photo doesn't look right, you can adjust the `object-fit` property:

- `object-cover` - Fills the frame, may crop edges (recommended)
- `object-contain` - Shows full image, may have empty space
- `object-fill` - Stretches to fill (may distort)

Example:
```tsx
<img 
    src="/images/kamal-photo.jpg" 
    alt="Kamal" 
    className="w-full h-full object-cover object-center"
/>
```

---

## Option 2: Using an External URL

If your photo is hosted online (e.g., Google Drive, Imgur, etc.):

```tsx
<div className="w-64 h-64 bg-gradient-to-br from-amber-200 to-amber-100 rounded-xl flex items-center justify-center overflow-hidden border-4 border-amber-300/50">
    <img 
        src="https://your-image-url.com/photo.jpg" 
        alt="Kamal" 
        className="w-full h-full object-cover"
    />
</div>
```

---

## Option 3: Using Next.js Image Component (Best Performance)

For optimized images with automatic resizing:

### Step 1: Import Image Component

At the top of `DiaryCoverLogin.tsx`, add:
```tsx
import Image from 'next/image'
```

### Step 2: Replace the Photo Section

```tsx
<div className="w-64 h-64 bg-gradient-to-br from-amber-200 to-amber-100 rounded-xl flex items-center justify-center overflow-hidden border-4 border-amber-300/50 relative">
    <Image 
        src="/images/kamal-photo.jpg" 
        alt="Kamal" 
        fill
        className="object-cover"
        priority
    />
</div>
```

---

## Recommended Photo Specifications

For best results:
- **Format**: JPG or PNG
- **Size**: 500x500 pixels or larger (square is best)
- **File Size**: Under 500KB for fast loading
- **Aspect Ratio**: 1:1 (square) works best

---

## Quick Test

After adding your photo:

1. Save the file
2. The dev server should auto-reload
3. Visit http://localhost:3000
4. You should see your photo on the diary cover!

---

## Troubleshooting

### Photo Not Showing?

1. **Check the file path**: Make sure the path is correct
   - Local: `/images/your-photo.jpg` (starts with `/`)
   - Public folder: Files in `public/` are served from root `/`

2. **Check file name**: 
   - File names are case-sensitive
   - Avoid spaces in file names

3. **Clear browser cache**:
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### Photo Looks Stretched or Cropped?

Try different `object-fit` values:
```tsx
className="w-full h-full object-contain"  // Shows full image
className="w-full h-full object-cover"    // Fills frame, may crop
```

### Photo Too Dark/Light?

Add filters:
```tsx
className="w-full h-full object-cover brightness-110 contrast-105"
```

---

## Example: Complete Photo Section

Here's a complete example with your photo:

```tsx
{/* Photo Frame */}
<div className="relative group">
    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500" />
    <div className="relative bg-gradient-to-br from-amber-100 to-amber-50 p-3 rounded-2xl shadow-xl">
        <div className="w-64 h-64 bg-gradient-to-br from-amber-200 to-amber-100 rounded-xl flex items-center justify-center overflow-hidden border-4 border-amber-300/50">
            <img 
                src="/images/kamal-photo.jpg" 
                alt="Kamal" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
        </div>
    </div>
</div>
```

This adds a nice hover zoom effect!

---

**That's it! Your personal photo will now appear on the diary cover. 📸✨**

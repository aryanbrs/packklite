# PowerShell Script to Fix Product Images
# Run this from the packlite-next directory

$imagesPath = "public/images"

Write-Host "🔧 Starting Image Fix Process..." -ForegroundColor Cyan
Write-Host ""

# Create images directory if it doesn't exist
if (-not (Test-Path $imagesPath)) {
    New-Item -ItemType Directory -Path $imagesPath | Out-Null
}

# STEP 1: Rename incorrectly named files
Write-Host "📝 STEP 1: Renaming incorrectly named files..." -ForegroundColor Yellow

$renames = @(
    @{From="publicimagesbubble_wrap_roll.jpg"; To="bubble_wrap_roll.jpg"},
    @{From="publicImagescustom_printed_box.jpg"; To="custom_printed_box.jpg"}
)

foreach ($rename in $renames) {
    $fromPath = Join-Path $imagesPath $rename.From
    $toPath = Join-Path $imagesPath $rename.To
    
    if (Test-Path $fromPath) {
        Move-Item -Path $fromPath -Destination $toPath -Force
        Write-Host "  ✅ Renamed: $($rename.From) → $($rename.To)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Not found: $($rename.From)" -ForegroundColor DarkYellow
    }
}

Write-Host ""

# STEP 2: Create copies for missing images
Write-Host "📋 STEP 2: Creating copies for missing images..." -ForegroundColor Yellow

$copies = @(
    # Corrugated Boxes
    @{Source="universal_box_brown_default.jpg"; Target="corrugated-box-3ply.jpg"},
    @{Source="mailer_box_brown_5ply.jpg"; Target="corrugated-box-5ply.jpg"},
    @{Source="mailer_box_brown_5ply.jpg"; Target="brown-mailer-3ply.jpg"},
    @{Source="mailer_box_brown_5ply.jpg"; Target="brown-mailer-5ply.jpg"},
    @{Source="universal_box_brown_default.jpg"; Target="pizza-box.jpg"},
    
    # Protective Packaging
    @{Source="bubble_wrap_roll.jpg"; Target="bubble-wrap.jpg"},
    @{Source="epe_foam_sheet.jpg"; Target="epe-foam-sheet.jpg"},
    @{Source="epe_foam_sheet.jpg"; Target="epe-foam-jar.jpg"},
    
    # Tapes
    @{Source="clear_bopp_tape.jpg"; Target="bopp-tape.jpg"},
    @{Source="brown_packing_tape.jpg"; Target="specialty-tape.jpg"},
    @{Source="brown_packing_tape.jpg"; Target="custom-tape.jpg"},
    
    # Foam Products
    @{Source="thermocol_sheet_white.jpg"; Target="thermocol-sheet.jpg"},
    @{Source="thermocol_sheet_white.jpg"; Target="thermocol-jar.jpg"},
    
    # Stretch Film
    @{Source="stretch_film_roll.jpg"; Target="stretch-film.jpg"}
)

$successCount = 0
$skipCount = 0
$errorCount = 0

foreach ($copy in $copies) {
    $sourcePath = Join-Path $imagesPath $copy.Source
    $targetPath = Join-Path $imagesPath $copy.Target
    
    if (Test-Path $targetPath) {
        Write-Host "  ⏭️  Skipped (already exists): $($copy.Target)" -ForegroundColor DarkGray
        $skipCount++
    } elseif (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $targetPath
        Write-Host "  ✅ Copied: $($copy.Source) → $($copy.Target)" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "  ❌ Error: Source not found - $($copy.Source)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Files copied: $successCount" -ForegroundColor Green
Write-Host "  ⏭️  Files skipped: $skipCount" -ForegroundColor DarkGray
Write-Host "  ❌ Errors: $errorCount" -ForegroundColor Red
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($errorCount -eq 0) {
    Write-Host "🎉 All images fixed successfully!" -ForegroundColor Green
    Write-Host "👉 Restart your dev server: npm run dev" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  Some errors occurred. Check the messages above." -ForegroundColor Yellow
}

Write-Host ""

param(
    [string]$message = "update code"
)

$gitExe = "C:\Users\Hp\AppData\Local\Programs\MinGit\cmd\git.exe"

Write-Host "1. Checking status..." -ForegroundColor Cyan
& $gitExe status

Write-Host "`n2. Staging changes..." -ForegroundColor Cyan
& $gitExe add -A

Write-Host "`n3. Committing: '$message'..." -ForegroundColor Cyan
& $gitExe commit -m $message

Write-Host "`n4. Pushing to GitHub (origin main)..." -ForegroundColor Cyan
& $gitExe push origin main

Write-Host "`nDone!" -ForegroundColor Green

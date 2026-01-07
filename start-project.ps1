# ============================================
# Network Anomaly Detection - Auto Start
# ============================================

Write-Host "=" -ForegroundColor Cyan
Write-Host "🚀 Starting Network Anomaly Detection System" -ForegroundColor Green
Write-Host "=" -ForegroundColor Cyan

# Check if models exist
if (-not (Test-Path "backend\models\random_forest.pkl")) {
    Write-Host "⚠️  Models not found! Training first..." -ForegroundColor Yellow
    cd backend
    .\venv\Scripts\Activate.ps1
    python train_models.py
    cd ..
    Write-Host "✅ Training complete!" -ForegroundColor Green
}

# Start Backend
Write-Host "`n🔧 Starting Backend API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Network-Anomaly-Detection\backend; .\venv\Scripts\Activate.ps1; python app.py"

# Wait 5 seconds
Write-Host "⏳ Waiting 5 seconds for Backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "🎨 Starting Frontend Dashboard..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Network-Anomaly-Detection\frontend; npm start"

Write-Host "`n✅ System Started!" -ForegroundColor Green
Write-Host "📊 Dashboard will open at: http://localhost:3000" -ForegroundColor White
Write-Host "🔌 API running at: http://localhost:5000" -ForegroundColor White
Write-Host "`n⚠️  Keep both PowerShell windows open!" -ForegroundColor Yellow
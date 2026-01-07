Write-Host "=== برهان مصداقية النظام ===" -ForegroundColor Cyan
Write-Host "1. بيانات التدريب:" -ForegroundColor Yellow
python -c "import pandas as pd; df = pd.read_csv('data/KDDTrain.txt', header=None); print(f'   ? {len(df)} سجل حقيقي')"

Write-Host "2. النماذج المدربة:" -ForegroundColor Yellow
python -c "import os; print(f'   ? {len(os.listdir(\"models\"))} ملف نموذج')"

Write-Host "3. الدقة النهائية:" -ForegroundColor Yellow
python -c "import pickle; m = pickle.load(open('models/metrics.pkl', ''rb'')); print(f'   ? {m[\"ensemble\"][\"accuracy\"]*100:.2f}%')"

Write-Host "=== جاهز للعرض! ===" -ForegroundColor Green

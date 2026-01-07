# 🛡️ Network Anomaly Detection System

نظام كشف التهديدات الداخلية في الشبكات باستخدام الذكاء الاصطناعي

## 🎯 المواصفات

- **البيانات:** NSL-KDD Dataset (125,964 سجل)
- **النماذج:** Random Forest + XGBoost + Gradient Boosting
- **الدقة:** 99.92%
- **Dashboard:** React + Recharts

## 🚀 التشغيل السريع

### طريقة 1: سكريبت أوتوماتيكي
```powershell
.\start-project.ps1
```

### طريقة 2: يدوياً

**Backend:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python app.py
```

**Frontend (terminal جديد):**
```powershell
cd frontend
npm start
```

## 📊 النتائج

- Accuracy: 99.92%
- Precision: 99.92%
- Recall: 99.91%
- F1-Score: 99.91%
- AUC-ROC: 100%

## 👥 الفريق

مشروع تخرج - HIMIT
Abdelhalim • Sameh • Asmaa • Mohamed • Mahmoud

## 📁 الملفات المهمة

- `backend/app.py` - API Server
- `backend/train_models.py` - تدريب النماذج
- `frontend/src/App.js` - Dashboard
- `models/*.pkl` - النماذج المدربة
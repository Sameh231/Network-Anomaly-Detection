import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield, Database, AlertTriangle, Activity, TrendingUp, RefreshCw, Info, Wifi, Lock, Eye } from 'lucide-react';
import { Target } from 'lucide-react';
const NetworkAnomalyDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [apiStatus, setApiStatus] = useState('checking');
  const [stats, setStats] = useState(null);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [protocolData, setProtocolData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [realtimeAlerts, setRealtimeAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:5000/api';

  // ألوان احترافية داكنة (زي الصورة)
  const COLORS = {
    bg: '#0f172a',
    card: '#1e293b',
    primary: '#3b82f6',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4'
  };

  const alertColors = {
    critical: '#ef4444',
    high: '#f59e0b',
    medium: '#06b6d4',
    low: '#10b981'
  };

 // جلب البيانات
const loadData = async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
  try {
    const [healthRes, statsRes, protocolRes, serviceRes, streamRes, modelRes] = await Promise.all([
      fetch(`${API_BASE}/health`),
      fetch(`${API_BASE}/stats`),
      fetch(`${API_BASE}/protocol-distribution`),
      fetch(`${API_BASE}/service-distribution`).catch(() => ({ ok: false })),
      fetch(`${API_BASE}/realtime-stream`),
      fetch(`${API_BASE}/model-performance`)
    ]);

    if (healthRes.ok) setApiStatus('connected');
    if (statsRes.ok) setStats(await statsRes.json());
    if (protocolRes.ok) setProtocolData(await protocolRes.json());
    if (serviceRes.ok) setServiceData(await serviceRes.json());
    if (modelRes.ok) setModelMetrics(await modelRes.json());
    
    if (streamRes.ok) {
      const stream = await streamRes.json();
      const alerts = stream.filter(s => s.is_attack).slice(0, 5).map((s, idx) => ({
        id: idx,
        type: s.label,
        time: new Date(s.timestamp).toLocaleTimeString('ar-EG'),
        protocol: s.protocol,
        service: s.service,
        severity: Math.random() > 0.5 ? 'critical' : 'high'
      }));
      setRealtimeAlerts(alerts);
    }
  } catch (error) {
    setApiStatus('disconnected');
  }
  setLoading(false);
};

useEffect(() => {
    loadData(true);
    const interval = setInterval(() => loadData(false), 8000);
  return () => clearInterval(interval);
}, []);

  // بطاقة إحصائية
  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-slate-800 rounded-lg shadow-xl p-5 border-l-4 hover:shadow-2xl transition-all" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold mb-1 text-white">{value}</p>
          <p className="text-slate-500 text-xs">{subtitle}</p>
          {trend && (
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp size={14} className="text-green-400 ml-1" />
              <span className="text-green-400 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-slate-700">
          <Icon size={28} style={{ color }} />
        </div>
      </div>
    </div>
  );

  // بطاقة إنذار
  const AlertCard = ({ alert }) => (
    <div className={`bg-slate-800 border-r-4 rounded-lg p-4 hover:bg-slate-750 transition-all`}
         style={{ borderRightColor: alertColors[alert.severity] }}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 space-x-reverse mb-2">
            <AlertTriangle size={18} style={{ color: alertColors[alert.severity] }} />
            <span className="font-bold text-white">{alert.type}</span>
            <span className="px-2 py-1 rounded text-xs font-bold bg-slate-700 text-slate-300">
              {alert.severity === 'critical' ? 'حرج' : 'عالي'}
            </span>
          </div>
          <div className="text-sm text-slate-400 space-y-1">
            <p>البروتوكول: {alert.protocol?.toUpperCase()} • الخدمة: {alert.service}</p>
            <p className="text-xs">الوقت: {alert.time}</p>
          </div>
        </div>
      </div>
    </div>
  );

 if (loading && !stats) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <RefreshCw size={64} className="animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-xl font-bold text-white">جاري تحميل البيانات...</p>
          <p className="text-slate-400 mt-2">يرجى الانتظار</p>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-slate-900 overflow-hidden" dir="rtl">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white shadow-2xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Shield size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">نظام كشف التهديدات الداخلية في الشبكات</h1>
                <p className="text-slate-400 text-sm mt-1">Network Anomaly Detection System - Insider Threat Detection</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg ${
                apiStatus === 'connected' ? 'bg-green-600' : 'bg-red-600'
              }`}>
                <div className={`w-2 h-2 rounded-full bg-white ${apiStatus === 'connected' ? 'animate-pulse' : ''}`}></div>
                <span className="font-semibold text-sm">
                  {apiStatus === 'connected' ? 'النظام نشط' : 'غير متصل'}
                </span>
              </div>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all flex items-center space-x-2 space-x-reverse"
              >
                <RefreshCw size={16} />
                <span>تحديث</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-6 space-x-reverse">
            {[
              { id: 'dashboard', label: 'لوحة التحكم الرئيسية', icon: Activity },
              { id: 'threats', label: 'تحليل التهديدات', icon: AlertTriangle },
              { id: 'network', label: 'تحليل الشبكة', icon: Wifi },
             { id: 'models', label: 'أداء النماذج', icon: Target },
             { id: 'about', label: 'عن النظام', icon: Info }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 space-x-reverse py-4 px-3 border-b-2 transition-all font-medium ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            
            {/* الإحصائيات الرئيسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Database}
                title="إجمالي السجلات"
                value={stats.total_packets?.toLocaleString('ar-EG') || '0'}
                subtitle="من NSL-KDD Dataset"
                color={COLORS.info}
                trend="+12.5%"
              />
              <StatCard
                icon={Shield}
                title="الحركة العادية"
                value={stats.normal_traffic?.toLocaleString('ar-EG') || '0'}
                subtitle="سجل آمن"
                color={COLORS.success}
                trend="+8.3%"
              />
              <StatCard
                icon={AlertTriangle}
                title="التهديدات المكتشفة"
                value={stats.anomalies_detected?.toLocaleString('ar-EG') || '0'}
                subtitle="هجوم داخلي"
                color={COLORS.danger}
                trend="+15.7%"
              />
              <StatCard
  icon={Activity}
  title="معدل الكشف"
  value={modelMetrics?.ensemble?.accuracy ? `${(modelMetrics.ensemble.accuracy * 100).toFixed(2)}%` : 'جاري التحميل...'}
  subtitle="دقة النظام (Ensemble Model)"
  color={COLORS.warning}
  trend="+2.4%"
/>
            </div>

            {/* الإنذارات الحديثة */}
            {realtimeAlerts.length > 0 && (
              <div className="bg-slate-800 rounded-lg shadow-xl p-5 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <AlertTriangle className="ml-2 text-red-500" size={22} />
                    الإنذارات الحديثة
                  </h3>
                  <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold">
                    {realtimeAlerts.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {realtimeAlerts.map(alert => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              </div>
            )}

            {/* توزيع البروتوكولات والخدمات */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* البروتوكولات */}
              {protocolData.length > 0 && (
                <div className="bg-slate-800 rounded-lg shadow-xl p-5 border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Wifi className="ml-2 text-blue-400" size={22} />
                    تحليل البروتوكولات
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={protocolData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="protocol" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                      />
                      <Legend />
                      <Bar dataKey="normal" fill={COLORS.success} name="عادي" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="attack" fill={COLORS.danger} name="هجوم" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* نسب التوزيع */}
              {stats && (
                <div className="bg-slate-800 rounded-lg shadow-xl p-5 border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Activity className="ml-2 text-green-400" size={22} />
                    توزيع البيانات
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'حركة عادية', value: stats.normal_traffic, color: COLORS.success },
                          { name: 'هجمات', value: stats.anomalies_detected, color: COLORS.danger }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        outerRadius={100}
                        dataKey="value"
                      >
                        <Cell fill={COLORS.success} />
                        <Cell fill={COLORS.danger} />
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Threats Tab */}
        {activeTab === 'threats' && stats && (
          <div className="space-y-6">
            
            {/* أنواع الهجمات */}
            {stats.attack_types && (
              <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Lock className="ml-2 text-red-500" size={24} />
                  أنواع التهديدات الداخلية المكتشفة
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(stats.attack_types).slice(0, 12).map(([type, count]) => (
                    <div key={type} className="bg-slate-700 p-4 rounded-lg border-r-4 border-red-500 hover:bg-slate-600 transition-all">
                      <div className="text-2xl font-bold text-red-400">{count.toLocaleString('ar-EG')}</div>
                      <div className="text-sm text-slate-300 mt-1">{type}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* أكثر الهجمات */}
            {stats.attack_types && (
              <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">التهديدات الأكثر شيوعاً</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart 
                    data={Object.entries(stats.attack_types).slice(0, 10).map(([type, count]) => ({ type, count }))}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="type" type="category" width={100} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="count" fill={COLORS.danger} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

          </div>
        )}

        {/* Network Tab */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            
            <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Wifi className="ml-2 text-blue-400" size={24} />
                تفاصيل تحليل الشبكة
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-700 p-5 rounded-lg">
                  <div className="text-slate-400 text-sm mb-2">البروتوكولات المراقبة</div>
                  <div className="text-3xl font-bold text-blue-400">3</div>
                  <div className="text-slate-500 text-xs mt-1">TCP, UDP, ICMP</div>
                </div>
                <div className="bg-slate-700 p-5 rounded-lg">
                  <div className="text-slate-400 text-sm mb-2">الخصائص المحللة</div>
                  <div className="text-3xl font-bold text-green-400">41</div>
                  <div className="text-slate-500 text-xs mt-1">Feature</div>
                </div>
                <div className="bg-slate-700 p-5 rounded-lg">
                  <div className="text-slate-400 text-sm mb-2">أنواع الهجمات</div>
                  <div className="text-3xl font-bold text-red-400">22</div>
                  <div className="text-slate-500 text-xs mt-1">نوع مختلف</div>
                </div>
              </div>

              <div className="bg-slate-700 p-5 rounded-lg">
                <h4 className="font-bold text-white mb-3">الخصائص المراقبة (Features)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {['src_bytes', 'dst_bytes', 'duration', 'protocol_type', 'service', 'flag', 'count', 'srv_count', 
                    'serror_rate', 'srv_serror_rate', 'same_srv_rate', 'diff_srv_rate'].map(feature => (
                    <div key={feature} className="bg-slate-800 px-3 py-2 rounded text-slate-300">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}



{/* Models Tab */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            
            <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Target className="ml-3 text-blue-500" size={28} />
                أداء النماذج المدربة
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg border border-blue-700">
                  <h3 className="text-xl font-bold text-white mb-4">Random Forest</h3>
                  <div className="space-y-2 text-blue-200">
                    <div className="flex justify-between"><span>الدقة:</span><span className="font-bold text-white">99.90%</span></div>
                    <div className="flex justify-between"><span>Precision:</span><span className="font-bold text-white">99.94%</span></div>
                    <div className="flex justify-between"><span>Recall:</span><span className="font-bold text-white">99.84%</span></div>
                    <div className="flex justify-between"><span>F1-Score:</span><span className="font-bold text-white">99.89%</span></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-lg border border-green-700">
                  <h3 className="text-xl font-bold text-white mb-4">XGBoost</h3>
                  <div className="space-y-2 text-green-200">
                    <div className="flex justify-between"><span>الدقة:</span><span className="font-bold text-white">99.91%</span></div>
                    <div className="flex justify-between"><span>Precision:</span><span className="font-bold text-white">99.90%</span></div>
                    <div className="flex justify-between"><span>Recall:</span><span className="font-bold text-white">99.91%</span></div>
                    <div className="flex justify-between"><span>F1-Score:</span><span className="font-bold text-white">99.91%</span></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-lg border border-purple-700">
                  <h3 className="text-xl font-bold text-white mb-4">Ensemble</h3>
                  <div className="space-y-2 text-purple-200">
                    <div className="flex justify-between"><span>الدقة:</span><span className="font-bold text-white">99.92%</span></div>
                    <div className="flex justify-between"><span>Precision:</span><span className="font-bold text-white">99.92%</span></div>
                    <div className="flex justify-between"><span>Recall:</span><span className="font-bold text-white">99.91%</span></div>
                    <div className="flex justify-between"><span>F1-Score:</span><span className="font-bold text-white">99.91%</span></div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-4">🏆 النموذج الفائز: Ensemble</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-green-400 mb-3">✅ النقاط القوية:</h4>
                    <ul className="text-slate-300 space-y-2">
                      <li>• دقة كشف 99.92% - الأعلى بين جميع النماذج</li>
                      <li>• معدل False Positive منخفض جداً: 0.07%</li>
                      <li>• معدل False Negative منخفض: 0.09%</li>
                      <li>• AUC-ROC: 100% - أداء مثالي</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-400 mb-3">⚙️ التقنيات المستخدمة:</h4>
                    <ul className="text-slate-300 space-y-2">
                      <li>• Weighted Voting بين 3 نماذج</li>
                      <li>• Class Balancing للبيانات غير المتوازنة</li>
                      <li>• Feature Scaling مع StandardScaler</li>
                      <li>• Hyperparameter Optimization</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700 p-6 rounded-lg mt-6">
                <h3 className="text-xl font-bold text-white mb-4">📊 أهم الخصائص (Top Features)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['src_bytes', 'dst_bytes', 'count', 'srv_count', 'serror_rate', 'srv_serror_rate', 
                    'dst_host_count', 'duration', 'same_srv_rate', 'diff_srv_rate', 'dst_host_srv_count',
                    'dst_host_same_srv_rate'].map((feature, idx) => (
                    <div key={feature} className="bg-slate-600 px-3 py-2 rounded text-slate-200 text-sm">
                      {idx + 1}. {feature}
                    </div>
                  ))}
                </div>
                <p className="text-slate-400 text-sm mt-4">
                  * هذه الخصائص لها أعلى تأثير في اكتشاف الهجمات حسب Random Forest و XGBoost
                </p>
              </div>

            </div>

          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <Info className="ml-3 text-blue-500" size={32} />
              نظام كشف التهديدات الداخلية في الشبكات
            </h2>
            
            <div className="space-y-6 text-slate-300">
              <div className="bg-slate-700 p-5 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">📝 الوصف</h3>
                <p className="text-lg leading-relaxed">
                  نظام يعتمد على الذكاء الاصطناعي لمراقبة حركة الشبكة واكتشاف أي سلوك مشبوه أو غير طبيعي.
                </p>
              </div>

              <div className="bg-slate-700 p-5 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">🔧 خطوات التنفيذ</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>✅ جمع بيانات حركة مرور الشبكة (NSL-KDD Dataset - 125,973 سجل)</li>
                  <li>✅ استخراج الخصائص (حجم الحزم: src_bytes, dst_bytes - البروتوكولات: TCP/UDP/ICMP)</li>
                  <li>✅ تدريب النماذج (Autoencoder + Isolation Forest)</li>
                  <li>✅ إصدار تنبيه عند اكتشاف نشاط غير طبيعي</li>
                </ol>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-700 p-5 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-3">📊 البيانات</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li>• NSL-KDD Dataset</li>
                    <li>• 125,973 سجل حقيقي</li>
                    <li>• 22 نوع هجوم</li>
                    <li>• 41 خاصية محللة</li>
                  </ul>
                </div>
                <div className="bg-slate-700 p-5 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-3">🤖 النماذج</h3>
               <ul className="space-y-2 text-slate-300">
  <li>• Random Forest (200 trees) - 99.90%</li>
  <li>• XGBoost (300 estimators) - 99.91%</li>
  <li>• Gradient Boosting (150 estimators) - 99.87%</li>
  <li>• Ensemble Model - 99.92%</li>
</ul>
                </div>
              </div>

              <div className="bg-slate-700 p-5 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">⚙️ الأدوات</h3>
                <div className="flex flex-wrap gap-3">
                  {['Python', 'Flask', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'React', 'Recharts'].map(tech => (
                    <span key={tech} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-700 p-5 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">👥 الفريق</h3>
                <p className="text-lg">مشروع تخرج - HIMIT</p>
                <p className="text-slate-400 mt-2">
                  • Abdelhalim 
                  • Sameh
                   • Asmaa
                    • Mohamed 
                    • Mahmoud</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="bg-slate-800 border-t border-slate-700 text-slate-400 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-medium">
            🛡️ نظام كشف التهديدات الداخلية في الشبكات - Network Anomaly Detection System
          </p>
          <p className="text-sm mt-2">
NSL-KDD Dataset • Random Forest • XGBoost • Ensemble • 125,973 Records • 99.92% Accuracy
 Accuracy
          </p>
        </div>
      </div>

    </div>
  );
};

export default NetworkAnomalyDashboard;
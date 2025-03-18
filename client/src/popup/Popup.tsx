/// <reference types="chrome" />

import React, { useState, useEffect } from 'react';
import './Popup.css';

// Placeholder mock corrections for demo
const MOCK_CORRECTIONS = [
  {
    id: 1,
    originalText: '...كان الطلاب يذهبون إلى المدرسة',
    correctedText: 'يذهبون',
    type: 'grammar' as const,
  },
  {
    id: 2,
    originalText: '...في المدينه القديمة',
    correctedText: 'المدينة',
    type: 'spelling' as const,
  },
];

// Settings interface
interface UserSettings {
  processInputs: boolean;
  processTextareas: boolean;
  processContentEditable: boolean;
}

const Popup = () => {
  const [activeTab, setActiveTab] = useState('corrections');
  const [isEnabled, setIsEnabled] = useState(true);
  const [wordCount] = useState(259);
  const [errorCount] = useState(3);
  const [saveStatus, setSaveStatus] = useState('');

  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    processInputs: true,
    processTextareas: true,
    processContentEditable: true
  });

  // Load settings on initial render
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(
        {
          processInputs: true,
          processTextareas: true,
          processContentEditable: true
        },
        (items) => {
          setSettings(items as UserSettings);
        }
      );
    }
  }, []);

  // Handle individual setting change
  const handleSettingChange = (setting: keyof UserSettings) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting]
    };

    setSettings(newSettings);
  };

  // Save all settings
  const saveSettings = () => {
    // First show saving status
    setSaveStatus('جاري الحفظ...');

    // Save to Chrome storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set(settings, () => {
        console.log('Settings saved:', settings);

        // Show success message
        setSaveStatus('تم الحفظ!');

        // Notify content scripts about the settings change
        if (chrome.tabs) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
              try {
                chrome.tabs.sendMessage(
                  tabs[0].id,
                  { type: 'SETTINGS_UPDATED' },
                  (response) => {
                    // Handle possible error
                    if (chrome.runtime.lastError) {
                      console.log('Message passing error:', chrome.runtime.lastError.message);
                      // Still consider settings saved successfully
                    }

                    // Clear status after 2 seconds
                    setTimeout(() => {
                      setSaveStatus('');
                    }, 2000);
                  }
                );
              } catch (error) {
                console.error('Error sending message:', error);
                // Still clear status after 2 seconds
                setTimeout(() => {
                  setSaveStatus('');
                }, 2000);
              }
            } else {
              // No active tab found, but settings are still saved
              setTimeout(() => {
                setSaveStatus('');
              }, 2000);
            }
          });
        } else {
          // If we can't communicate with tabs, still clear the status
          setTimeout(() => {
            setSaveStatus('');
          }, 2000);
        }
      });
    }
  };

  // Tabs configuration
  const tabs = [
    { id: 'corrections', label: 'التصحيحات' },
    { id: 'settings', label: 'الإعدادات' },
    { id: 'language', label: 'اللغة' },
    { id: 'help', label: 'المساعدة' },
  ];

  // Handle correction actions
  const handleAcceptCorrection = (id: number) => {
    console.log('Accepted correction:', id);
  };

  const handleIgnoreCorrection = (id: number) => {
    console.log('Ignored correction:', id);
  };

  return (
    <div className="popup-container">
      {/* Header with switch */}
      <div className="popup-header">
        <h1>تصحيح</h1>
        <label className="switch">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={() => setIsEnabled(!isEnabled)}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="content">
        {activeTab === 'corrections' && (
          <>
            {/* Statistics */}
            <div className="stats-card">
              <div className="stat">
                <span className="stat-label">عدد الكلمات</span>
                <span className="stat-value">{wordCount}</span>
              </div>
              <div className="stat">
                <span className="stat-label">الأخطاء</span>
                <div className="stat-value-with-badge">
                  <span className="stat-value">{errorCount}</span>
                  {errorCount > 0 && (
                    <span className="error-badge">{errorCount}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Corrections List */}
            <div className="corrections-list">
              {MOCK_CORRECTIONS.map((correction) => (
                <div key={correction.id} className="correction-item">
                  <div className="correction-header">
                    <span className={`correction-type ${correction.type}`}>
                      {correction.type === 'grammar' ? 'نحوي' : 'إملائي'}
                    </span>
                    <div className="correction-actions">
                      <button
                        className="accept-button"
                        onClick={() => handleAcceptCorrection(correction.id)}
                      >
                        قبول
                      </button>
                      <button
                        className="ignore-button"
                        onClick={() => handleIgnoreCorrection(correction.id)}
                      >
                        تجاهل
                      </button>
                    </div>
                  </div>
                  <p className="original-text">{correction.originalText}</p>
                  <p className="corrected-text">
                    التصحيح: <span>{correction.correctedText}</span>
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="settings-panel">
            <h2>عناصر الإدخال المراد تصحيحها</h2>
            <div className="setting-group">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.processInputs}
                  onChange={() => handleSettingChange('processInputs')}
                />
                حقول النص (Input)
              </label>

              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.processTextareas}
                  onChange={() => handleSettingChange('processTextareas')}
                />
                مناطق النص (Textarea)
              </label>

              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.processContentEditable}
                  onChange={() => handleSettingChange('processContentEditable')}
                />
                المحتوى القابل للتحرير (Contenteditable)
              </label>
            </div>

            <div className="settings-actions">
              <button
                className="save-settings-button"
                onClick={saveSettings}
                disabled={saveStatus === 'جاري الحفظ...'}
              >
                حفظ الإعدادات
              </button>
              {saveStatus && <span className="save-status">{saveStatus}</span>}
            </div>

            <p className="settings-info">
              يمكنك تحديد أنواع عناصر الإدخال التي تريد أن يعمل عليها المصحح. ستظهر أزرار التصحيح فقط بجانب العناصر المحددة.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="footer">
        <span>الإصدار ١.٢.٠</span>
        <span>حول</span>
        <span>الإعدادات السريعة</span>
      </div>
    </div>
  );
};

export default Popup; 
"use client";
import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

const THEMES = {
  light: {
    name: 'light', bg: '#F8FAFC', card: '#FFFFFF', cardAlt: '#F1F5F9', border: '#E2E8F0',
    text: '#1E3A5F', textSecondary: '#64748B', textMuted: '#94A3B8',
    primary: '#1E7AB3', primaryFaded: '#E0F2FE',
    success: '#059669', successFaded: '#D1FAE5',
    danger: '#DC2626', dangerFaded: '#FEE2E2',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  dark: {
    name: 'dark', bg: '#0F172A', card: '#1E293B', cardAlt: '#334155', border: '#334155',
    text: '#F1F5F9', textSecondary: '#CBD5E1', textMuted: '#64748B',
    primary: '#38BDF8', primaryFaded: '#0C4A6E',
    success: '#34D399', successFaded: '#064E3B',
    danger: '#F87171', dangerFaded: '#7F1D1D',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
  }
};

// ============================================
// DEFAULT PREFERENCES
// ============================================
const DEFAULT_PREFERENCES = {
  clinicianName: '',
  
  // Injection preferences
  injection: {
    steroid: 'Dexamethasone 4mg/mL',
    steroidVolume: '1mL',
    anesthetic: '1% Lidocaine plain',
    anestheticVolume: '1mL',
    needle: '25g 1.5"',
    maxInjectionsPerSite: 3
  },
  
  // Conservative care preferences
  conservative: {
    nsaidPreferred: 'Naproxen 500mg BID or Ibuprofen 600mg TID',
    nsaidAlternative: 'Acetaminophen 1000mg TID',
    stretchingProtocol: 'Gastroc/soleus wall stretches and plantar fascia-specific stretches - hold 30 seconds, 3 reps, 3x daily',
    sandalBrand: 'OOFOs',
    archSupportBrand: 'Powerstep or Superfeet',
    icingProtocol: '15-20 minutes after activity'
  },
  
  // Follow-up intervals
  followUp: {
    postInjection: '2-4 weeks',
    routinePF: '4-6 weeks',
    chronicPF: '3-4 weeks',
    postEPAT: '1 week',
    woundCare: '1-2 weeks',
    woundCareInfected: '3-5 days',
    diabeticLowRisk: '6 months',
    diabeticModRisk: '3-4 months',
    diabeticHighRisk: '1-2 months'
  },
  
  // EPAT preferences
  epat: {
    typicalSessions: '3-5',
    sessionInterval: '1 week'
  },
  
  // Documentation preferences
  documentation: {
    includeDetailedConsent: true,
    includeCPTCodes: true,
    verboseMode: false
  }
};

// ============================================
// PREFERENCES MODAL COMPONENT
// ============================================
function PreferencesModal({ isOpen, onClose, preferences, setPreferences, theme }) {
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [activeTab, setActiveTab] = useState('general');
  
  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences, isOpen]);
  
  if (!isOpen) return null;
  
  const handleSave = () => {
    setPreferences(localPrefs);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mdm-preferences', JSON.stringify(localPrefs));
    }
    onClose();
  };
  
  const handleReset = () => {
    if (confirm('Reset all preferences to defaults?')) {
      setLocalPrefs(DEFAULT_PREFERENCES);
    }
  };
  
  const updatePref = (category, field, value) => {
    setLocalPrefs(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' 
        ? { ...prev[category], [field]: value }
        : value
    }));
  };
  
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: theme.cardAlt,
    border: `1px solid ${theme.border}`,
    borderRadius: 8,
    color: theme.text,
    fontSize: 14,
    marginTop: 4
  };
  
  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: theme.textSecondary,
    marginTop: 16
  };
  
  const tabStyle = (active) => ({
    padding: '10px 16px',
    background: active ? theme.primary : 'transparent',
    color: active ? '#fff' : theme.textSecondary,
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer'
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    }}>
      <div style={{
        background: theme.card,
        borderRadius: 16,
        width: '100%',
        maxWidth: 600,
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: 20, borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, color: theme.text, fontSize: 20 }}>⚙️ My Preferences</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, color: theme.textMuted, cursor: 'pointer' }}>×</button>
          </div>
          <p style={{ margin: '8px 0 0', color: theme.textMuted, fontSize: 13 }}>
            Customize how the app generates your documentation. Saved locally on this device.
          </p>
        </div>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: '12px 20px', borderBottom: `1px solid ${theme.border}`, overflowX: 'auto' }}>
          <button onClick={() => setActiveTab('general')} style={tabStyle(activeTab === 'general')}>General</button>
          <button onClick={() => setActiveTab('injection')} style={tabStyle(activeTab === 'injection')}>Injections</button>
          <button onClick={() => setActiveTab('conservative')} style={tabStyle(activeTab === 'conservative')}>Conservative</button>
          <button onClick={() => setActiveTab('followup')} style={tabStyle(activeTab === 'followup')}>Follow-Up</button>
        </div>
        
        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {activeTab === 'general' && (
            <div>
              <label style={labelStyle}>Clinician Name (optional)</label>
              <input
                type="text"
                value={localPrefs.clinicianName}
                onChange={(e) => updatePref('clinicianName', null, e.target.value)}
                placeholder="Dr. Smith"
                style={inputStyle}
              />
              
              <label style={{ ...labelStyle, marginTop: 24 }}>Documentation Style</label>
              <div style={{ marginTop: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: theme.text, fontSize: 14, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={localPrefs.documentation.includeDetailedConsent}
                    onChange={(e) => updatePref('documentation', 'includeDetailedConsent', e.target.checked)}
                  />
                  Include detailed consent documentation
                </label>
              </div>
              <div style={{ marginTop: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: theme.text, fontSize: 14, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={localPrefs.documentation.includeCPTCodes}
                    onChange={(e) => updatePref('documentation', 'includeCPTCodes', e.target.checked)}
                  />
                  Include CPT codes in output
                </label>
              </div>
            </div>
          )}
          
          {activeTab === 'injection' && (
            <div>
              <label style={labelStyle}>Preferred Steroid</label>
              <select
                value={localPrefs.injection.steroid}
                onChange={(e) => updatePref('injection', 'steroid', e.target.value)}
                style={inputStyle}
              >
                <option value="Dexamethasone 4mg/mL">Dexamethasone 4mg/mL</option>
                <option value="Kenalog 40mg/mL">Kenalog (Triamcinolone) 40mg/mL</option>
                <option value="Depo-Medrol 40mg/mL">Depo-Medrol 40mg/mL</option>
                <option value="Celestone 6mg/mL">Celestone (Betamethasone) 6mg/mL</option>
              </select>
              
              <label style={labelStyle}>Steroid Volume</label>
              <select
                value={localPrefs.injection.steroidVolume}
                onChange={(e) => updatePref('injection', 'steroidVolume', e.target.value)}
                style={inputStyle}
              >
                <option value="0.5mL">0.5 mL</option>
                <option value="1mL">1 mL</option>
                <option value="1.5mL">1.5 mL</option>
                <option value="2mL">2 mL</option>
              </select>
              
              <label style={labelStyle}>Preferred Anesthetic</label>
              <select
                value={localPrefs.injection.anesthetic}
                onChange={(e) => updatePref('injection', 'anesthetic', e.target.value)}
                style={inputStyle}
              >
                <option value="1% Lidocaine plain">1% Lidocaine plain</option>
                <option value="2% Lidocaine plain">2% Lidocaine plain</option>
                <option value="0.25% Marcaine plain">0.25% Marcaine (Bupivacaine) plain</option>
                <option value="0.5% Marcaine plain">0.5% Marcaine (Bupivacaine) plain</option>
                <option value="1% Lidocaine with epi">1% Lidocaine with epinephrine</option>
              </select>
              
              <label style={labelStyle}>Anesthetic Volume</label>
              <select
                value={localPrefs.injection.anestheticVolume}
                onChange={(e) => updatePref('injection', 'anestheticVolume', e.target.value)}
                style={inputStyle}
              >
                <option value="0.5mL">0.5 mL</option>
                <option value="1mL">1 mL</option>
                <option value="1.5mL">1.5 mL</option>
                <option value="2mL">2 mL</option>
                <option value="3mL">3 mL</option>
              </select>
              
              <label style={labelStyle}>Preferred Needle</label>
              <select
                value={localPrefs.injection.needle}
                onChange={(e) => updatePref('injection', 'needle', e.target.value)}
                style={inputStyle}
              >
                <option value='25g 1.5"'>25g 1.5"</option>
                <option value='25g 1"'>25g 1"</option>
                <option value='27g 1.25"'>27g 1.25"</option>
                <option value='22g 1.5"'>22g 1.5"</option>
              </select>
              
              <label style={labelStyle}>Max Injections Per Site Before Discussion</label>
              <select
                value={localPrefs.injection.maxInjectionsPerSite}
                onChange={(e) => updatePref('injection', 'maxInjectionsPerSite', parseInt(e.target.value))}
                style={inputStyle}
              >
                <option value={2}>2 injections</option>
                <option value={3}>3 injections</option>
                <option value={4}>4 injections</option>
              </select>
            </div>
          )}
          
          {activeTab === 'conservative' && (
            <div>
              <label style={labelStyle}>Preferred NSAID Recommendation</label>
              <input
                type="text"
                value={localPrefs.conservative.nsaidPreferred}
                onChange={(e) => updatePref('conservative', 'nsaidPreferred', e.target.value)}
                style={inputStyle}
              />
              
              <label style={labelStyle}>NSAID Alternative (for contraindications)</label>
              <input
                type="text"
                value={localPrefs.conservative.nsaidAlternative}
                onChange={(e) => updatePref('conservative', 'nsaidAlternative', e.target.value)}
                style={inputStyle}
              />
              
              <label style={labelStyle}>Stretching Protocol</label>
              <textarea
                value={localPrefs.conservative.stretchingProtocol}
                onChange={(e) => updatePref('conservative', 'stretchingProtocol', e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
              
              <label style={labelStyle}>Preferred Recovery Sandal Brand</label>
              <input
                type="text"
                value={localPrefs.conservative.sandalBrand}
                onChange={(e) => updatePref('conservative', 'sandalBrand', e.target.value)}
                placeholder="OOFOs"
                style={inputStyle}
              />
              
              <label style={labelStyle}>Preferred OTC Arch Support Brand</label>
              <input
                type="text"
                value={localPrefs.conservative.archSupportBrand}
                onChange={(e) => updatePref('conservative', 'archSupportBrand', e.target.value)}
                placeholder="Powerstep, Superfeet"
                style={inputStyle}
              />
              
              <label style={labelStyle}>Icing Protocol</label>
              <input
                type="text"
                value={localPrefs.conservative.icingProtocol}
                onChange={(e) => updatePref('conservative', 'icingProtocol', e.target.value)}
                style={inputStyle}
              />
            </div>
          )}
          
          {activeTab === 'followup' && (
            <div>
              <h4 style={{ color: theme.text, margin: '0 0 12px', fontSize: 14 }}>Plantar Fasciitis</h4>
              
              <label style={labelStyle}>Post-Injection Follow-Up</label>
              <input
                type="text"
                value={localPrefs.followUp.postInjection}
                onChange={(e) => updatePref('followUp', 'postInjection', e.target.value)}
                style={inputStyle}
              />
              
              <label style={labelStyle}>Routine Follow-Up</label>
              <input
                type="text"
                value={localPrefs.followUp.routinePF}
                onChange={(e) => updatePref('followUp', 'routinePF', e.target.value)}
                style={inputStyle}
              />
              
              <label style={labelStyle}>Chronic/Refractory Follow-Up</label>
              <input
                type="text"
                value={localPrefs.followUp.chronicPF}
                onChange={(e) => updatePref('followUp', 'chronicPF', e.target.value)}
                style={inputStyle}
              />
              
              <h4 style={{ color: theme.text, margin: '24px 0 12px', fontSize: 14 }}>Wound Care</h4>
              
              <label style={labelStyle}>Routine Wound Follow-Up</label>
              <input
                type="text"
                value={localPrefs.followUp.woundCare}
                onChange={(e) => updatePref('followUp', 'woundCare', e.target.value)}
                style={inputStyle}
              />
              
              <label style={labelStyle}>Infected Wound Follow-Up</label>
              <input
                type="text"
                value={localPrefs.followUp.woundCareInfected}
                onChange={(e) => updatePref('followUp', 'woundCareInfected', e.target.value)}
                style={inputStyle}
              />
              
              <h4 style={{ color: theme.text, margin: '24px 0 12px', fontSize: 14 }}>Diabetic Foot Exam</h4>
              
              <label style={labelStyle}>Low Risk Interval</label>
              <input
                type="text"
                value={localPrefs.followUp.diabeticLowRisk}
                onChange={(e) => updatePref('followUp', 'diabeticLowRisk', e.target.value)}
                style={inputStyle}
              />
              
              <label style={labelStyle}>Moderate Risk Interval</label>
              <input
                type="text"
                value={localPrefs.followUp.diabeticModRisk}
                onChange={(e) => updatePref('followUp', 'diabeticModRisk', e.target.value)}
                style={inputStyle}
              />
              
              <label style={labelStyle}>High Risk Interval</label>
              <input
                type="text"
                value={localPrefs.followUp.diabeticHighRisk}
                onChange={(e) => updatePref('followUp', 'diabeticHighRisk', e.target.value)}
                style={inputStyle}
              />
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div style={{ padding: 16, borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <button
            onClick={handleReset}
            style={{
              padding: '12px 20px',
              background: theme.dangerFaded,
              color: theme.danger,
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Reset to Defaults
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                padding: '12px 20px',
                background: theme.cardAlt,
                color: theme.textSecondary,
                border: `1px solid ${theme.border}`,
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '12px 24px',
                background: theme.primary,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ONBOARDING WIZARD COMPONENT
// ============================================
function OnboardingWizard({ onComplete, preferences, setPreferences, theme }) {
  const [step, setStep] = useState(0);
  const [localPrefs, setLocalPrefs] = useState(preferences);
  
  const updatePref = (category, field, value) => {
    setLocalPrefs(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' 
        ? { ...prev[category], [field]: value }
        : value
    }));
  };
  
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Save and complete
      setPreferences(localPrefs);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mdm-preferences', JSON.stringify(localPrefs));
        localStorage.setItem('mdm-onboarding-complete', 'true');
      }
      onComplete();
    }
  };
  
  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };
  
  const handleSkip = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mdm-onboarding-complete', 'true');
    }
    onComplete();
  };
  
  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: theme.cardAlt,
    border: `2px solid ${theme.border}`,
    borderRadius: 12,
    color: theme.text,
    fontSize: 16,
    marginTop: 8,
    boxSizing: 'border-box'
  };
  
  const labelStyle = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: theme.textSecondary,
    marginTop: 20
  };
  
  const optionCardStyle = (selected) => ({
    padding: '16px 20px',
    background: selected ? theme.primaryFaded : theme.card,
    border: `2px solid ${selected ? theme.primary : theme.border}`,
    borderRadius: 12,
    cursor: 'pointer',
    marginTop: 10,
    transition: 'all 0.2s'
  });

  const steps = [
    // Step 0: Welcome
    {
      title: "Welcome to MDM Workstation! 👋",
      subtitle: "Let's personalize the app for you",
      content: (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🩺</div>
          <p style={{ color: theme.textSecondary, fontSize: 16, lineHeight: 1.6, maxWidth: 400, margin: '0 auto' }}>
            We'll ask a few quick questions to customize your documentation output. This takes about <strong>2 minutes</strong> and you can always change these later.
          </p>
          <div style={{ marginTop: 30, padding: 16, background: theme.cardAlt, borderRadius: 12, display: 'inline-block' }}>
            <label style={{ ...labelStyle, marginTop: 0 }}>What's your name?</label>
            <input
              type="text"
              value={localPrefs.clinicianName}
              onChange={(e) => updatePref('clinicianName', null, e.target.value)}
              placeholder="Dr. Smith"
              style={{ ...inputStyle, width: 250, textAlign: 'center' }}
              autoFocus
            />
          </div>
        </div>
      )
    },
    
    // Step 1: Injection - Steroid
    {
      title: "Injection Preferences",
      subtitle: "What's your go-to steroid?",
      content: (
        <div>
          <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 10 }}>Select your preferred corticosteroid for injections:</p>
          
          {[
            { value: 'Dexamethasone 4mg/mL', label: 'Dexamethasone 4mg/mL', desc: 'Water soluble, less tissue atrophy risk' },
            { value: 'Kenalog 40mg/mL', label: 'Kenalog (Triamcinolone) 40mg/mL', desc: 'Longer acting depot steroid' },
            { value: 'Depo-Medrol 40mg/mL', label: 'Depo-Medrol 40mg/mL', desc: 'Intermediate acting' },
            { value: 'Celestone 6mg/mL', label: 'Celestone (Betamethasone) 6mg/mL', desc: 'Potent, water soluble' }
          ].map(opt => (
            <div 
              key={opt.value}
              onClick={() => updatePref('injection', 'steroid', opt.value)}
              style={optionCardStyle(localPrefs.injection.steroid === opt.value)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 24, height: 24, borderRadius: '50%', 
                  border: `2px solid ${localPrefs.injection.steroid === opt.value ? theme.primary : theme.border}`,
                  background: localPrefs.injection.steroid === opt.value ? theme.primary : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 14
                }}>
                  {localPrefs.injection.steroid === opt.value && '✓'}
                </div>
                <div>
                  <div style={{ color: theme.text, fontWeight: 600 }}>{opt.label}</div>
                  <div style={{ color: theme.textMuted, fontSize: 13 }}>{opt.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    
    // Step 2: Injection - Anesthetic
    {
      title: "Injection Preferences",
      subtitle: "What anesthetic do you mix with?",
      content: (
        <div>
          <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 10 }}>Select your preferred local anesthetic:</p>
          
          {[
            { value: '1% Lidocaine plain', label: '1% Lidocaine plain', desc: 'Fast onset, short duration' },
            { value: '2% Lidocaine plain', label: '2% Lidocaine plain', desc: 'Faster/deeper anesthesia' },
            { value: '0.25% Marcaine plain', label: '0.25% Marcaine (Bupivacaine) plain', desc: 'Longer duration (4-8 hrs)' },
            { value: '0.5% Marcaine plain', label: '0.5% Marcaine (Bupivacaine) plain', desc: 'Longer duration, denser block' },
            { value: '1% Lidocaine with epi', label: '1% Lidocaine with epinephrine', desc: 'Prolonged effect, less bleeding' }
          ].map(opt => (
            <div 
              key={opt.value}
              onClick={() => updatePref('injection', 'anesthetic', opt.value)}
              style={optionCardStyle(localPrefs.injection.anesthetic === opt.value)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 24, height: 24, borderRadius: '50%', 
                  border: `2px solid ${localPrefs.injection.anesthetic === opt.value ? theme.primary : theme.border}`,
                  background: localPrefs.injection.anesthetic === opt.value ? theme.primary : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 14
                }}>
                  {localPrefs.injection.anesthetic === opt.value && '✓'}
                </div>
                <div>
                  <div style={{ color: theme.text, fontWeight: 600 }}>{opt.label}</div>
                  <div style={{ color: theme.textMuted, fontSize: 13 }}>{opt.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    
    // Step 3: Injection - Volumes
    {
      title: "Injection Preferences",
      subtitle: "What volumes do you typically use?",
      content: (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={labelStyle}>Steroid Volume</label>
              <select
                value={localPrefs.injection.steroidVolume}
                onChange={(e) => updatePref('injection', 'steroidVolume', e.target.value)}
                style={inputStyle}
              >
                <option value="0.5mL">0.5 mL</option>
                <option value="1mL">1 mL</option>
                <option value="1.5mL">1.5 mL</option>
                <option value="2mL">2 mL</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Anesthetic Volume</label>
              <select
                value={localPrefs.injection.anestheticVolume}
                onChange={(e) => updatePref('injection', 'anestheticVolume', e.target.value)}
                style={inputStyle}
              >
                <option value="0.5mL">0.5 mL</option>
                <option value="1mL">1 mL</option>
                <option value="1.5mL">1.5 mL</option>
                <option value="2mL">2 mL</option>
                <option value="3mL">3 mL</option>
              </select>
            </div>
          </div>
          
          <label style={labelStyle}>Preferred Needle</label>
          <select
            value={localPrefs.injection.needle}
            onChange={(e) => updatePref('injection', 'needle', e.target.value)}
            style={inputStyle}
          >
            <option value='25g 1.5"'>25g 1.5"</option>
            <option value='25g 1"'>25g 1"</option>
            <option value='27g 1.25"'>27g 1.25"</option>
            <option value='22g 1.5"'>22g 1.5"</option>
          </select>
          
          <div style={{ marginTop: 24, padding: 16, background: theme.cardAlt, borderRadius: 12 }}>
            <div style={{ color: theme.text, fontWeight: 600, marginBottom: 8 }}>Your injection will document as:</div>
            <div style={{ color: theme.primary, fontFamily: 'monospace', fontSize: 14 }}>
              "{localPrefs.injection.steroidVolume} {localPrefs.injection.steroid} + {localPrefs.injection.anestheticVolume} {localPrefs.injection.anesthetic}"
            </div>
          </div>
        </div>
      )
    },
    
    // Step 4: Conservative Care
    {
      title: "Conservative Care",
      subtitle: "What's your usual recommendation?",
      content: (
        <div>
          <label style={labelStyle}>Preferred NSAID Recommendation</label>
          <input
            type="text"
            value={localPrefs.conservative.nsaidPreferred}
            onChange={(e) => updatePref('conservative', 'nsaidPreferred', e.target.value)}
            placeholder="Naproxen 500mg BID or Ibuprofen 600mg TID"
            style={inputStyle}
          />
          
          <label style={labelStyle}>Alternative for Patients on Blood Thinners</label>
          <input
            type="text"
            value={localPrefs.conservative.nsaidAlternative}
            onChange={(e) => updatePref('conservative', 'nsaidAlternative', e.target.value)}
            placeholder="Acetaminophen 1000mg TID"
            style={inputStyle}
          />
          
          <label style={labelStyle}>Preferred Recovery Sandal</label>
          <input
            type="text"
            value={localPrefs.conservative.sandalBrand}
            onChange={(e) => updatePref('conservative', 'sandalBrand', e.target.value)}
            placeholder="OOFOs"
            style={inputStyle}
          />
          
          <label style={labelStyle}>Preferred OTC Arch Support</label>
          <input
            type="text"
            value={localPrefs.conservative.archSupportBrand}
            onChange={(e) => updatePref('conservative', 'archSupportBrand', e.target.value)}
            placeholder="Powerstep or Superfeet"
            style={inputStyle}
          />
        </div>
      )
    },
    
    // Step 5: Stretching Protocol
    {
      title: "Conservative Care",
      subtitle: "Describe your stretching protocol",
      content: (
        <div>
          <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 10 }}>
            This exact wording will appear in your conservative care recommendations:
          </p>
          
          <textarea
            value={localPrefs.conservative.stretchingProtocol}
            onChange={(e) => updatePref('conservative', 'stretchingProtocol', e.target.value)}
            rows={4}
            placeholder="Gastroc/soleus wall stretches and plantar fascia-specific stretches - hold 30 seconds, 3 reps, 3x daily"
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
          />
          
          <label style={labelStyle}>Icing Protocol</label>
          <input
            type="text"
            value={localPrefs.conservative.icingProtocol}
            onChange={(e) => updatePref('conservative', 'icingProtocol', e.target.value)}
            placeholder="15-20 minutes after activity"
            style={inputStyle}
          />
        </div>
      )
    },
    
    // Step 6: Follow-up Intervals
    {
      title: "Follow-Up Intervals",
      subtitle: "When do you typically see patients back?",
      content: (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ ...labelStyle, marginTop: 0 }}>Post-Injection</label>
              <input
                type="text"
                value={localPrefs.followUp.postInjection}
                onChange={(e) => updatePref('followUp', 'postInjection', e.target.value)}
                placeholder="2-4 weeks"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ ...labelStyle, marginTop: 0 }}>Post-EPAT Session</label>
              <input
                type="text"
                value={localPrefs.followUp.postEPAT}
                onChange={(e) => updatePref('followUp', 'postEPAT', e.target.value)}
                placeholder="1 week"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Routine PF</label>
              <input
                type="text"
                value={localPrefs.followUp.routinePF}
                onChange={(e) => updatePref('followUp', 'routinePF', e.target.value)}
                placeholder="4-6 weeks"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Chronic/Refractory</label>
              <input
                type="text"
                value={localPrefs.followUp.chronicPF}
                onChange={(e) => updatePref('followUp', 'chronicPF', e.target.value)}
                placeholder="3-4 weeks"
                style={inputStyle}
              />
            </div>
          </div>
          
          <div style={{ marginTop: 24 }}>
            <div style={{ color: theme.textSecondary, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>WOUND CARE</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ ...labelStyle, marginTop: 0 }}>Routine Wound</label>
                <input
                  type="text"
                  value={localPrefs.followUp.woundCare}
                  onChange={(e) => updatePref('followUp', 'woundCare', e.target.value)}
                  placeholder="1-2 weeks"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ ...labelStyle, marginTop: 0 }}>Infected Wound</label>
                <input
                  type="text"
                  value={localPrefs.followUp.woundCareInfected}
                  onChange={(e) => updatePref('followUp', 'woundCareInfected', e.target.value)}
                  placeholder="3-5 days"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>
      )
    },
    
    // Step 7: All Done
    {
      title: "You're All Set! 🎉",
      subtitle: "Your preferences have been saved",
      content: (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <p style={{ color: theme.textSecondary, fontSize: 16, lineHeight: 1.6, maxWidth: 450, margin: '0 auto' }}>
            {localPrefs.clinicianName ? `Thanks, ${localPrefs.clinicianName.replace('Dr. ', '')}!` : 'Thanks!'} Your documentation will now reflect your personal preferences.
          </p>
          
          <div style={{ marginTop: 30, padding: 20, background: theme.cardAlt, borderRadius: 12, textAlign: 'left', maxWidth: 400, margin: '30px auto 0' }}>
            <div style={{ color: theme.textMuted, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>YOUR SETUP:</div>
            <div style={{ color: theme.text, fontSize: 14, marginBottom: 8 }}>
              <strong>Injection:</strong> {localPrefs.injection.steroidVolume} {localPrefs.injection.steroid.split(' ')[0]} + {localPrefs.injection.anestheticVolume} {localPrefs.injection.anesthetic.split(' ')[0]}
            </div>
            <div style={{ color: theme.text, fontSize: 14, marginBottom: 8 }}>
              <strong>NSAIDs:</strong> {localPrefs.conservative.nsaidPreferred.substring(0, 40)}...
            </div>
            <div style={{ color: theme.text, fontSize: 14 }}>
              <strong>Sandals:</strong> {localPrefs.conservative.sandalBrand}
            </div>
          </div>
          
          <p style={{ color: theme.textMuted, fontSize: 13, marginTop: 24 }}>
            You can change these anytime by clicking ⚙️ in the header.
          </p>
        </div>
      )
    }
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;
  const isFirstStep = step === 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: theme.bg,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Progress bar */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img 
              src="/logo.png" 
              alt="Newtown Foot & Ankle Specialists" 
              style={{ height: 36, width: 'auto' }}
            />
          </div>
          <button 
            onClick={handleSkip}
            style={{ background: 'none', border: 'none', color: theme.textMuted, fontSize: 14, cursor: 'pointer' }}
          >
            Skip Setup →
          </button>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {steps.map((_, i) => (
            <div 
              key={i} 
              style={{ 
                flex: 1, 
                height: 4, 
                borderRadius: 2,
                background: i <= step ? theme.primary : theme.border,
                transition: 'background 0.3s'
              }} 
            />
          ))}
        </div>
        <div style={{ color: theme.textMuted, fontSize: 12, marginTop: 8 }}>
          Step {step + 1} of {steps.length}
        </div>
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ color: theme.text, fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            {currentStep.title}
          </h2>
          <p style={{ color: theme.textSecondary, fontSize: 16, marginBottom: 24 }}>
            {currentStep.subtitle}
          </p>
          {currentStep.content}
        </div>
      </div>
      
      {/* Footer */}
      <div style={{ 
        padding: 20, 
        borderTop: `1px solid ${theme.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12
      }}>
        <button
          onClick={handleBack}
          disabled={isFirstStep}
          style={{
            padding: '14px 24px',
            background: isFirstStep ? theme.cardAlt : theme.card,
            color: isFirstStep ? theme.textMuted : theme.textSecondary,
            border: `1px solid ${theme.border}`,
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 600,
            cursor: isFirstStep ? 'not-allowed' : 'pointer',
            opacity: isFirstStep ? 0.5 : 1
          }}
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          style={{
            padding: '14px 32px',
            background: theme.primary,
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            minWidth: 140
          }}
        >
          {isLastStep ? "Let's Go! 🚀" : 'Continue →'}
        </button>
      </div>
    </div>
  );
}

// ============================================
// CLINICAL INPUT PARSER
// ============================================
function parseInput(text) {
  return {
    // Medications/Contraindications
    contraindications: {
      anticoagulant: /blood\s*thinner|anticoag|eliquis|xarelto|warfarin|coumadin|plavix|pradaxa|lovenox|heparin|apixaban|rivaroxaban|on\s*ac\b|brillinta|brilinta/i.test(text),
      nsaidAllergy: /nsaid\s*allerg|allergic.*nsaid|can'?t.*nsaid|no\s*nsaid/i.test(text),
      giIssues: /gi\s*bleed|ulcer|stomach\s*(issue|problem)|gerd|reflux/i.test(text),
      kidneyIssues: /ckd|kidney|renal\s*(insuffic|failure|disease)/i.test(text),
      diabetic: /diabet|dm\s*(1|2|type)|a1c/i.test(text)
    },
    
    procedures: {
      injection: /gave\s*(injection|shot|csi)|injected|csi\s*(today|given|performed)|cortisone|steroid\s*(shot|inject)|shot\s*today|did\s*(inject|shot|csi)/i.test(text),
      epat: /epat\s*(today|done|performed|given|session|#?\d)|shockwave\s*(today|done|performed)|did\s*epat|eswt\s*(today|session)/i.test(text),
      debridement: /debrided|debridement\s*(done|performed|today)|sharp\s*debride/i.test(text),
      nails: /nail\s*(trim|cut|care|debride)|trimmed\s*nail|cut\s*nail/i.test(text),
      strapping: /strap(ping|ped)|taped|taping/i.test(text),
      casting: /cast\s*(applied|today)|casted|splint/i.test(text),
      dispense_ortho: /dispens(ed|ing)\s*orthot|orthot.*dispens|gave.*orthot/i.test(text)
    },
    
    planned: {
      injection: /will\s*inject|plan.*inject|recommend.*inject|csi\s*(if|next|option)|offer(ed)?.*shot|consider\s*inject/i.test(text) && !/no\s*(injection|shot)|decline|refuse/i.test(text),
      epat: /will.*epat|plan.*epat|recommend.*epat|start\s*epat|epat\s*series/i.test(text) && !/did|performed|today|session\s*#?\d/i.test(text),
      pt: /pt\s*referr|physical\s*therapy|refer.*pt|order.*pt/i.test(text),
      mri: /mri\s*(order|if|recommend|need)|order\s*mri|get\s*mri/i.test(text),
      surgery: /surg(ery|ical).*(consult|option|discuss|consider|candid|recommend)|discuss.*surg|proceed.*surg/i.test(text),
      orthotics: /order.*orthot|custom\s*orthot|orthotic.*(order|rx|cast)|cast.*orthot/i.test(text),
      cam_boot: /cam\s*(boot|walker)|walking\s*boot|fracture\s*boot/i.test(text),
      diabetic_shoes: /diabetic\s*shoe|therapeutic.*footwear|a5500|order.*shoe/i.test(text)
    },
    
    declined: {
      injection: /no\s*(injection|shot)|decline[ds]?\s*(injection|shot)|refuse[ds]?\s*(injection|shot)|hold.*inject|defer.*inject|doesn'?t\s*want.*shot|patient\s*refuse|without\s*inject/i.test(text),
      epat: /no\s*epat|decline.*epat|doesn'?t\s*want\s*epat/i.test(text),
      surgery: /decline.*surg|no\s*surg|refuse.*surg|conservative|non-?op|not\s*interest.*surg/i.test(text)
    },
    
    findings: {
      improved: /improv|better|progress|resolv|healing|decreas.*pain|good\s*response|50%|75%|relief/i.test(text),
      worse: /worse|deteriorat|not\s*improv|fail|no.*(better|improvement|relief)|increas.*pain|exacerbat|flare|no\s*progress/i.test(text),
      unchanged: /unchanged|same|stable|no\s*change|persist|plateau/i.test(text),
      chronic: /chronic|recalcitrant|months|years|failed.*(multiple|conservative)|long-?standing|>?\s*6\s*w/i.test(text),
      acute: /acute|sudden|recent|new\s*onset|yesterday|last\s*(night|week)|today|just\s*started|\d\s*day/i.test(text),
      infection: /infect|celluliti|purulent|erythema.*spread|fever|abscess/i.test(text),
      lops: /lops|neuropath|numbness|tingling|no\s*sensation|can'?t\s*feel|diminished\s*sens|absent.*sens/i.test(text),
      pvd: /pvd|pad|pulse.*(absent|diminish|weak)|poor\s*circ|non-?palp/i.test(text),
      deformity: /deform|hav|bunion|hammer|charcot|claw|mallet|prominent/i.test(text)
    },
    
    values: {
      injNum: (() => {
        const m = text.match(/#(\d)|(\d)(?:st|nd|rd|th)\s*(inj|shot|csi)|(first|second|third)\s*(inj|shot)/i);
        if (!m) return '1';
        const map = { first: '1', second: '2', third: '3' };
        return m[1] || m[2] || map[m[4]?.toLowerCase()] || '1';
      })(),
      epatNum: (() => {
        const m = text.match(/epat\s*#?(\d)|(first|second|third|fourth|fifth)\s*epat/i);
        if (!m) return '1';
        const map = { first: '1', second: '2', third: '3', fourth: '4', fifth: '5' };
        return m[1] || map[m[2]?.toLowerCase()] || '1';
      })(),
      duration: text.match(/(\d+)\s*(day|week|wk|month|mo|year|yr)s?/i)?.[0],
      woundSize: text.match(/(\d+\.?\d*)\s*[x×]\s*(\d+\.?\d*)\s*[x×]?\s*(\d+\.?\d*)?/i),
      a1c: text.match(/a1c[:\s]*(\d+\.?\d*)/i)?.[1],
      hva: text.match(/hva[:\s]*(\d+)/i)?.[1],
      ima: text.match(/ima[:\s]*(\d+)/i)?.[1],
      wagner: text.match(/wagner\s*(\d)/i)?.[1]
    },
    
    laterality: /\bleft|lt\b/i.test(text) ? 'left' : /\bright|rt\b/i.test(text) ? 'right' : /bilat/i.test(text) ? 'bilateral' : null,
    
    // Check for truly separate problem (Modifier 25 scenario)
    separateProblem: /also\s*(has|complain|inject)|separate|different\s*(foot|problem|issue)|other\s*(foot|complaint)|in\s*addition|plus\s*(he|she|they|patient)/i.test(text),
    
    // Check if this is primarily a diabetic foot exam
    isDiabeticExam: /cdfe|diabetic\s*(foot)?\s*exam|g024[56]|dm\s*exam|comprehensive\s*diabetic/i.test(text),
    
    text
  };
}

// ============================================
// STANDARD CONSERVATIVE RECOMMENDATIONS
// ============================================
function getConservativeRecs(type, contraindications = {}, prefs = DEFAULT_PREFERENCES) {
  const onAC = contraindications.anticoagulant;
  const noNSAID = contraindications.nsaidAllergy || contraindications.giIssues || contraindications.kidneyIssues;
  
  let nsaidLine = '';
  if (onAC) {
    nsaidLine = `- NSAIDs: AVOIDED due to anticoagulant therapy (increased bleeding risk). ${prefs.conservative.nsaidAlternative} for pain if needed.`;
  } else if (noNSAID) {
    nsaidLine = `- NSAIDs: Contraindicated due to [GI history/renal function/allergy]. ${prefs.conservative.nsaidAlternative} for pain PRN.`;
  } else {
    nsaidLine = `- NSAIDs: ${prefs.conservative.nsaidPreferred} as needed for pain/inflammation if not contraindicated`;
  }

  const recs = {
    plantarFasciitis: `
Continue Conservative Measures:
- Supportive footwear at all times - shoes with firm heel counter and arch support
- No barefoot walking, even at home
- ${prefs.conservative.sandalBrand} or similar recovery sandals when sandals needed
- Stretching protocol: ${prefs.conservative.stretchingProtocol}
${nsaidLine}
- Ice: ${prefs.conservative.icingProtocol}`,

    achilles: `
Continue Conservative Measures:
- Supportive footwear with slight heel elevation
- Heel lifts in all shoes to reduce tendon strain
- ${prefs.conservative.sandalBrand} or similar recovery sandals when sandals needed
- Eccentric loading exercises (Alfredson protocol) - essential for tendon remodeling
- Avoid hills, stairs, and explosive movements during recovery
${onAC || noNSAID ? nsaidLine : '- NSAIDs: Short-term for acute flares only (may impair tendon healing with prolonged use) - if not contraindicated'}
- Ice: ${prefs.conservative.icingProtocol}`,

    general: `
Continue Conservative Measures:
- Supportive footwear at all times
- No barefoot walking
- ${prefs.conservative.sandalBrand} or similar recovery sandals when sandals needed
${nsaidLine}
- Ice as needed for pain/swelling`
  };
  
  return recs[type] || recs.general;
}

// Helper to get NSAID reasoning for MDM
function getNSAIDReasoning(contraindications) {
  if (contraindications.anticoagulant) {
    return 'Patient on anticoagulant therapy - NSAIDs avoided due to bleeding risk; alternative analgesia considered.';
  }
  if (contraindications.giIssues) {
    return 'History of GI issues - NSAIDs avoided; alternative analgesia recommended.';
  }
  if (contraindications.kidneyIssues) {
    return 'Renal considerations - NSAIDs avoided to prevent further renal compromise.';
  }
  return null;
}

// ============================================
// CONDITIONS WITH PROPER BILLING LOGIC
// ============================================
const CONDITIONS = {
  'plantar-fasciitis': {
    name: 'Plantar Fasciitis',
    code: 'M72.2',
    dotPhrase: '.pf',
    patterns: [/plantar\s*fasc/i, /heel\s*pain/i, /first\s*step/i, /medial\s*calcaneal/i, /windlass/i, /pf\b/i, /post-?static/i],
    generate: (input) => {
      const p = parseInput(input.text);
      const prefs = input.prefs || DEFAULT_PREFERENCES;
      const lat = p.laterality || input.laterality || '[LEFT/RIGHT]';
      const dur = p.values.duration || '[duration]';
      const ischronic = p.findings.chronic;
      const injNum = p.values.injNum;
      const hasContraindication = p.contraindications.anticoagulant || p.contraindications.nsaidAllergy || p.contraindications.giIssues || p.contraindications.kidneyIssues;
      
      // Determine visit type
      const isProcedureVisit = p.procedures.injection || p.procedures.epat;
      
      // Build failed treatments from context
      const failedTx = [];
      if (/stretch/i.test(input.text)) failedTx.push('stretching');
      if (/nsaid|aleve|advil|ibuprofen|naproxen/i.test(input.text)) failedTx.push('NSAIDs');
      if (/otc|insert|arch\s*support/i.test(input.text)) failedTx.push('OTC arch supports');
      if (/ice/i.test(input.text)) failedTx.push('ice therapy');
      if (/night\s*splint/i.test(input.text)) failedTx.push('night splinting');
      if (/orthot/i.test(input.text) && !p.planned.orthotics) failedTx.push('orthotics');
      if (/pt|physical\s*therapy/i.test(input.text) && !p.planned.pt) failedTx.push('physical therapy');
      if (/inject|shot/i.test(input.text) && parseInt(injNum) > 1) failedTx.push(`prior injection(s) x${parseInt(injNum)-1}`);
      
      // Get appropriate conservative recs based on contraindications AND preferences
      const conservativeRecs = getConservativeRecs('plantarFasciitis', p.contraindications, prefs);
      const nsaidReasoning = getNSAIDReasoning(p.contraindications);
      
      let plan = '';

      // ==========================================
      // INJECTION PROCEDURE NOTE
      // ==========================================
      if (p.procedures.injection) {
        plan = `PROCEDURE: Corticosteroid Injection, Plantar Fascia Origin, ${lat}

DIAGNOSIS: Plantar fasciitis, ${lat}${ischronic ? ', chronic' : ''} (M72.2)

INDICATION FOR INJECTION:
Patient presents with plantar fasciitis of ${dur} duration. ${failedTx.length > 0 ? `Conservative management including ${failedTx.join(', ')} has provided inadequate relief.` : 'Conservative management has provided inadequate relief.'} Examination confirms tenderness at the medial calcaneal tubercle with positive Windlass test. Given persistent symptoms and functional limitation, corticosteroid injection is indicated to reduce inflammation at the fascial origin.

CONSENT:
Risks and benefits discussed with patient including: infection, bleeding, post-injection flare, fat pad atrophy, skin depigmentation, plantar fascia rupture, and temporary vs incomplete relief. Patient understands and consents to proceed.

PROCEDURE:
- Timeout performed, correct patient and site confirmed
- ${lat} foot prepped with alcohol/chloraprep
- ${prefs.injection.needle} needle used via medial approach to plantar fascia origin
- Aspiration negative
- ${prefs.injection.steroidVolume} ${prefs.injection.steroid} + ${prefs.injection.anestheticVolume} ${prefs.injection.anesthetic} injected at fascial enthesis
- Needle withdrawn, hemostasis achieved, bandage applied
- Patient tolerated procedure well without complication

This is injection #${injNum} to this site.${parseInt(injNum) >= prefs.injection.maxInjectionsPerSite ? ` Patient advised of diminishing returns with repeated injections and discussed alternative treatment options.` : ''}

POST-PROCEDURE INSTRUCTIONS:
- Rest and limit activity 48-72 hours
- Ice 15-20 minutes as needed for discomfort
- May experience numbness 2-4 hours (local anesthetic)
- Possible post-injection flare days 1-2; will resolve
- Call if increasing pain, fever, or spreading redness
${p.contraindications.diabetic ? '- DIABETIC: Monitor blood glucose closely 48-72 hours post-injection - corticosteroids may cause temporary elevation' : ''}
${conservativeRecs}

FOLLOW-UP: Return ${prefs.followUp.postInjection} to assess response to injection.

CPT: 20550`;

        // Only add Modifier 25 language if there's a truly separate problem
        if (p.separateProblem) {
          plan += `

---
NOTE - SEPARATE E&M SERVICE:
A separate E&M service was performed today for [document separate problem]. This represents a distinct clinical issue requiring independent evaluation and management beyond the injection procedure.`;
        }

        return plan;
      }

      // ==========================================
      // EPAT PROCEDURE NOTE
      // ==========================================
      if (p.procedures.epat) {
        const session = p.values.epatNum;
        plan = `PROCEDURE: EPAT (Extracorporeal Pulse Activation Technology), ${lat} Plantar Fascia

DIAGNOSIS: Plantar fasciitis, ${lat}, chronic/recalcitrant (M72.2)

INDICATION FOR EPAT:
Patient with chronic plantar fasciitis exceeding 12 weeks duration with inadequate response to conservative care${failedTx.length > 0 ? ` including ${failedTx.join(', ')}` : ''}. EPAT/shockwave therapy indicated for recalcitrant plantar fasciitis per clinical evidence demonstrating efficacy through mechanotransduction and neovascularization.

PROCEDURE:
- Session #${session} of treatment series
- Treatment area: Plantar fascia origin and zone of maximum tenderness
- Coupling gel applied
- EPAT delivered per protocol
- Patient tolerated treatment; expected post-treatment soreness discussed

POST-PROCEDURE:
- Mild discomfort/aching expected 24-48 hours
- Avoid anti-inflammatories 24 hours post-treatment (may blunt healing response)
- May ice for comfort
${conservativeRecs}

FOLLOW-UP: ${parseInt(session) < 5 ? 'Return 1 week for next EPAT session.' : 'Complete series; return 4 weeks to assess overall response.'}

CPT: 0101T/0102T`;
        return plan;
      }

      // ==========================================
      // E&M VISIT (NO PROCEDURE)
      // ==========================================
      
      // Status assessment
      let status = '';
      if (p.findings.improved) status = 'improving with current treatment';
      else if (p.findings.worse) status = 'worsening despite conservative care';
      else if (p.findings.unchanged) status = 'unchanged/persistent';
      else status = 'ongoing';
      
      plan = `ASSESSMENT: Plantar fasciitis, ${lat}${ischronic ? ', chronic' : ''} (M72.2)

SUBJECTIVE: 
Patient with plantar fasciitis of ${dur} duration presents for ${p.findings.improved ? 'follow-up, reports improvement' : p.findings.worse ? 'follow-up, reports inadequate relief' : 'evaluation'}. ${failedTx.length > 0 ? `Has trialed ${failedTx.join(', ')}.` : ''} ${/first\s*step|morning/i.test(input.text) ? 'Reports characteristic first-step pain.' : ''}

OBJECTIVE:
- Tenderness: Medial calcaneal tubercle at plantar fascial origin
- Windlass test: [Positive/Negative]
- Gastroc/soleus flexibility: [Tight/Normal]
- Gait: [Antalgic/Normal]

CLINICAL ASSESSMENT:
Plantar fasciitis, ${status}. ${p.findings.worse || ischronic ? 'Given inadequate response to conservative measures, escalation of treatment is warranted.' : p.findings.improved ? 'Continue current management.' : 'Continue conservative management with close follow-up.'}

PLAN:
`;

      // Injection offered but not done
      if (p.planned.injection) {
        plan += `
Injection Discussion:
Corticosteroid injection discussed as option given ${ischronic ? 'chronic symptoms' : 'persistent pain'}. Risks (infection, fat pad atrophy, fascia rupture, skin changes) and benefits (anti-inflammatory effect, pain reduction) reviewed. ${/consider|think/i.test(input.text) ? 'Patient will consider and call to schedule if desired.' : 'Patient agreeable; to schedule.'}
`;
      }

      // Injection declined
      if (p.declined.injection) {
        plan += `
Injection Discussion:
Corticosteroid injection offered given inadequate conservative response. Patient declines/defers at this time, preferring to continue conservative measures. Option remains available.
`;
      }

      // EPAT offered
      if (p.planned.epat) {
        plan += `
EPAT/Shockwave Therapy:
Given chronic symptoms (>12 weeks) with inadequate conservative response, EPAT shockwave therapy discussed. Evidence-based treatment for recalcitrant plantar fasciitis. Series of 3-5 weekly sessions. Patient ${/start|schedul|begin/i.test(input.text) ? 'to schedule first session' : 'considering'}.
`;
      }

      // PT referral
      if (p.planned.pt) {
        plan += `
Physical Therapy:
Referral placed for supervised PT program including stretching, iontophoresis, manual therapy.
`;
      }

      // Orthotics
      if (p.planned.orthotics) {
        plan += `
Custom Orthotics:
OTC supports have been inadequate. Custom functional orthotics ordered to address biomechanical factors. Casting performed today.
`;
      }

      // Conservative measures
      plan += conservativeRecs;
      
      // Add NSAID reasoning if applicable
      if (nsaidReasoning) {
        plan += `

Note: ${nsaidReasoning}`;
      }

      // Follow-up
      plan += `

FOLLOW-UP: Return ${ischronic || p.findings.worse ? '3-4 weeks' : '4-6 weeks'} for reassessment. Call sooner if worsening.
`;

      // MDM for E&M visit
      const riskLevel = hasContraindication ? 'Moderate (prescription drug management with consideration of drug interactions/contraindications)' : 
                        p.planned.injection ? 'Moderate (prescription management, procedure discussion)' : 
                        'Low (OTC medications, supportive care)';
      const mdmLevel = ischronic || p.planned.injection || p.findings.worse || hasContraindication ? '99214' : '99213';
      
      plan += `
---
MEDICAL DECISION MAKING:
• Problem: ${ischronic ? 'Chronic illness with exacerbation' : 'Acute uncomplicated illness'}
• Data: History, clinical examination, assessment of treatment response${hasContraindication ? ', review of medication interactions' : ''}
• Risk: ${riskLevel}
• Level: ${mdmLevel}`;

      return plan;
    }
  },

  'diabetic-foot': {
    name: 'Diabetic Foot Care',
    code: 'G0245',
    dotPhrase: '.df',
    patterns: [/diabet/i, /dm\s*(1|2|type)/i, /neuropath/i, /lops/i, /monofilament/i, /a1c/i, /cdfe/i],
    generate: (input) => {
      const p = parseInput(input.text);
      const hasLOPS = p.findings.lops || /lops|absent|diminish.*sens/i.test(input.text);
      const hasPVD = p.findings.pvd;
      const hasDeformity = p.findings.deformity;
      const a1c = p.values.a1c;
      
      // Risk factors
      let riskFactors = [];
      if (hasLOPS) riskFactors.push('LOPS');
      if (hasPVD) riskFactors.push('PAD');
      if (hasDeformity) riskFactors.push('deformity');
      if (/ulcer.*h(x|istory)|prior.*ulcer/i.test(input.text)) riskFactors.push('ulcer history');
      if (/amputation|amp.*h(x|istory)/i.test(input.text)) riskFactors.push('amputation history');
      
      const riskLevel = riskFactors.length === 0 ? 'low' : riskFactors.length === 1 ? 'moderate' : 'high';
      const followup = riskLevel === 'low' ? '6 months' : riskLevel === 'moderate' ? '3-4 months' : '1-2 months';
      
      // Determine if nail/callus care was performed (separate procedure)
      const didNailCare = p.procedures.nails || p.procedures.debridement;
      
      // Check if injection done for separate problem (true Mod 25)
      const didInjectionSeparate = p.procedures.injection && p.separateProblem;
      
      let plan = `COMPREHENSIVE DIABETIC FOOT EXAMINATION

DIAGNOSIS: 
- Type ${/type\s*1|dm\s*1|t1dm/i.test(input.text) ? '1' : '2'} diabetes mellitus with diabetic polyneuropathy (E11.42)
- ${hasLOPS ? 'Loss of protective sensation (LOPS)' : 'Protective sensation intact'}
${a1c ? `- A1c: ${a1c}%` : ''}

RISK CLASSIFICATION: ${riskLevel.toUpperCase()} (${riskFactors.length > 0 ? riskFactors.join(', ') : 'no high-risk features'})

EXAMINATION FINDINGS:

Neurological:
- Semmes-Weinstein 5.07 monofilament: ${hasLOPS ? 'Unable to perceive at ≥1 site - LOPS confirmed' : 'Intact at all sites bilaterally'}
- Vibratory sense: ${hasLOPS ? 'Diminished' : 'Intact'}
- Protective sensation: ${hasLOPS ? 'ABSENT' : 'PRESENT'}

Vascular:
- DP pulses: ${hasPVD ? 'Diminished/absent' : 'Palpable'} bilaterally
- PT pulses: ${hasPVD ? 'Diminished/absent' : 'Palpable'} bilaterally
- Capillary refill: ${hasPVD ? 'Delayed' : 'Normal'}

Dermatologic:
- Skin integrity: ${/dry|crack|fissure/i.test(input.text) ? 'Xerosis with fissuring' : /intact/i.test(input.text) ? 'Intact' : '[document]'}
- Hyperkeratoses: ${/callus/i.test(input.text) ? 'Present - [locations]' : 'None significant'}
- Interdigital: [Intact/macerated]

Nails:
- ${/onych|fungal|thick|dystroph/i.test(input.text) ? 'Onychomycosis/dystrophic changes present' : 'No significant pathology'}

Musculoskeletal:
- Deformities: ${hasDeformity ? '[HAV/hammertoes/Charcot/other]' : 'None significant'}
- Prominent met heads: [Yes/No]

PLAN:
`;

      // Nail/callus care performed
      if (didNailCare) {
        plan += `
Debridement Performed:
${p.procedures.nails ? '- Mycotic/dystrophic nails trimmed and debrided' : ''}
${/callus/i.test(input.text) || p.procedures.debridement ? '- Hyperkeratotic lesions debrided to reduce pressure points' : ''}
- Sites: [document]
- CPT: 11720/11721 (nails) and/or 11055-11057 (calluses)
`;
      }

      // Diabetic shoes
      if (hasLOPS || p.planned.diabetic_shoes) {
        plan += `
Therapeutic Footwear:
${hasLOPS ? 'Patient QUALIFIES for diabetic shoes based on documented LOPS.' : ''}
${p.planned.diabetic_shoes || hasLOPS ? '- Rx provided for therapeutic shoes (A5500) with custom inserts (A5512/A5513)' : '- Does not meet criteria at this time'}
`;
      }

      // Patient education
      plan += `
Patient Education:
- Daily foot inspection - use mirror for plantar surface
- Never walk barefoot
- Check shoes for foreign objects before wearing
- Moisturize feet daily (not between toes)
- Proper nail care (straight across, not too short)
- Report any wounds, color changes, or new symptoms immediately
${a1c && parseFloat(a1c) > 8 ? '- Glycemic control discussed - A1c above goal' : ''}

FOLLOW-UP: Return in ${followup} for diabetic foot surveillance.

BILLING: ${hasLOPS ? 'G0245' : 'G0246'} (Diabetic foot exam, ${hasLOPS ? 'LOPS present' : 'low risk'})`;

      // If injection done for SEPARATE problem (true Modifier 25)
      if (didInjectionSeparate) {
        plan += `

---
SEPARATE PROCEDURE:
Corticosteroid injection also performed today for [separate diagnosis - e.g., plantar fasciitis]. This is a distinct problem from the diabetic foot examination. See separate procedure note.
Modifier 25 applicable to G0245/G0246 for separate E&M.`;
      }

      return plan;
    }
  },

  'wound-care': {
    name: 'Wound Care/DFU',
    code: 'L97.519',
    dotPhrase: '.wc',
    patterns: [/ulcer/i, /wound/i, /dfu/i, /debride/i, /granulat/i, /slough/i, /eschar/i, /wagner/i],
    generate: (input) => {
      const p = parseInput(input.text);
      const lat = p.laterality || '[LEFT/RIGHT]';
      const dims = p.values.woundSize;
      const wagner = p.values.wagner || '[X]';
      
      let size = '[L] x [W] x [D] cm';
      let sa = '[X.X]';
      if (dims) {
        size = `${dims[1]} x ${dims[2]}${dims[3] ? ` x ${dims[3]}` : ''} cm`;
        sa = (parseFloat(dims[1]) * parseFloat(dims[2])).toFixed(1);
      }

      // Location
      let location = '[anatomic location]';
      if (/1st|first|hallux|great\s*toe/i.test(input.text)) location = 'plantar 1st metatarsal head';
      else if (/5th|fifth/i.test(input.text)) location = 'lateral 5th metatarsal';
      else if (/heel|calcan/i.test(input.text)) location = 'plantar heel';
      else if (/mall?eol/i.test(input.text)) location = 'malleolar';

      let plan = `WOUND CARE VISIT

DIAGNOSIS: Diabetic foot ulcer, ${location}, ${lat}, Wagner Grade ${wagner} (L97.5XX, E11.621)

WOUND ASSESSMENT:
- Location: ${location}, ${lat}
- Measurements: ${size} (Surface area: ${sa} cm²)
- Wound bed: ${/granul/i.test(input.text) ? 'Granulation tissue' : ''}${/slough/i.test(input.text) ? 'Slough present' : ''}${/eschar/i.test(input.text) ? 'Eschar present' : ''}${!/granul|slough|eschar/i.test(input.text) ? '[describe tissue type]' : ''}
- Drainage: ${/drain|exud/i.test(input.text) ? '[type/amount]' : 'Minimal'}
- Periwound: ${/macer/i.test(input.text) ? 'Macerated' : /erythema/i.test(input.text) ? 'Erythematous' : 'Intact'}
- Infection signs: ${p.findings.infection ? 'PRESENT - [describe]' : 'None'}
- Trajectory: ${p.findings.improved ? 'IMPROVING' : p.findings.worse ? 'DETERIORATING' : p.findings.unchanged ? 'STATIC' : '[document]'}

`;

      // Debridement performed
      if (p.procedures.debridement) {
        plan += `DEBRIDEMENT PERFORMED:
Selective sharp debridement of devitalized tissue.
- Indication: ${/slough/i.test(input.text) ? 'Slough' : ''}${/eschar/i.test(input.text) ? 'Eschar' : ''}${/callus/i.test(input.text) ? 'Callused wound margins' : 'Nonviable tissue'} impeding wound healing
- Technique: Sharp excision with #15 blade, curette as needed
- Tissue removed: Devitalized tissue, slough, senescent wound edges
- Post-debridement wound bed: Viable, bleeding granular base
- Post-debridement size: [document]
- Hemostasis achieved

CPT: 97597 (first 20 cm²)${parseFloat(sa) > 20 ? ', 97598 (additional 20 cm²)' : ''}
`;
      }

      // Dressing
      plan += `
WOUND CARE:
- Wound cleansed with ${/vashe/i.test(input.text) ? 'Vashe wound solution' : 'normal saline'}
- Primary dressing: ${/alginate/i.test(input.text) ? 'Calcium alginate' : /foam/i.test(input.text) ? 'Foam' : /collagen/i.test(input.text) ? 'Collagen matrix' : '[appropriate dressing]'}
- Secondary dressing: [gauze/ABD pad/wrap]
- Change frequency: ${p.findings.infection ? 'Daily' : 'Every 2-3 days'}

OFFLOADING:
- Device: ${/tcc/i.test(input.text) ? 'Total contact cast' : /cam|boot/i.test(input.text) ? 'CAM walker' : '[offloading device]'}
- Compliance counseled - critical for healing
`;

      // Infection
      if (p.findings.infection) {
        plan += `
INFECTION MANAGEMENT:
- Clinical infection identified
- ${/culture/i.test(input.text) ? 'Wound culture obtained' : 'Consider wound culture'}
- Antibiotic: [empiric/based on culture]
- Close follow-up for infection response
`;
      }

      // Static/deteriorating wound
      if (p.findings.unchanged || p.findings.worse) {
        plan += `
HEALING CONCERNS:
Wound ${p.findings.worse ? 'deteriorating' : 'static without expected progress'}. Consider:
- Reassess offloading compliance
- Vascular status (if not recently evaluated)
- Advanced modalities: cellular/tissue products, NPWT, HBO evaluation
`;
      }

      plan += `
FOLLOW-UP: Return ${p.findings.infection ? '3-5 days' : '1-2 weeks'} for wound reassessment${p.procedures.debridement ? ' and serial debridement as needed' : ''}.`;

      return plan;
    }
  },

  'injection': {
    name: 'Corticosteroid Injection',
    code: '20550',
    dotPhrase: '.csi',
    patterns: [/inject/i, /steroid/i, /cortico/i, /shot/i, /kenalog/i, /depo/i, /celestone/i, /dexameth/i],
    generate: (input) => {
      const p = parseInput(input.text);
      const prefs = input.prefs || DEFAULT_PREFERENCES;
      const lat = p.laterality || '[LEFT/RIGHT]';
      const injNum = p.values.injNum;
      const hasContraindication = p.contraindications.anticoagulant || p.contraindications.nsaidAllergy || p.contraindications.giIssues || p.contraindications.kidneyIssues;
      
      // Determine target and details
      let target = '[target structure]';
      let indication = '[condition]';
      let approach = '[approach]';
      let cpt = '20550';
      let recType = 'general';
      
      if (/plantar\s*fasc|pf\b|heel/i.test(input.text)) {
        target = 'plantar fascia origin';
        indication = 'plantar fasciitis';
        approach = 'medial approach to fascial enthesis';
        recType = 'plantarFasciitis';
      } else if (/neuroma|morton/i.test(input.text)) {
        target = 'intermetatarsal space';
        indication = "Morton's neuroma";
        approach = 'dorsal approach to interspace';
        cpt = '64455';
      } else if (/1st\s*mtp|big\s*toe.*joint|hallux.*(rigidus|arthr)/i.test(input.text)) {
        target = '1st MTP joint';
        indication = 'hallux rigidus/1st MTP arthritis';
        approach = 'dorsomedial approach';
        cpt = '20600';
      } else if (/ankle/i.test(input.text)) {
        target = 'ankle joint';
        indication = 'ankle arthritis/synovitis';
        approach = 'anteromedial approach';
        cpt = '20605';
      } else if (/subtalar|stj|sinus\s*tarsi/i.test(input.text)) {
        target = 'subtalar joint';
        indication = 'subtalar arthritis';
        approach = 'sinus tarsi approach';
        cpt = '20605';
      } else if (/tarsal\s*tunnel/i.test(input.text)) {
        target = 'tarsal tunnel';
        indication = 'tarsal tunnel syndrome';
        approach = 'posteromedial approach';
      } else if (/bursa|retrocalc/i.test(input.text)) {
        target = 'retrocalcaneal bursa';
        indication = 'retrocalcaneal bursitis';
        approach = 'lateral approach';
      }
      
      const conservativeRecs = getConservativeRecs(recType, p.contraindications, prefs);
      const nsaidReasoning = getNSAIDReasoning(p.contraindications);

      // PROCEDURE NOTE (injection performed)
      if (p.procedures.injection) {
        return `PROCEDURE: Corticosteroid Injection, ${target}, ${lat}

DIAGNOSIS: ${indication}, ${lat}

INDICATION FOR INJECTION:
${indication} with inadequate response to conservative management. Injection indicated for anti-inflammatory effect at site of pathology.

CONSENT:
Risks discussed: infection, bleeding, allergic reaction, skin depigmentation, fat pad atrophy, tendon/fascia weakening, post-injection flare, incomplete/temporary relief${/diabet/i.test(input.text) ? ', hyperglycemia' : ''}.
Benefits discussed: targeted anti-inflammatory effect, pain reduction.
Patient understands and consents.

PROCEDURE:
- Timeout performed, correct patient/site/procedure confirmed
- Site: ${target}, ${lat}
- Prep: Chloraprep/alcohol, allowed to dry
- Needle: ${prefs.injection.needle}
- Medication: ${prefs.injection.steroidVolume} ${prefs.injection.steroid} + ${prefs.injection.anestheticVolume} ${prefs.injection.anesthetic}
- Approach: ${approach}
- Aspiration negative for blood
- Medication injected without resistance
- Patient tolerated well, no immediate complications
- Bandage applied

Injection #${injNum} to this site.${parseInt(injNum) >= prefs.injection.maxInjectionsPerSite ? ' Patient counseled regarding diminishing returns with repeated injections.' : ''}

POST-PROCEDURE INSTRUCTIONS:
- Rest 48-72 hours, avoid strenuous activity
- Ice 15-20 min PRN for injection site discomfort  
- Local numbness expected 2-4 hours (lidocaine effect)
- Possible flare days 1-2, will resolve
- Call if: increasing pain, fever, spreading redness, drainage
${p.contraindications.diabetic ? '- DIABETIC: Monitor blood glucose 48-72 hours - may see temporary elevation' : ''}
${conservativeRecs}

FOLLOW-UP: Return ${prefs.followUp.postInjection} to assess injection response.

CPT: ${cpt}`;
      }

      // E&M NOTE (injection discussed but not done)
      if (p.planned.injection || p.declined.injection) {
        return `ASSESSMENT: ${indication}, ${lat}

CLINICAL NOTE:
Patient presents for evaluation of ${indication}. ${p.findings.chronic ? 'Chronic symptoms with' : 'Symptoms with'} inadequate response to conservative care.

Corticosteroid injection to ${target} ${p.declined.injection ? 'was offered but patient declines/defers at this time, preferring continued conservative management' : 'is recommended given persistent symptoms'}. ${!p.declined.injection ? 'Risks (infection, tissue atrophy, skin changes, incomplete relief) and benefits discussed.' : ''} ${p.declined.injection ? 'Injection remains available if symptoms persist.' : 'Patient to schedule if agreeable.'}

PLAN:
${conservativeRecs}
${nsaidReasoning ? `\nNote: ${nsaidReasoning}` : ''}

FOLLOW-UP: Return 4-6 weeks for reassessment. Injection available if desired.

---
MEDICAL DECISION MAKING:
• Problem: ${p.findings.chronic ? 'Chronic illness' : 'Acute illness'} with treatment planning
• Data: Clinical examination, conservative treatment assessment${hasContraindication ? ', medication interaction review' : ''}
• Risk: ${hasContraindication ? 'Moderate (prescription management with drug interaction considerations)' : 'Moderate (prescription management, procedure consideration)'}
• Level: 99213-99214`;
      }

      // Fallback
      return `ASSESSMENT: ${indication}, ${lat}

Injection evaluation. Document indication and whether performed/planned/declined.`;
    }
  },

  'achilles': {
    name: 'Achilles Tendinitis',
    code: 'M76.60',
    dotPhrase: '.at',
    patterns: [/achilles/i, /tendo.?achilles/i, /at\b.*tendin/i, /posterior\s*heel/i, /heel\s*cord/i],
    generate: (input) => {
      const p = parseInput(input.text);
      const prefs = input.prefs || DEFAULT_PREFERENCES;
      const lat = p.laterality || '[LEFT/RIGHT]';
      const isInsertional = /insert/i.test(input.text);
      const ischronic = p.findings.chronic;
      const isProcedure = p.procedures.epat;
      const hasContraindication = p.contraindications.anticoagulant || p.contraindications.nsaidAllergy || p.contraindications.giIssues || p.contraindications.kidneyIssues;
      
      const conservativeRecs = getConservativeRecs('achilles', p.contraindications, prefs);
      const nsaidReasoning = getNSAIDReasoning(p.contraindications);

      // EPAT PROCEDURE NOTE
      if (isProcedure) {
        const session = p.values.epatNum;
        return `PROCEDURE: EPAT (Extracorporeal Pulse Activation Technology), ${lat} Achilles Tendon

DIAGNOSIS: Achilles tendinopathy, ${isInsertional ? 'insertional' : 'non-insertional'}, ${lat}, chronic (M76.60)

INDICATION FOR EPAT:
Chronic Achilles tendinopathy (>12 weeks) with inadequate response to conservative management including eccentric loading protocol, heel lifts, activity modification, and physical therapy. EPAT indicated for recalcitrant tendinopathy.

NOTE: Corticosteroid injection is CONTRAINDICATED for Achilles tendinopathy due to rupture risk - not offered.

PROCEDURE:
- Session #${session} of treatment series
- Treatment area: ${isInsertional ? 'Achilles insertion at calcaneus' : 'Mid-substance Achilles, zone of maximum tenderness'}
- Coupling gel applied
- EPAT delivered per protocol
- Patient tolerated treatment

POST-PROCEDURE:
- Mild discomfort expected 24-48 hours
- Avoid NSAIDs 24 hours post-treatment
- May ice for comfort
${conservativeRecs}

FOLLOW-UP: ${parseInt(session) < 5 ? 'Return 1 week for next EPAT session.' : 'Series complete; return 4 weeks to assess response.'}

CPT: 0101T/0102T`;
      }

      // E&M NOTE
      let plan = `ASSESSMENT: Achilles tendinitis/tendinopathy, ${isInsertional ? 'insertional' : 'non-insertional'}, ${lat}${ischronic ? ', chronic' : ''} (M76.60)

EXAMINATION:
- Tenderness: ${isInsertional ? 'At calcaneal insertion' : '2-6 cm proximal to insertion (mid-substance)'}
- Thickening: ${/thick|swell/i.test(input.text) ? 'Present' : '[document]'}
- Thompson test: Negative (no complete rupture)
- Pain with resisted plantarflexion: [Yes/No]

CLINICAL NOTE:
${isInsertional ? 'Insertional' : 'Non-insertional'} Achilles tendinopathy. ${ischronic ? 'Chronic symptoms indicating tendinosis (degenerative) rather than tendinitis (inflammatory).' : ''} ${p.findings.improved ? 'Showing improvement with current regimen.' : p.findings.worse ? 'Worsening despite conservative care - escalation needed.' : ''}

**Corticosteroid injection is CONTRAINDICATED for Achilles tendinopathy due to significant rupture risk - not offered.**

PLAN:
`;

      if (p.planned.epat) {
        plan += `
EPAT/Shockwave Therapy:
Given ${ischronic ? 'chronic tendinopathy' : 'refractory symptoms'}, EPAT recommended. Series of 3-5 weekly sessions. Patient to schedule.
`;
      }

      if (p.planned.mri) {
        plan += `
Imaging:
MRI ordered to evaluate extent of tendinosis, rule out partial tear.
`;
      }

      if (p.planned.pt) {
        plan += `
Physical Therapy:
Referral for supervised eccentric loading program and modalities.
`;
      }

      plan += conservativeRecs;
      
      if (nsaidReasoning) {
        plan += `

Note: ${nsaidReasoning}`;
      }

      const riskLevel = hasContraindication ? 'Moderate (prescription management with drug interaction considerations)' : 'Low-Moderate';

      plan += `

FOLLOW-UP: Return ${p.planned.epat ? '1 week for EPAT' : '4-6 weeks'} for reassessment.

---
MEDICAL DECISION MAKING:
• Problem: ${ischronic ? 'Chronic illness' : 'Acute illness'}
• Data: Clinical examination${p.planned.mri ? ', imaging ordered' : ''}${hasContraindication ? ', medication review' : ''}
• Risk: ${riskLevel}
• Level: ${ischronic || p.findings.worse || hasContraindication ? '99214' : '99213'}`;

      return plan;
    }
  },

  'hallux-valgus': {
    name: 'Hallux Valgus (Bunion)',
    code: 'M20.10',
    dotPhrase: '.hv',
    patterns: [/hallux\s*valgus/i, /bunion/i, /hva\s*\d/i, /ima\s*\d/i],
    generate: (input) => {
      const p = parseInput(input.text);
      const lat = p.laterality || '[LEFT/RIGHT]';
      const hva = p.values.hva;
      const ima = p.values.ima;
      
      let severity = 'mild';
      if (hva && parseInt(hva) > 40) severity = 'severe';
      else if (hva && parseInt(hva) >= 20) severity = 'moderate';

      let plan = `ASSESSMENT: Hallux valgus, ${lat}, ${severity} (M20.10)
${hva ? `- HVA: ${hva}° (normal <15°)` : '- HVA: [measure]'}
${ima ? `- IMA: ${ima}° (normal <9°)` : '- IMA: [measure]'}

EXAMINATION:
- Medial eminence: Prominent
- Hallux position: Laterally deviated
- 1st MTP ROM: [document]
- Pain: ${/pain/i.test(input.text) ? 'Present over medial eminence' : '[document]'}

CLINICAL ASSESSMENT:
${severity.charAt(0).toUpperCase() + severity.slice(1)} hallux valgus deformity. ${p.findings.worse || /fail|inad/i.test(input.text) ? 'Conservative measures have provided inadequate relief.' : ''}

PLAN:
`;

      // Surgical discussion
      if (p.planned.surgery && !p.declined.surgery) {
        plan += `
Surgical Discussion:
Given ${severity} deformity with persistent symptoms despite conservative care, surgical correction discussed.
- Procedure: ${severity === 'severe' || (ima && parseInt(ima) > 15) ? 'Lapidus bunionectomy' : severity === 'moderate' ? 'Scarf or Chevron osteotomy' : 'Distal osteotomy'}
- Risks reviewed: infection, nerve damage, recurrence, hardware issues, DVT, stiffness
- Recovery: ${severity === 'severe' ? '6-8 weeks protected WB' : '4-6 weeks surgical shoe'}
- Patient ${/proceed|book|schedul|consent/i.test(input.text) ? 'agrees to proceed - to schedule' : 'considering'}
`;
      }

      if (p.declined.surgery) {
        plan += `
Surgical Discussion:
Surgical correction offered for symptomatic deformity. Patient declines at this time, preferring conservative management. Option remains available.
`;
      }

      // Conservative
      plan += `
Conservative Management:
- Wide toe box footwear to accommodate deformity
- Bunion padding/spacer to reduce medial eminence pressure
- ${p.planned.orthotics ? 'Custom orthotics ordered' : 'Consider orthotics if biomechanical component'}
- NSAIDs PRN for acute discomfort
- Activity modification as needed

FOLLOW-UP: Return ${p.planned.surgery && !p.declined.surgery ? 'for pre-op/surgery' : '6-8 weeks'}.
`;

      // MDM for E&M
      if (!p.procedures.injection) {
        plan += `
---
MEDICAL DECISION MAKING:
• Problem: Chronic structural condition
• Data: Clinical and radiographic evaluation${p.planned.surgery ? ', surgical planning' : ''}
• Risk: ${p.planned.surgery ? 'Moderate (surgical decision-making)' : 'Low'}
• Level: ${p.planned.surgery ? '99214' : '99213'}`;
      }

      return plan;
    }
  },

  'orthotics': {
    name: 'Custom Orthotics',
    code: 'L3000',
    dotPhrase: '.ortho',
    patterns: [/custom\s*orthot/i, /orthotic/i, /biomech/i, /pes\s*planus/i, /flat\s*f(oo|ee)t/i, /prona/i, /cast.*orthot/i],
    generate: (input) => {
      const p = parseInput(input.text);
      
      // Indications
      let indication = '[primary condition]';
      if (/plantar\s*fasc|pf\b|heel\s*pain/i.test(input.text)) indication = 'plantar fasciitis';
      else if (/pes\s*planus|flat/i.test(input.text)) indication = 'pes planus';
      else if (/pttd|posterior\s*tib/i.test(input.text)) indication = 'posterior tibial tendon dysfunction';
      else if (/metatarsalgia/i.test(input.text)) indication = 'metatarsalgia';

      // Dispensing visit
      if (p.procedures.dispense_ortho) {
        return `ORTHOTIC DISPENSING

DIAGNOSIS: ${indication}

ORTHOTIC DISPENSING:
Custom functional foot orthotics dispensed today.
- Fit: Verified satisfactory
- Devices match prescription specifications
- Posting and modifications as ordered

PATIENT EDUCATION:
- Break-in protocol: 2 hours Day 1, add 1 hour each day until full-time wear
- Wear only with supportive, lace-up athletic or dress shoes
- Expected adjustment period: 1-2 weeks
- Minor muscle soreness is normal during adaptation
- Call if: blistering, hot spots, increased pain

FOLLOW-UP: Return 2-3 weeks for fit check, sooner if problems.

CPT: L3000 (dispensing)`;
      }

      // Casting/ordering visit
      if (p.planned.orthotics) {
        return `CUSTOM ORTHOTIC PRESCRIPTION

DIAGNOSIS: ${indication}

MEDICAL NECESSITY:
Patient has trialed OTC arch supports/inserts for ${p.values.duration || '[duration]'} with inadequate relief. Custom devices required due to:
- Patient-specific biomechanical abnormalities not addressed by OTC
- ${/planus|flat|prona/i.test(input.text) ? 'Pes planus with overpronation' : /cavus/i.test(input.text) ? 'Pes cavus' : 'Biomechanical pathology'} contributing to symptoms
- Inadequate symptom control with prefabricated devices

BIOMECHANICAL FINDINGS:
- Foot type: ${/planus|flat/i.test(input.text) ? 'Pes planus' : /cavus/i.test(input.text) ? 'Pes cavus' : '[document]'}
- RCSP: [varus/valgus/neutral]
- Forefoot position: [varus/valgus/neutral]
- Gait: ${/prona/i.test(input.text) ? 'Overpronation observed' : '[document]'}

CASTING:
Neutral suspension cast / foam impression obtained today.

PRESCRIPTION:
- Device: Custom functional foot orthotic
- Shell: Semi-rigid (polypropylene/carbon composite)
- Posting: Per biomechanical findings
- Top cover: Standard
- Modifications: ${/fasc/i.test(input.text) ? 'Fascial groove, deep heel cup' : '[as indicated]'}

Rx sent to lab. Expected fabrication: 2-3 weeks.

FOLLOW-UP: Return 2-3 weeks for dispensing and fitting.

CPT: L3000 (custom orthotic by casting) - billed at dispensing`;
      }

      // Evaluation only
      return `ORTHOTIC EVALUATION

DIAGNOSIS: ${indication}

ASSESSMENT:
Patient evaluated for orthotic therapy. 

PLAN:
- Trial OTC arch supports x 4-6 weeks first
- If inadequate, will advance to custom orthotics
- Biomechanical findings documented for future reference

FOLLOW-UP: Return 4-6 weeks to assess response to OTC support.`;
    }
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
function detectCondition(text) {
  let best = null;
  let bestScore = 0;
  for (const [key, cond] of Object.entries(CONDITIONS)) {
    let score = 0;
    for (const pattern of cond.patterns) {
      if (pattern.test(text)) score += 10;
    }
    if (score > bestScore) {
      bestScore = score;
      best = { key, ...cond };
    }
  }
  return bestScore >= 10 ? best : null;
}

function parseDotPhrase(input) {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');
  const condition = Object.values(CONDITIONS).find(c => c.dotPhrase === cmd);
  if (!condition) return null;
  return { condition, data: { text: args + ' ' + cmd, laterality: /\bleft|lt\b/i.test(args) ? 'left' : /\bright|rt\b/i.test(args) ? 'right' : /bilat/i.test(args) ? 'bilateral' : null }};
}

// ============================================
// MAIN APP
// ============================================
export default function NewtownMDM() {
  const [mounted, setMounted] = useState(false);
  const [themeMode, setThemeMode] = useState('light');
  const [mode, setMode] = useState('smart');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [detected, setDetected] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const theme = THEMES[themeMode];
  const recognitionRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setThemeMode(window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Load saved preferences and check onboarding status
    if (typeof window !== 'undefined') {
      const onboardingComplete = localStorage.getItem('mdm-onboarding-complete');
      const saved = localStorage.getItem('mdm-preferences');
      
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
        } catch (e) {
          console.error('Failed to load preferences');
        }
      }
      
      // Show onboarding if not completed
      if (!onboardingComplete) {
        setShowOnboarding(true);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        setVoiceSupported(true);
        const recognition = new SR();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (e) => {
          let transcript = '';
          for (let i = 0; i < e.results.length; i++) transcript += e.results[i][0].transcript;
          setInput(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  useEffect(() => {
    if (mode === 'smart' && input.length > 10) {
      const det = detectCondition(input);
      setDetected(det);
      const p = parseInput(input);
      setParsed(p);
      if (det) setOutput(det.generate({ text: input, laterality: p.laterality, prefs: preferences }));
      else setOutput('');
    } else if (mode === 'terminal' && input.startsWith('.')) {
      const cmdPart = input.split(' ')[0].toLowerCase();
      setSuggestions(Object.values(CONDITIONS).filter(c => c.dotPhrase.startsWith(cmdPart)));
      const parsedCmd = parseDotPhrase(input);
      if (parsedCmd) {
        setDetected({ name: parsedCmd.condition.name, code: parsedCmd.condition.code });
        setOutput(parsedCmd.condition.generate({ ...parsedCmd.data, prefs: preferences }));
      }
    } else {
      setDetected(null);
      setParsed(null);
      setOutput('');
      setSuggestions([]);
    }
  }, [input, mode, preferences]);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) recognitionRef.current.stop();
    else { setInput(''); recognitionRef.current.start(); setIsListening(true); }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput(''); setOutput(''); setDetected(null); setParsed(null); setSuggestions([]);
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); }
  };

  const btnStyle = (active, color = theme.primary) => ({
    minHeight: 44, padding: '10px 16px', background: active ? color : theme.card,
    border: `1px solid ${active ? color : theme.border}`, borderRadius: 10,
    color: active ? '#fff' : theme.textSecondary, fontSize: 14, fontWeight: 600,
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
  });

  const renderParsedBadges = () => {
    if (!parsed) return null;
    const badges = [];
    Object.entries(parsed.procedures).forEach(([k, v]) => v && badges.push({ label: k.replace(/_/g, ' '), type: 'proc' }));
    Object.entries(parsed.planned).forEach(([k, v]) => v && badges.push({ label: k.replace(/_/g, ' '), type: 'plan' }));
    Object.entries(parsed.declined).forEach(([k, v]) => v && badges.push({ label: `no ${k}`, type: 'decline' }));
    if (parsed.contraindications?.anticoagulant) badges.push({ label: 'on anticoagulant', type: 'contra' });
    if (parsed.contraindications?.diabetic) badges.push({ label: 'diabetic', type: 'info' });
    if (parsed.separateProblem) badges.push({ label: 'separate problem', type: 'mod25' });
    if (!badges.length) return null;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
        {badges.slice(0, 10).map((b, i) => (
          <span key={i} style={{
            fontSize: 10, padding: '3px 7px', borderRadius: 5,
            background: b.type === 'proc' ? theme.successFaded : b.type === 'decline' ? theme.dangerFaded : b.type === 'mod25' ? '#FEF3C7' : b.type === 'contra' ? '#FEE2E2' : b.type === 'info' ? '#E0F2FE' : theme.primaryFaded,
            color: b.type === 'proc' ? theme.success : b.type === 'decline' ? theme.danger : b.type === 'mod25' ? '#D97706' : b.type === 'contra' ? '#DC2626' : b.type === 'info' ? '#1E7AB3' : theme.primary
          }}>{b.type === 'proc' ? '⚡' : b.type === 'decline' ? '✗' : b.type === 'mod25' ? '25' : b.type === 'contra' ? '⚠️' : b.type === 'info' ? 'ℹ️' : '→'} {b.label}</span>
        ))}
      </div>
    );
  };

  if (!mounted) return <div style={{ minHeight: '100vh', background: '#0F172A' }} />;

  return (
    <>
      <Head>
        <title>MDM Workstation | Newtown Foot & Ankle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content={theme.bg} />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      
      <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', padding: 16 }}>
        <header style={{ maxWidth: 900, margin: '0 auto 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Newtown Foot & Ankle Logo */}
              <img 
                src="/logo.png" 
                alt="Newtown Foot & Ankle Specialists" 
                style={{ height: 50, width: 'auto' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button onClick={() => setShowPreferences(true)} style={{ ...btnStyle(false), padding: 10 }} title="Preferences">⚙️</button>
              <button onClick={() => setThemeMode(t => t === 'dark' ? 'light' : 'dark')} style={{ ...btnStyle(false), padding: 10 }}>{themeMode === 'dark' ? '☀️' : '🌙'}</button>
              <div style={{ display: 'flex', background: theme.cardAlt, borderRadius: 10, padding: 2 }}>
                <button onClick={() => { setMode('smart'); handleClear(); }} style={btnStyle(mode === 'smart')}>🧠 Smart</button>
                <button onClick={() => { setMode('terminal'); handleClear(); }} style={btnStyle(mode === 'terminal', theme.success)}>⚡ Terminal</button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>MDM Workstation</h1>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: theme.primaryFaded, color: theme.primary, fontWeight: 600 }}>✓ Audit-Ready</span>
              <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: theme.primaryFaded, color: theme.primary, fontWeight: 600 }}>✓ Medical Necessity</span>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 900, margin: '0 auto' }}>
          {mode === 'smart' && (
            <div style={{ background: theme.card, borderRadius: 14, border: `1px solid ${theme.border}`, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottom: `1px solid ${theme.border}`, background: theme.cardAlt, flexWrap: 'wrap', gap: 6 }}>
                <span style={{ color: theme.textSecondary, fontSize: 12 }}>Describe the visit - procedure note or E&M as appropriate</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {voiceSupported && <button onClick={toggleVoice} style={{ ...btnStyle(isListening, theme.danger), padding: '8px 10px', fontSize: 12 }}>🎤 {isListening ? 'Stop' : 'Voice'}</button>}
                  {input && <button onClick={handleClear} style={{ ...btnStyle(false), padding: '8px 10px', fontSize: 12 }}>Clear</button>}
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Examples:

PROCEDURE VISIT:
"Left heel pain 3 months failed conservative gave shot #2"

E&M VISIT (no procedure):
"Left plantar fasciitis chronic, declining injection, continue conservative"

SEPARATE PROBLEM (Modifier 25):
"DM foot exam, also injected left heel for separate PF"`}
                style={{ width: '100%', minHeight: 120, padding: 14, background: 'transparent', border: 'none', outline: 'none', color: theme.text, fontSize: 14, lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit' }}
              />
              {(detected || parsed) && (
                <div style={{ padding: 10, borderTop: `1px solid ${theme.border}`, background: theme.primaryFaded }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {detected && <><span style={{ color: theme.success }}>✓</span><span style={{ color: theme.primary, fontWeight: 600 }}>{detected.name}</span><span style={{ color: theme.textMuted, fontSize: 11, fontFamily: 'monospace' }}>{detected.code}</span></>}
                    {parsed?.laterality && <span style={{ background: theme.card, padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>{parsed.laterality}</span>}
                    {Object.values(parsed?.procedures || {}).some(v => v) && <span style={{ background: theme.successFaded, color: theme.success, padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>PROCEDURE</span>}
                    {!Object.values(parsed?.procedures || {}).some(v => v) && <span style={{ background: theme.primaryFaded, color: theme.primary, padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>E&M</span>}
                  </div>
                  {renderParsedBadges()}
                </div>
              )}
            </div>
          )}

          {mode === 'terminal' && (
            <div style={{ background: theme.card, borderRadius: 14, border: `1px solid ${theme.border}`, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: 14 }}>
                <span style={{ color: theme.success, marginRight: 8, fontWeight: 700, fontFamily: 'monospace' }}>❯</span>
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder=".pf left chronic gave shot" autoFocus
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: theme.text, fontSize: 15, fontFamily: 'monospace' }} />
              </div>
              {suggestions.length > 0 && !output && (
                <div style={{ borderTop: `1px solid ${theme.border}` }}>
                  {suggestions.map((s, i) => (
                    <div key={s.dotPhrase} onClick={() => setInput(s.dotPhrase + ' ')} style={{ padding: 10, cursor: 'pointer', background: i === 0 ? theme.successFaded : 'transparent' }}>
                      <span style={{ color: theme.success, fontWeight: 600, fontFamily: 'monospace' }}>{s.dotPhrase}</span>
                      <span style={{ color: theme.textMuted, marginLeft: 10, fontSize: 13 }}>{s.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {output && (
            <div style={{ background: theme.card, borderRadius: 14, border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottom: `1px solid ${theme.border}`, background: theme.cardAlt }}>
                <span style={{ color: theme.textSecondary, fontSize: 12 }}>
                  {Object.values(parsed?.procedures || {}).some(v => v) ? '⚡ Procedure Note' : '📋 E&M Note'}
                </span>
                <button onClick={handleCopy} style={{ ...btnStyle(copied, copied ? theme.success : theme.primary), padding: '8px 14px', fontSize: 12 }}>
                  {copied ? '✓ Copied!' : '📋 Copy to EMR'}
                </button>
              </div>
              <pre style={{ padding: 14, margin: 0, color: theme.text, fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-wrap', fontFamily: '"SF Mono", Menlo, monospace', maxHeight: 600, overflowY: 'auto' }}>
                {output}
              </pre>
            </div>
          )}

          {!output && mode === 'smart' && !input && (
            <div style={{ background: theme.card, borderRadius: 14, border: `1px solid ${theme.border}`, padding: 28, textAlign: 'center' }}>
              <div style={{ fontSize: 42, marginBottom: 12 }}>🎯</div>
              <div style={{ color: theme.text, fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Smart Billing Logic</div>
              <div style={{ color: theme.textMuted, fontSize: 13, maxWidth: 450, margin: '0 auto 16px' }}>
                <strong>Procedure?</strong> → Procedure note (no separate E&M)<br/>
                <strong>No procedure?</strong> → E&M note with MDM<br/>
                <strong>Separate problem?</strong> → Modifier 25 applicable
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {['gave shot', 'no injection', 'EPAT session', 'also injected for separate PF', 'debrided nails'].map(ex => (
                  <span key={ex} style={{ background: theme.cardAlt, border: `1px solid ${theme.border}`, color: theme.textMuted, fontSize: 11, padding: '5px 10px', borderRadius: 6 }}>{ex}</span>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer style={{ maxWidth: 900, margin: '16px auto 0', textAlign: 'center', color: theme.textMuted, fontSize: 10 }}>
          Newtown Foot & Ankle • Personalized MDM Documentation
          {preferences.clinicianName && <span> • {preferences.clinicianName}</span>}
        </footer>
        
        {/* Preferences Modal */}
        <PreferencesModal
          isOpen={showPreferences}
          onClose={() => setShowPreferences(false)}
          preferences={preferences}
          setPreferences={setPreferences}
          theme={theme}
        />
        
        {/* Onboarding Wizard */}
        {showOnboarding && (
          <OnboardingWizard
            onComplete={() => setShowOnboarding(false)}
            preferences={preferences}
            setPreferences={setPreferences}
            theme={theme}
          />
        )}
      </div>
    </>
  );
}

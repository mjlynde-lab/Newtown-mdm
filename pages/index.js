"use client";
import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

// ============================================
// THEME SYSTEM
// ============================================
const THEMES = {
  light: {
    name: 'light',
    bg: '#F8FAFC',
    bgAlt: '#FFFFFF',
    card: '#FFFFFF',
    cardAlt: '#F1F5F9',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    text: '#1E3A5F',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    primary: '#1E7AB3',
    primaryLight: '#2B9CD8',
    primaryFaded: '#E0F2FE',
    success: '#059669',
    successFaded: '#D1FAE5',
    warning: '#D97706',
    warningFaded: '#FEF3C7',
    danger: '#DC2626',
    dangerFaded: '#FEE2E2',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
  },
  dark: {
    name: 'dark',
    bg: '#0F172A',
    bgAlt: '#1E293B',
    card: '#1E293B',
    cardAlt: '#334155',
    border: '#334155',
    borderLight: '#475569',
    text: '#F1F5F9',
    textSecondary: '#CBD5E1',
    textMuted: '#64748B',
    primary: '#38BDF8',
    primaryLight: '#7DD3FC',
    primaryFaded: '#0C4A6E',
    success: '#34D399',
    successFaded: '#064E3B',
    warning: '#FBBF24',
    warningFaded: '#78350F',
    danger: '#F87171',
    dangerFaded: '#7F1D1D',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
  }
};

const BRAND = {
  navy: '#1E3A5F',
  blue: '#2B9CD8',
  blueLight: '#7CBCE8',
  bluePale: '#B8D4E8'
};

// ============================================
// NEWTOWN LOGO COMPONENT
// ============================================
const NewtownLogo = ({ theme, size = 'normal' }) => {
  const scale = size === 'small' ? 0.6 : size === 'large' ? 1.2 : 1;
  const isDark = theme.name === 'dark';
  
  return (
    <svg 
      width={60 * scale} 
      height={55 * scale} 
      viewBox="0 0 60 55" 
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M 8 8 Q 2 20, 8 35 Q 12 45, 18 50"
        stroke={isDark ? BRAND.blueLight : BRAND.blue}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 20 6 C 16 6, 14 10, 14 16 C 14 22, 15 28, 16 34 Q 17 40, 20 46 Q 22 50, 26 52 C 28 53, 30 52, 32 50 Q 36 46, 38 40 C 40 34, 40 28, 38 22 C 36 16, 32 10, 26 8 Q 23 6, 20 6Z"
        stroke={isDark ? '#F1F5F9' : BRAND.navy}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 22 18 Q 20 24, 21 30 Q 22 36, 26 40"
        stroke={isDark ? '#F1F5F9' : BRAND.navy}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

// ============================================
// CONDITIONS DATA
// ============================================
const CONDITIONS = {
  'plantar-fasciitis': {
    name: 'Plantar Fasciitis',
    code: 'M72.2',
    dotPhrase: '.pf',
    patterns: [/plantar\s*fasc/i, /heel\s*pain/i, /first\s*step/i, /morning.*(heel|pain)/i, /medial\s*(calcaneal|tubercle)/i, /windlass/i, /pf\b/i],
    generate: (data) => {
      const chronic = /chronic|months|>?\s*6\s*w|failed|persistent|recalcitrant/i.test(data.text);
      const escalate = data.escalate || chronic;
      
      let plan = `ASSESSMENT:
Plantar fasciitis, ${data.laterality || '[laterality]'}${chronic ? ', chronic' : ''}

PLAN:
- Continue/initiate stretching protocol (gastrocnemius and plantar fascia specific)
- NSAIDs PRN for anti-inflammatory effect
- Ice application 15-20 minutes post-activity
- Activity modification as tolerated
- Supportive footwear with adequate arch support`;

      if (escalate) {
        plan += `

Given ${chronic ? 'chronic nature and' : ''} incomplete response to conservative care, escalation options:
- Custom orthotics if OTC inserts failed after 4-6 weeks
- Night splint for morning pain component  
- Corticosteroid injection if 6+ weeks conservative care failed
- EPAT/shockwave therapy for recalcitrant cases (12+ weeks)`;
      }

      plan += `

Follow-up: Return in 2-4 weeks for reassessment. Patient to contact office if worsening symptoms.`;
      return plan;
    }
  },

  'diabetic-foot': {
    name: 'Diabetic Foot Care',
    code: 'G0245',
    dotPhrase: '.df',
    patterns: [/diabet/i, /dm\s*(1|2|type)/i, /neuropath/i, /lops/i, /monofilament/i, /a1c/i],
    generate: (data) => {
      const hasLOPS = data.lops || /lops|diminished|absent.*(sensation|protect)|neuropathy|cannot\s*(feel|sense)/i.test(data.text);
      const deformities = data.deformities || [];
      if (/hav|bunion/i.test(data.text)) deformities.push('HAV');
      if (/hammer/i.test(data.text)) deformities.push('hammertoes');
      if (/charcot/i.test(data.text)) deformities.push('Charcot');
      
      return `ASSESSMENT:
Diabetic foot examination, ${hasLOPS ? 'LOPS present' : 'protective sensation intact'}, ${hasLOPS ? 'high-risk' : 'moderate-risk'}

PLAN:
Examination findings:
- Protective sensation: ${hasLOPS ? 'diminished/absent via monofilament testing' : 'intact bilaterally'}
- Pedal pulses: [document DP/PT status]
- Skin integrity: see examination
- Nail pathology: see examination
- Deformities: ${deformities.length ? deformities.join(', ') : 'see examination'}

Intervention:
- Debridement of hyperkeratotic lesions/nails as indicated
- Patient education on daily foot inspection, proper footwear, avoiding barefoot ambulation
- Diabetic shoe evaluation ${hasLOPS ? '- patient qualifies' : '- assess eligibility'}

Follow-up: Return ${hasLOPS ? 'q2-3 months' : 'q6 months'} for ongoing surveillance.`;
    }
  },

  'wound-care': {
    name: 'Wound Care/DFU',
    code: '97597',
    dotPhrase: '.wc',
    patterns: [/ulcer/i, /wound/i, /dfu/i, /debride/i, /granulat/i, /slough/i, /eschar/i, /wagner/i],
    generate: (data) => {
      const dims = data.dimensions || data.text.match(/(\d+\.?\d*)\s*x\s*(\d+\.?\d*)\s*x?\s*(\d+\.?\d*)?/i);
      let dimensions = '[L x W x D] cm';
      let sa = '';
      
      if (dims) {
        if (Array.isArray(dims)) {
          dimensions = dims.slice(1, 4).filter(Boolean).join(' x ') + ' cm';
          sa = ` (SA: ${(parseFloat(dims[1]) * parseFloat(dims[2])).toFixed(1)} cm²)`;
        } else if (typeof dims === 'string') {
          dimensions = dims;
          const parts = dims.split('x').map(p => parseFloat(p.trim()));
          if (parts.length >= 2) sa = ` (SA: ${(parts[0] * parts[1]).toFixed(1)} cm²)`;
        }
      }
      
      const wagner = data.wagner || data.text.match(/wagner\s*(\d)/i)?.[1];
      const location = data.location || extractWoundLocation(data.text);
      const debride = data.debride || /debride|sharp/i.test(data.text);
      
      return `ASSESSMENT:
Diabetic foot ulcer, ${location}, ${wagner ? 'Wagner Grade ' + wagner : '[Wagner grade]'}, under active treatment

PLAN:
Wound assessment:
- Size: ${dimensions}${sa}
- Wound bed: [document % granulation/slough/eschar]
- Edges: [attached/rolled/undermined]
- Periwound: [intact/macerated/erythematous]
- Drainage: [none/serous/purulent] - [scant/moderate/copious]
- Infection signs: [none/local/systemic]
${debride ? `
Intervention performed:
- Sharp debridement to viable bleeding tissue
- Necrotic/nonviable tissue removed
- Post-debridement dimensions: [document]` : ''}

Dressing applied:
- [Primary dressing]
- [Secondary dressing]
- Change frequency: per protocol

Offloading: [device] - compliance counseled

Follow-up: Return 1-2 weeks for reassessment${debride ? ' and serial debridement as indicated' : ''}.`;
    }
  },

  'injection': {
    name: 'Corticosteroid Injection',
    code: '20550',
    dotPhrase: '.csi',
    patterns: [/inject/i, /steroid/i, /cortico/i, /depo/i, /kenalog/i, /dexameth/i, /celestone/i],
    generate: (data) => {
      const target = data.target || extractInjectionTarget(data.text);
      const num = data.injectionNumber || data.text.match(/#?(\d)(?:st|nd|rd|th)?\s*inject/i)?.[1] || '1';
      
      return `ASSESSMENT:
Corticosteroid injection, ${target}, ${data.laterality || '[laterality]'}

PLAN:
Indication:
- Persistent pain and functional limitation despite conservative care
- This is injection #${num} for this condition
- Conservative measures tried: stretching, NSAIDs, activity modification, supportive footwear

Procedure performed:
- Risks/benefits discussed, informed consent obtained
- Site prepped with chloraprep
- Injection performed using standard approach
- Medication: 1mL dexamethasone 4mg/mL with 1mL 1% lidocaine plain
- Patient tolerated procedure well, no immediate complications

Post-procedure instructions:
- Avoid strenuous activity 48-72 hours
- Ice PRN for injection site discomfort
- May resume normal activities gradually

Follow-up: Return in 2-4 weeks to assess response.`;
    }
  },

  'hallux-rigidus': {
    name: 'Hallux Rigidus',
    code: 'M20.20',
    dotPhrase: '.hr',
    patterns: [/hallux\s*rigidus/i, /1st\s*mtp.*(stiff|arthr|limit)/i, /big\s*toe.*(stiff|arthr)/i, /dorsal\s*osteophyte/i],
    generate: (data) => {
      const grade = data.grade || data.text.match(/grade\s*(i{1,4}|[1-4])/i)?.[1] || '[grade]';
      const rom = data.rom || data.text.match(/(\d+)\s*°?\s*(?:dorsiflexion|df)/i)?.[1];
      
      return `ASSESSMENT:
Hallux rigidus, ${data.laterality || '[laterality]'}, Grade ${grade} (Coughlin classification)

PLAN:
Clinical findings:
- ROM 1st MTP: ${rom ? rom + '°' : '[X]°'} dorsiflexion (normal 65-75°)
- Pain with ROM testing and direct palpation
- Dorsal osteophyte palpable
- Functional impact: [document limitations]

Radiographic findings:
- Joint space narrowing
- Dorsal osteophytes
- [Additional findings]

Treatment:
- Stiff-soled shoe or rocker bottom modification
- Activity modification to reduce dorsiflexion demands
- NSAIDs PRN
- Consider intra-articular injection for acute flares

If failed 3+ months conservative care:
- Surgical consultation indicated
- Options: cheilectomy vs fusion vs implant based on grade

Follow-up: Return in 4-6 weeks for reassessment.`;
    }
  },

  'hallux-valgus': {
    name: 'Hallux Valgus',
    code: 'M20.10',
    dotPhrase: '.hv',
    patterns: [/hallux\s*valgus/i, /bunion/i, /hva\s*\d/i, /ima\s*\d/i],
    generate: (data) => {
      const hva = data.hva || data.text.match(/hva\s*:?\s*(\d+)/i)?.[1];
      const ima = data.ima || data.text.match(/ima\s*:?\s*(\d+)/i)?.[1];
      const surgical = data.surgical || /surg|operat|lapidus|austin|scarf/i.test(data.text);
      
      let severity = 'mild';
      if (hva && parseInt(hva) > 40) severity = 'severe';
      else if (hva && parseInt(hva) >= 20) severity = 'moderate';
      
      let plan = `ASSESSMENT:
Hallux valgus, ${data.laterality || '[laterality]'}, ${severity}, symptomatic

PLAN:
Radiographic measurements:
- HVA: ${hva || '[X]'}° (normal <15°)
- IMA: ${ima || '[X]'}° (normal <9°)

Conservative management:
- Wide toe box footwear
- Bunion padding/spacers
- NSAIDs PRN
- Custom orthotics if biomechanical component`;

      if (surgical) {
        plan += `

Surgical consideration:
- Patient has failed adequate conservative care trial
- Procedure selection based on severity:
  ${severity === 'severe' ? '- Lapidus for severe deformity/hypermobility' : severity === 'moderate' ? '- Scarf or Austin osteotomy' : '- Distal chevron osteotomy'}
- Risks, benefits, recovery discussed`;
      }

      plan += `

Follow-up: Return in 4 weeks for reassessment.`;
      return plan;
    }
  },

  'achilles': {
    name: 'Achilles Tendinitis',
    code: 'M76.60',
    dotPhrase: '.at',
    patterns: [/achilles/i, /tendo.?achilles/i, /posterior\s*heel/i, /heel\s*cord/i],
    generate: (data) => {
      const location = data.location || (/insert/i.test(data.text) ? 'insertional' : /non.?insert|mid/i.test(data.text) ? 'non-insertional' : '[location]');
      const chronic = data.chronic || /chronic|months|failed|recalcitrant/i.test(data.text);
      
      let plan = `ASSESSMENT:
Achilles tendinitis/tendinopathy, ${location}, ${data.laterality || '[laterality]'}

PLAN:
Clinical findings:
- Tenderness at ${location} Achilles
- Thompson test negative (ruling out rupture)
- Pain with resisted plantarflexion

Treatment:
- Eccentric strengthening protocol (Alfredson)
- Heel lift to reduce tendon strain
- Ice post-activity
- Activity modification - avoid hills, jumping
- NSAIDs short-term for acute flares only
- AVOID corticosteroid injection (rupture risk)`;

      if (chronic) {
        plan += `

Given chronic/recalcitrant nature:
- Physical therapy referral
- MRI to evaluate for partial tear
- EPAT/shockwave therapy consideration
- PRP if refractory`;
      }

      plan += `

Follow-up: Return in 3-4 weeks for reassessment.`;
      return plan;
    }
  },

  'peroneal': {
    name: 'Peroneal Tendinitis',
    code: 'M76.70',
    dotPhrase: '.pt',
    patterns: [/peroneal/i, /peroneus/i, /lateral\s*ankle.*tendon/i],
    generate: (data) => {
      const sublux = data.sublux || /sublux|dislocat|unstable|clicking|popping/i.test(data.text);
      
      return `ASSESSMENT:
Peroneal tendinitis/tendinopathy, ${data.laterality || '[laterality]'}${sublux ? ', with subluxation' : ''}

PLAN:
Clinical findings:
- Tenderness along peroneal tendons posterolateral ankle
- Tendon stability: ${sublux ? 'subluxation with circumduction' : 'stable'}
- Pain with resisted eversion

Treatment:
- Lateral heel wedge to reduce strain
- Ankle brace for stability
- Ice and NSAIDs PRN
- Activity modification - avoid uneven surfaces
- Physical therapy for strengthening
${sublux ? `
Given subluxation:
- MRI to evaluate tear and SPR integrity
- Surgical repair likely indicated` : ''}

Follow-up: Return in 3-4 weeks for reassessment.`;
    }
  },

  'hammertoe': {
    name: 'Hammertoe',
    code: 'M20.40',
    dotPhrase: '.ht',
    patterns: [/hammer\s*toe/i, /claw\s*toe/i, /mallet/i, /digit.*contract/i, /pip.*contract/i],
    generate: (data) => {
      const digits = data.digits || data.text.match(/(\d)(?:nd|rd|th)?\s*(?:toe|digit)/gi)?.map(d => d.match(/\d/)[0]).join(', ') || '[digits]';
      const rigid = data.rigid || /rigid|fixed|non.?reduc/i.test(data.text);
      const flexible = !rigid && /flexib|reduc/i.test(data.text);
      const corn = data.corn || /corn|heloma|lesion/i.test(data.text);
      
      const flex = rigid ? 'rigid (fixed)' : flexible ? 'flexible (reducible)' : '[flexibility]';
      
      return `ASSESSMENT:
Hammertoe deformity, digit(s) ${digits}, ${data.laterality || '[laterality]'}, ${flex}

PLAN:
Clinical findings:
- PIPJ contracture ${rigid ? '(non-reducible)' : flexible ? '(reducible)' : ''}
- ${corn ? 'Heloma durum present - debrided' : 'No associated lesion'}
- Pain with pressure and shoe wear

Conservative management:
- Deep toe box footwear
${!rigid ? '- Hammertoe splint/crest pad' : '- Padding (splinting ineffective for rigid)'}
- Debridement of lesions PRN
${corn ? `
Debridement performed:
- Hyperkeratotic lesion removed
- Offloading pad applied` : ''}
${rigid ? `
Surgical consideration:
- Arthroplasty or arthrodesis indicated
- Address MTPJ if needed` : ''}

Follow-up: Return in 4-6 weeks.`;
    }
  },

  'orthotics': {
    name: 'Custom Orthotics',
    code: 'L3000',
    dotPhrase: '.ortho',
    patterns: [/custom\s*orthot/i, /orthotic/i, /orthos/i, /otc.*(fail|inadequate)/i, /biomech/i, /arch\s*support/i],
    generate: (data) => {
      const findings = data.findings || [];
      if (/pes\s*planus|flat/i.test(data.text)) findings.push('pes planus');
      if (/prona/i.test(data.text)) findings.push('overpronation');
      if (/cavus|high\s*arch/i.test(data.text)) findings.push('cavus foot');
      if (/varus/i.test(data.text)) findings.push('forefoot/rearfoot varus');
      if (/equinus/i.test(data.text)) findings.push('equinus');
      
      const duration = data.duration || data.text.match(/(\d+)\s*(week|wk|month)/i)?.[0] || '4-6 weeks';
      
      return `ASSESSMENT:
Custom functional foot orthoses medically necessary

PLAN:
Medical Necessity Documentation:
- OTC arch supports trialed x ${duration} without adequate relief
- Biomechanical findings: ${findings.length ? findings.join(', ') : '[document findings]'}
- Functional deficit: [document ADL/work impact]
- Custom devices required - OTC inadequate for patient-specific biomechanics

Device specifications:
- Casting: foam box impression
- Type: functional orthosis
- Posting: per biomechanical assessment
- Top cover: per activity level

Follow-up: Return for dispensing and fit check.`;
    }
  }
};

// Helper functions
function extractWoundLocation(text) {
  if (/1st\s*(mtp|met)|big\s*toe|hallux/i.test(text)) return '1st MTP plantar';
  if (/5th\s*(met|mtp)/i.test(text)) return '5th metatarsal';
  if (/heel|calcan/i.test(text)) return 'heel';
  if (/malleol/i.test(text)) return 'malleolar';
  if (/dorsa?l/i.test(text)) return 'dorsal foot';
  return '[location]';
}

function extractInjectionTarget(text) {
  if (/plantar\s*fasc/i.test(text)) return 'plantar fascia origin';
  if (/1st\s*mtp|big\s*toe.*joint/i.test(text)) return '1st MTP joint';
  if (/ankle/i.test(text)) return 'ankle joint';
  if (/subtalar|stj/i.test(text)) return 'subtalar joint';
  if (/neuroma|morton/i.test(text)) return 'Morton neuroma';
  if (/bursa|retrocalc/i.test(text)) return 'retrocalcaneal bursa';
  return '[target structure]';
}

function extractLaterality(text) {
  if (/\b(left|lt)\b/i.test(text)) return 'left';
  if (/\b(right|rt)\b/i.test(text)) return 'right';
  if (/bilat/i.test(text)) return 'bilateral';
  return null;
}

function detectCondition(text) {
  let best = null;
  let bestScore = 0;
  
  for (const [key, cond] of Object.entries(CONDITIONS)) {
    let score = 0;
    for (const p of cond.patterns) {
      if (p.test(text)) score += 10;
    }
    if (score > bestScore) {
      bestScore = score;
      best = { key, ...cond };
    }
  }
  return bestScore >= 10 ? { ...best, score: bestScore } : null;
}

function parseDotPhrase(input) {
  const parts = input.trim().toLowerCase().split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);
  
  const condition = Object.values(CONDITIONS).find(c => c.dotPhrase === cmd);
  if (!condition) return null;
  
  const data = { text: input };
  
  const latArg = args.find(a => ['left', 'right', 'bilateral', 'l', 'r', 'b'].includes(a));
  if (latArg) {
    data.laterality = latArg === 'l' ? 'left' : latArg === 'r' ? 'right' : latArg === 'b' ? 'bilateral' : latArg;
  }
  
  data.escalate = args.includes('+escalate') || args.includes('+e');
  data.chronic = args.includes('+chronic') || args.includes('+c') || args.includes('chronic');
  data.surgical = args.includes('+surgical') || args.includes('+s');
  data.debride = args.includes('+debride') || args.includes('+d');
  data.sublux = args.includes('+sublux');
  data.lops = args.includes('+lops');
  data.rigid = args.includes('rigid');
  data.corn = args.includes('+corn');
  
  const gradeArg = args.find(a => a.startsWith('grade'));
  if (gradeArg) data.grade = gradeArg.replace('grade', '');
  
  const romArg = args.find(a => a.includes('deg'));
  if (romArg) data.rom = romArg.replace('deg', '');
  
  const hvaArg = args.find(a => a.startsWith('hva'));
  if (hvaArg) data.hva = hvaArg.replace('hva', '');
  
  const imaArg = args.find(a => a.startsWith('ima'));
  if (imaArg) data.ima = imaArg.replace('ima', '');
  
  const wagnerArg = args.find(a => a.startsWith('wagner'));
  if (wagnerArg) data.wagner = wagnerArg.replace('wagner', '');
  
  const dimsArg = args.find(a => a.includes('x') && /\d/.test(a));
  if (dimsArg) data.dimensions = dimsArg;
  
  const injArg = args.find(a => a.startsWith('#'));
  if (injArg) data.injectionNumber = injArg.replace('#', '');
  
  const locArg = args.find(a => ['heel', 'insertional', 'noninsertional', 'non-insertional'].includes(a));
  if (locArg) data.location = locArg;
  
  const targetArg = args.find(a => a.includes('-') && !a.includes('wk') && !a.includes('insert'));
  if (targetArg) data.target = targetArg.replace(/-/g, ' ');
  
  const digitArg = args.find(a => /^[2-5,]+$/.test(a));
  if (digitArg) data.digits = digitArg;
  
  data.deformities = [];
  if (args.includes('+hav')) data.deformities.push('HAV');
  if (args.includes('+hammertoes')) data.deformities.push('hammertoes');
  
  data.findings = [];
  if (args.includes('+pes-planus')) data.findings.push('pes planus');
  if (args.includes('+overpronation')) data.findings.push('overpronation');
  if (args.includes('+cavus')) data.findings.push('cavus foot');
  
  return { condition, data };
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
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const theme = THEMES[themeMode];
  const inputRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Handle mounting and system theme
  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    setThemeMode(prefersDark ? 'dark' : 'light');
  }, []);

  // Voice setup
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
          for (let i = 0; i < e.results.length; i++) {
            transcript += e.results[i][0].transcript;
          }
          setInput(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Process input
  useEffect(() => {
    if (mode === 'smart') {
      if (input.length > 15) {
        const det = detectCondition(input);
        setDetected(det);
        if (det) {
          const laterality = extractLaterality(input);
          setOutput(det.generate({ text: input, laterality }));
        } else {
          setOutput('');
        }
      } else {
        setDetected(null);
        setOutput('');
      }
    } else {
      if (input.startsWith('.')) {
        const cmdPart = input.split(' ')[0].toLowerCase();
        const matches = Object.values(CONDITIONS).filter(c => c.dotPhrase.startsWith(cmdPart));
        setSuggestions(matches);
        
        const parsed = parseDotPhrase(input);
        if (parsed) {
          setDetected({ name: parsed.condition.name, code: parsed.condition.code });
          setOutput(parsed.condition.generate(parsed.data));
        }
      } else {
        setSuggestions([]);
        setDetected(null);
        setOutput('');
      }
    }
  }, [input, mode]);

  const toggleVoice = () => {
    if (!voiceSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setDetected(null);
    setSuggestions([]);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(prev => prev + text);
    } catch (e) {}
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      setInput(suggestions[0].dotPhrase + ' ');
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleCopy();
    }
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  const btnStyle = (active = false, color = theme.primary) => ({
    minHeight: 48,
    padding: '12px 18px',
    background: active ? color : theme.card,
    border: `1px solid ${active ? color : theme.border}`,
    borderRadius: 12,
    color: active ? '#fff' : theme.textSecondary,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 0.2s',
    boxShadow: active ? theme.shadow : 'none'
  });

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#0F172A' }} />;
  }

  return (
    <>
      <Head>
        <title>MDM Workstation | Newtown Foot & Ankle</title>
        <meta name="description" content="Medical Decision Making documentation tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content={theme.bg} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: theme.bg,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '16px 16px env(safe-area-inset-bottom, 16px)',
        transition: 'background 0.3s'
      }}>
        {/* Header */}
        <header style={{ maxWidth: 900, margin: '0 auto 20px', padding: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <NewtownLogo theme={theme} />
              <div>
                <div style={{ fontSize: 11, color: BRAND.blue, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>
                  Newtown
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: theme.name === 'dark' ? '#fff' : BRAND.navy, lineHeight: 1.2 }}>
                  Foot & Ankle
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: theme.name === 'dark' ? '#fff' : BRAND.navy, lineHeight: 1.2 }}>
                  Specialists
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
                style={{ ...btnStyle(false), padding: '12px 14px', minWidth: 48 }}
                title={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}
              >
                {themeMode === 'dark' ? '☀️' : '🌙'}
              </button>
              
              <div style={{ display: 'flex', background: theme.cardAlt, borderRadius: 14, padding: 4, border: `1px solid ${theme.border}` }}>
                <button onClick={() => { setMode('smart'); handleClear(); }} style={btnStyle(mode === 'smart', theme.primary)}>
                  🧠 Smart
                </button>
                <button onClick={() => { setMode('terminal'); handleClear(); }} style={btnStyle(mode === 'terminal', theme.success)}>
                  ⚡ Terminal
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: theme.text }}>MDM Workstation</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ background: theme.successFaded, color: theme.success, fontSize: 11, fontWeight: 600, padding: '6px 10px', borderRadius: 6 }}>✓ Audit-Ready</span>
              <span style={{ background: theme.primaryFaded, color: theme.primary, fontSize: 11, fontWeight: 600, padding: '6px 10px', borderRadius: 6 }}>✓ Medical Necessity</span>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 900, margin: '0 auto' }}>
          {mode === 'smart' && (
            <div style={{ background: theme.card, borderRadius: 20, border: `1px solid ${theme.border}`, overflow: 'hidden', marginBottom: 20, boxShadow: theme.shadow }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: `1px solid ${theme.border}`, background: theme.cardAlt, flexWrap: 'wrap', gap: 12 }}>
                <span style={{ color: theme.textSecondary, fontSize: 14, fontWeight: 500 }}>📋 Type, paste, or dictate S/O notes</span>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button onClick={handlePaste} style={btnStyle(false)}>📋 Paste</button>
                  {voiceSupported && (
                    <button onClick={toggleVoice} style={{ ...btnStyle(isListening, theme.danger), background: isListening ? theme.danger : theme.card, animation: isListening ? 'pulse 1.5s infinite' : 'none' }}>
                      🎤 {isListening ? 'Stop' : 'Voice'}
                    </button>
                  )}
                  {input && <button onClick={handleClear} style={btnStyle(false)}>✕ Clear</button>}
                </div>
              </div>
              
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Type or paste your S/O notes here...

Example: "52 yo female with 4 months left heel pain, worse first steps AM. Failed stretching, OTC inserts x 8 weeks, Aleve. TTP medial tubercle, positive windlass, tight gastroc bilaterally."

Or tap 🎤 Voice to dictate.`}
                style={{ width: '100%', minHeight: 200, padding: 20, background: 'transparent', border: 'none', outline: 'none', color: theme.text, fontSize: 16, lineHeight: 1.7, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
              
              {isListening && (
                <div style={{ padding: '12px 20px', background: theme.dangerFaded, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 12, height: 12, background: theme.danger, borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                  <span style={{ color: theme.danger, fontSize: 14, fontWeight: 500 }}>Listening... Speak your subjective notes</span>
                </div>
              )}
              
              {detected && !isListening && (
                <div style={{ padding: 16, borderTop: `1px solid ${theme.border}`, background: theme.primaryFaded, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: theme.success, fontSize: 20, background: theme.successFaded, width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                    <div>
                      <div style={{ color: theme.textMuted, fontSize: 12 }}>Detected Condition</div>
                      <div style={{ color: theme.primary, fontWeight: 700, fontSize: 18 }}>{detected.name}</div>
                    </div>
                  </div>
                  <span style={{ background: theme.card, color: theme.textSecondary, fontSize: 13, padding: '8px 14px', borderRadius: 8, fontFamily: 'monospace', border: `1px solid ${theme.border}` }}>{detected.code}</span>
                </div>
              )}
            </div>
          )}

          {mode === 'terminal' && (
            <div style={{ background: themeMode === 'dark' ? '#0d1117' : theme.card, borderRadius: 20, border: `1px solid ${theme.border}`, overflow: 'hidden', marginBottom: 20, boxShadow: theme.shadow }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: 20, borderBottom: suggestions.length && !output ? `1px solid ${theme.border}` : 'none' }}>
                <span style={{ color: theme.success, marginRight: 12, fontWeight: 700, fontSize: 20, fontFamily: 'monospace' }}>❯</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder=".pf left chronic +escalate"
                  autoFocus
                  autoCapitalize="none"
                  autoCorrect="off"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: theme.text, fontSize: 18, fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace', minHeight: 48 }}
                />
                {input && <button onClick={handleClear} style={btnStyle(false)}>Clear</button>}
              </div>
              
              {suggestions.length > 0 && !output && (
                <div style={{ borderTop: `1px solid ${theme.border}` }}>
                  {suggestions.map((s, i) => (
                    <div key={s.dotPhrase} onClick={() => setInput(s.dotPhrase + ' ')} style={{ padding: '16px 20px', cursor: 'pointer', background: i === 0 ? theme.successFaded : 'transparent', borderLeft: i === 0 ? `3px solid ${theme.success}` : '3px solid transparent', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ color: theme.success, fontWeight: 700, fontSize: 16, fontFamily: 'monospace' }}>{s.dotPhrase}</span>
                      <span style={{ color: theme.textSecondary, fontSize: 15 }}>{s.name}</span>
                      <span style={{ color: theme.textMuted, fontSize: 12, marginLeft: 'auto', fontFamily: 'monospace' }}>{s.code}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {detected && mode === 'terminal' && (
                <div style={{ padding: 16, borderTop: `1px solid ${theme.border}`, background: theme.successFaded, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: theme.success, fontSize: 16 }}>✓</span>
                  <span style={{ color: theme.success, fontWeight: 600 }}>{detected.name}</span>
                  <span style={{ color: theme.textMuted }}>|</span>
                  <span style={{ color: theme.textMuted, fontFamily: 'monospace' }}>{detected.code}</span>
                </div>
              )}
            </div>
          )}

          {mode === 'terminal' && !input && (
            <div style={{ background: theme.card, borderRadius: 20, border: `1px solid ${theme.border}`, padding: 20, marginBottom: 20, boxShadow: theme.shadow }}>
              <div style={{ color: theme.textSecondary, marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Quick Reference — Tap to use</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                {Object.values(CONDITIONS).map(c => (
                  <button key={c.dotPhrase} onClick={() => setInput(c.dotPhrase + ' ')} style={{ padding: 14, background: theme.cardAlt, borderRadius: 12, border: `1px solid ${theme.border}`, cursor: 'pointer', textAlign: 'left', minHeight: 65 }}>
                    <div style={{ color: theme.success, fontWeight: 700, fontSize: 14, fontFamily: 'monospace', marginBottom: 4 }}>{c.dotPhrase}</div>
                    <div style={{ color: theme.textMuted, fontSize: 12 }}>{c.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {output && (
            <div style={{ background: theme.card, borderRadius: 20, border: `1px solid ${theme.border}`, overflow: 'hidden', boxShadow: theme.shadow }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: `1px solid ${theme.border}`, background: theme.cardAlt, flexWrap: 'wrap', gap: 12 }}>
                <span style={{ color: theme.textSecondary, fontSize: 14, fontWeight: 500 }}>📄 Generated Plan Section</span>
                <button onClick={handleCopy} style={{ ...btnStyle(true, copied ? theme.success : theme.primary), minWidth: 160 }}>
                  {copied ? '✓ Copied!' : '📋 Copy to EMR'}
                </button>
              </div>
              <pre style={{ padding: 20, margin: 0, color: theme.text, fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace', maxHeight: 500, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                {output}
              </pre>
            </div>
          )}

          {!output && mode === 'smart' && !input && (
            <div style={{ background: theme.card, borderRadius: 20, border: `1px solid ${theme.border}`, padding: 40, textAlign: 'center', boxShadow: theme.shadow }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>🎯</div>
              <div style={{ color: theme.text, fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Type, Paste, or Dictate</div>
              <div style={{ color: theme.textMuted, fontSize: 15, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
                Enter your S/O notes using keyboard, paste from clipboard, or tap 🎤 Voice to dictate. The app auto-detects the condition and generates an audit-ready Plan.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                {Object.values(CONDITIONS).slice(0, 6).map(c => (
                  <span key={c.code} style={{ background: theme.cardAlt, border: `1px solid ${theme.border}`, color: theme.textMuted, fontSize: 13, padding: '10px 14px', borderRadius: 10 }}>{c.name}</span>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer style={{ maxWidth: 900, margin: '24px auto 0', textAlign: 'center', color: theme.textMuted, fontSize: 12, padding: '0 16px' }}>
          <div style={{ marginBottom: 4 }}>Newtown Foot & Ankle Specialists • MDM Documentation Tool</div>
          <div>{mode === 'smart' ? 'Type • Paste • Voice → Auto-detect → Copy to EMR' : 'Tab: autocomplete • ⌘+Enter: copy • Esc: clear'}</div>
        </footer>

        <style jsx global>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          * { -webkit-tap-highlight-color: transparent; }
          textarea::placeholder, input::placeholder { color: ${theme.textMuted}; }
          html, body { overscroll-behavior: none; }
        `}</style>
      </div>
    </>
  );
}

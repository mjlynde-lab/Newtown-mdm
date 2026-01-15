# Newtown MDM Workstation - Project Evolution Document

**Last Updated:** January 15, 2026  
**Current Version:** 5.0  
**Status:** ✅ Deployed to Production  
**Live URL:** https://newtown-mdm.vercel.app

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Session History](#session-history)
3. [Technical Architecture](#technical-architecture)
4. [Features Implemented](#features-implemented)
5. [Issues Encountered & Lessons Learned](#issues-encountered--lessons-learned)
6. [Future Roadmap](#future-roadmap)
7. [Integration with Continuum](#integration-with-continuum)

---

## Project Overview

### Purpose
The MDM Workstation is a clinical documentation tool designed for Newtown Foot & Ankle Specialists that generates audit-ready, billing-compliant Plan sections for SOAP notes with proper Medical Decision Making (MDM) documentation.

### Core Problem Solved
- Reduces time spent on clinical documentation
- Ensures billing compliance (2021/2023 E/M guidelines)
- Provides consistent, defensible documentation
- Personalizes output to each clinician's preferences

### Target Users
- Primary: Dr. Michael Lynde (Podiatrist, 15 years experience)
- Secondary: Associate clinicians at Newtown Foot & Ankle Specialists

---

## Session History

### Session 1: January 15, 2026
**Duration:** ~4 hours  
**Focus:** Initial build, preferences system, onboarding wizard, deployment

#### What Was Accomplished

1. **Core App Development (v1-v4)**
   - Smart Mode: Paste/voice input → auto-detect condition → generate plan
   - Terminal Mode: Dot phrase commands (`.pf`, `.at`, `.df`, etc.)
   - Condition detection with clinical parsing
   - Dark/light theme support

2. **Billing Logic Overhaul (v5)**
   - Critical insight from billing perspective: Procedure visits ≠ automatic E/M + Modifier 25
   - Implemented proper logic:
     - Procedure performed → Procedure note only (no separate E/M)
     - No procedure → E/M note with MDM documentation
     - Truly separate problem → Modifier 25 applicable
   - Added NSAID contraindication logic (anticoagulants increase MDM complexity)

3. **Personalization System**
   - Onboarding wizard (8-step walkthrough)
   - Preferences stored in localStorage (device-specific)
   - Customizable: injection cocktail, conservative recs, follow-up intervals, stretching protocol

4. **Branding & UI**
   - Newtown Foot & Ankle logo integration
   - Professional header with Audit-Ready/Medical Necessity badges
   - Responsive design for iPad use

5. **Deployment**
   - GitHub repository: mjlynde-lab/Newtown-mdm
   - Vercel auto-deployment from GitHub
   - PWA manifest for home screen installation

#### Key Decisions Made

| Decision | Rationale |
|----------|-----------|
| Local storage for preferences | Simple, private, no backend needed, device-specific |
| No AI integration yet | MVP approach - get core functionality right first |
| Procedure-first billing logic | Accurate billing compliance over convenience |
| Onboarding wizard | Better UX than modal settings for first-time setup |

---

## Technical Architecture

### Current Stack
```
Frontend:     Next.js (React)
Styling:      Inline CSS-in-JS
Storage:      Browser localStorage
Hosting:      Vercel (auto-deploy from GitHub)
Repository:   github.com/mjlynde-lab/Newtown-mdm
```

### File Structure
```
newtown-mdm/
├── pages/
│   ├── index.js        # Main app (2300+ lines)
│   ├── _app.js         # App wrapper
│   └── _document.js    # HTML document
├── public/
│   ├── logo.png        # Newtown logo
│   ├── icon-192.png    # PWA icon
│   ├── icon-512.png    # PWA icon
│   └── manifest.json   # PWA manifest
├── package.json
├── next.config.js
├── vercel.json
└── PROJECT_EVOLUTION.md  # This document
```

### Data Flow
```
User Input (text/voice)
    ↓
parseInput() - Extracts clinical data
    ↓
detectCondition() - Identifies diagnosis
    ↓
condition.generate() - Creates documentation
    ↓
Apply preferences (injection mix, follow-ups, etc.)
    ↓
Output (copy to EMR)
```

---

## Features Implemented

### Condition Templates
| Condition | Dot Phrase | Features |
|-----------|------------|----------|
| Plantar Fasciitis | `.pf` | Injection notes, EPAT, conservative recs |
| Achilles Tendinitis | `.at` | NO steroid warning, eccentric exercises |
| Diabetic Foot Care | `.df` | LOPS assessment, shoe qualification |
| Wound Care/DFU | `.wc` | Wagner grading, debridement CPT codes |
| Corticosteroid Injection | `.csi` | Full procedure note with consent |
| Hallux Valgus | `.hv` | HVA/IMA angles, surgical planning |
| Custom Orthotics | `.ortho` | Medical necessity, biomechanics |

### Clinical Intelligence
- **Contraindication detection:** Anticoagulants, NSAID allergies, GI issues, CKD
- **Procedure detection:** Injection given, EPAT performed, debridement done
- **Laterality parsing:** Left, right, bilateral
- **Duration extraction:** Weeks, months, years
- **Injection counting:** #1, #2, #3 with diminishing returns warning

### Preference Options
**Injections:**
- Steroid type (Dexamethasone, Kenalog, Depo-Medrol, Celestone)
- Steroid volume (0.5-2mL)
- Anesthetic type (Lidocaine, Marcaine, with/without epi)
- Anesthetic volume (0.5-3mL)
- Needle size
- Max injections before discussion

**Conservative Care:**
- NSAID preference and alternative
- Stretching protocol (free text)
- Recovery sandal brand
- OTC arch support brand
- Icing protocol

**Follow-Up Intervals:**
- Post-injection, post-EPAT
- Routine vs chronic conditions
- Wound care (routine vs infected)
- Diabetic foot exam by risk level

---

## Issues Encountered & Lessons Learned

### Issue 1: JSX Syntax Error with Escaped Quotes
**Problem:** Build failed with "Unexpected token" error
```jsx
// ❌ WRONG - escaped quotes don't work in JSX attributes
<option value="25g 1.5\"">25g 1.5"</option>

// ✅ CORRECT - use single quotes to wrap
<option value='25g 1.5"'>25g 1.5"</option>
```
**Lesson:** Always use single quotes for JSX attribute values that contain double quotes, or use template literals.

### Issue 2: Missing PWA Icon Files
**Problem:** Console errors for `/icon-192.png` returning 404
**Solution:** Added icon files to public folder and ensured manifest.json references correct paths
**Lesson:** Always verify manifest.json icon paths exist before deployment

### Issue 3: Cached Old Versions After Deploy
**Problem:** App showed old version despite successful deployment
**Solution:** Clear localStorage and hard refresh (Ctrl+Shift+R)
**Lesson:** When testing onboarding/localStorage features, always clear site data first

### Issue 4: Logo Not Displaying
**Problem:** Hand-drawn SVG didn't match actual branding
**Solution:** Used actual logo PNG file instead of approximating with SVG paths
**Lesson:** For branding, always request actual assets rather than recreating

### Issue 5: GitHub Upload Confusion
**Problem:** Files weren't uploading/replacing correctly
**Solution:** Step-by-step guidance on Add file → Upload files workflow
**Lesson:** Document the deployment process clearly for non-developer users

### Best Practices Established

1. **Always verify zip timestamps** before uploading to ensure fresh files
2. **Check Vercel build logs** when deployment fails - error messages are specific
3. **Test locally with `npm run dev`** before pushing (future improvement)
4. **Keep this document updated** after each session

---

## Future Roadmap

### Short Term (Next 1-2 Sessions)
- [ ] Add more condition templates (neuromas, tendinitis variants, ingrown nails)
- [ ] Improve voice input accuracy
- [ ] Add "Copy successful" animation feedback
- [ ] Test with associates and gather feedback
- [ ] Add pediatric condition templates

### Medium Term (1-2 Months)
- [ ] Build standalone MDM Documentation Engine
- [ ] Create API endpoints for Continuum integration
- [ ] Add usage analytics (which templates used most)
- [ ] Implement template customization UI

### Long Term (3-6 Months)
- [ ] **AI-Powered Learning System** (Option 3)
  - Analyze clinician documentation patterns
  - Learn individual preferences automatically
  - Suggest improvements based on successful notes
  - Requires: Backend API, database, Claude API integration

---

## Integration with Continuum

### Vision
The MDM Workstation could serve as a **documentation engine** that powers Continuum's clinical documentation features. Rather than building documentation logic into Continuum directly, we could:

1. **MDM Engine as Microservice**
   - Standalone API that accepts clinical inputs
   - Returns formatted documentation
   - Maintains clinician preference profiles
   - Learns from usage patterns

2. **Continuum as Consumer**
   - Calls MDM Engine API when user needs documentation
   - Passes patient context, clinical findings
   - Receives formatted Plan section
   - User can edit/approve before saving to EMR

### Architecture for AI-Powered Learning

```
┌─────────────────────────────────────────────────────────┐
│                    CONTINUUM APP                        │
│  (Literature Review + Clinical Decision Support)        │
└─────────────────────┬───────────────────────────────────┘
                      │ API Call
                      ▼
┌─────────────────────────────────────────────────────────┐
│              MDM DOCUMENTATION ENGINE                   │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Template   │  │  Clinician  │  │   Claude    │    │
│  │   Library   │  │  Profiles   │  │     API     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│         │                │                │            │
│         └────────────────┼────────────────┘            │
│                          ▼                             │
│              ┌─────────────────────┐                   │
│              │   Learning Engine   │                   │
│              │  - Pattern analysis │                   │
│              │  - Preference learn │                   │
│              │  - Quality scoring  │                   │
│              └─────────────────────┘                   │
│                          │                             │
│                          ▼                             │
│              ┌─────────────────────┐                   │
│              │  Document Generator │                   │
│              └─────────────────────┘                   │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
              Formatted Plan Section
              (Personalized to clinician)
```

### AI Learning Implementation Plan

**Phase 1: Data Collection**
- Log all generated documentation (with clinician ID)
- Track edits made after generation
- Store "accepted as-is" vs "modified" metrics

**Phase 2: Pattern Analysis**
- Identify per-clinician preferences from edit patterns
- "Dr. Smith always changes Dexamethasone to Kenalog" → learn preference
- "Dr. Jones always adds heel lifts to Achilles plan" → add to her template

**Phase 3: Active Learning**
- Use Claude API to analyze documentation patterns
- Generate improved templates based on successful notes
- A/B test variations to optimize

**Cost Estimate for AI Features:**
- Claude API: ~$0.01-0.05 per documentation generation
- Database: ~$20-50/month (PostgreSQL on Railway)
- Total: ~$50-100/month for moderate usage

---

## Technical Debt & Known Issues

1. **Single file architecture** - `index.js` is 2300+ lines; should be split into components
2. **No automated testing** - Should add Jest tests for parsers
3. **No error boundaries** - App could crash on edge cases
4. **Voice input browser-dependent** - May not work on all browsers/devices

---

## Glossary

| Term | Definition |
|------|------------|
| MDM | Medical Decision Making - documentation required for E/M billing |
| E/M | Evaluation & Management - billing codes (99213, 99214, etc.) |
| Modifier 25 | Billing modifier for separate E/M service same day as procedure |
| LOPS | Loss of Protective Sensation - diabetic neuropathy finding |
| CPT | Current Procedural Terminology - billing codes for procedures |
| EPAT | Extracorporeal Pulse Activation Technology - shockwave therapy |
| PWA | Progressive Web App - installable web application |

---

## Contact & Resources

**Developer:** Claude (Anthropic AI Assistant)  
**Project Owner:** Dr. Michael Lynde, DPM  
**Practice:** Newtown Foot & Ankle Specialists  

**Repositories:**
- MDM Workstation: github.com/mjlynde-lab/Newtown-mdm
- Continuum (future): TBD

---

*This is a living document. Update after each development session.*

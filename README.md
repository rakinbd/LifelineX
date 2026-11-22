# LifeLink AI — Intelligent Emergency Help & Community Response Network

> **Tagline:** One Request. One Network. Countless Lives Connected.  
> **Classification:** Global Mission-Critical CAD (Computer-Aided Dispatch) & Community Mutual-Aid Platform.

---

## 1. Project Overview

**LifeLink AI** is an intelligent, high-stakes emergency assistance and community mutual-aid dispatch platform. It bridges the critical gap between citizens facing acute medical/trauma distress and nearby verified life-savers—including **universal blood donors, field first-responders (EMTs/paramedics), trauma centers, and disaster relief fleets**.

Engineered for global deployment, LifeLink AI replaces chaotic social media distress appeals with structured, sub-second AI triage, deterministic clinical compatibility matching, and real-time GIS command coordination.

---

## 2. Key Architecture & Features

### A. Universal AI Triage & NLP Engine
- **Deterministic & Heuristic Parsing:** Processes natural language distress inputs (voice or text), extracting incident category (`TRAUMA_ACCIDENT`, `BLOOD_TRANSFUSION`, `AMBULANCE_TRANSIT`, `CRITICAL_MEDICAL`, `DISASTER_RESCUE`).
- **Urgency Scoring:** Assigns clinical priority tiers (`CRITICAL`, `HIGH`, `MODERATE`) with calibrated 0–100 urgency ratings.
- **Entity Extraction:** Detects ABO/Rh blood groups, required blood units, acute symptoms, and landmark locations.

### B. Smart Blood Donor Matching Engine
- **Universal Transfusion Matrix:** Strictly enforces international transfusion standards (AABB / WHO):
  - **O-:** Universal red cell donor.
  - **AB+:** Universal recipient.
- **Cooldown Compliance:** Verifies a mandatory 90-day donation cooldown period.
- **Geospatial Proximity:** Calculates Great-Circle surface distance via the Haversine formula and computes a multi-factor matching score:
  $$S_{\text{match}} = w_1 \cdot C_{\text{blood}} + w_2 \cdot \left(\frac{1}{1 + d}\right) + w_3 \cdot A_{\text{status}} + w_4 \cdot R_{\text{trust}}$$

### C. Tactical GIS Emergency Command Map
- Built with **Leaflet** and dark tactical CartoDB mapping tiles.
- Layer toggles for:
  - 🚨 Active SOS Distress Incidents (Red Markers)
  - 🩸 Active Cooldown-Cleared Blood Donors (Rose Markers)
  - 🏥 Level-1 Trauma Centers & ICU Beds (Blue Cross Markers)
  - 🛡️ Field First Responders & Paramedics (Emerald Markers)
- **Patient Privacy Shield:** Implements dynamic location fuzzing ($\pm 1.5\text{ km}$ radius) to protect victim locations from public exposure.

### D. Multi-Role Operational Switcher
The platform allows instantaneous switching between operational perspectives:
1. **Citizen / Requester:** One-tap SOS modal with instant voice transcription simulation and live status tracking.
2. **Verified Blood Donor:** Real-time blood appeals, cooldown eligibility badges, and one-tap mobilization.
3. **First Responder / EMT:** Field incident dispatch, active missions, and tactical radio.
4. **Hospital Coordinator:** Trauma bed capacity, blood cryo-vault inventory, and ambulance transit tracking.
5. **Dispatch Supervisor (CAD):** Master global incident command, AI triage inspection, and operator controls.

---

## 3. Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 18, Node.js runtime)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Trauma-informed, high-contrast dark operations theme)
- **Mapping:** Leaflet & OpenStreetMap / CartoDB Dark Matter
- **Icons:** Lucide React
- **Audio Telemetry:** Web Audio API synthesized alert chime (zero external asset latency)
- **State Management:** React Context (`RoleContext`, `EmergencyContext`)

---

## 4. Folder Structure

```
src/
├── app/
│   ├── api/
│   │   ├── incidents/route.ts      # Incident REST API
│   │   ├── match/route.ts          # Geospatial & Blood Matching API
│   │   ├── stats/route.ts          # Operational Telemetry API
│   │   └── triage/route.ts         # AI Triage & Entity Extraction API
│   ├── donors/page.tsx             # Smart Blood Matching & Registry Portal
│   ├── hospitals/page.tsx          # Trauma Centers & Bed Telemetry
│   ├── map/page.tsx                # Tactical GIS Full-Screen Command Map
│   ├── volunteers/page.tsx         # First-Responder & Disaster Fleet
│   ├── globals.css                 # Custom tactical scrollbars & map layers
│   ├── layout.tsx                  # Root layout with Role & Emergency providers
│   └── page.tsx                    # Primary Live CAD Command Center
├── components/
│   ├── blood/
│   │   └── CompatibilityMatrix.tsx # Interactive universal blood calculator
│   ├── dashboard/
│   │   └── TelemetryStats.tsx      # Real-time incident & response counters
│   ├── emergency/
│   │   ├── IncidentCard.tsx        # Operational incident cards with status stepper
│   │   ├── IncidentInspector.tsx   # Detailed triage breakdown & radio comms
│   │   └── QuickSOSModal.tsx       # Rapid voice/text SOS creation modal
│   ├── layout/
│   │   ├── EmergencyBanner.tsx     # Top alert telemetry ticker
│   │   ├── Footer.tsx              # Enterprise disclaimers & HIPAA/GDPR notices
│   │   └── Navbar.tsx              # CAD header with role switcher & audio toggle
│   └── map/
│       └── EmergencyMap.tsx        # Client-rendered tactical Leaflet GIS map
├── context/
│   ├── EmergencyContext.tsx        # Real-time incident state & dispatch logic
│   └── RoleContext.tsx             # Multi-role simulation context
├── lib/
│   ├── ai/
│   │   └── triageEngine.ts         # Natural language triage parser
│   ├── matching/
│   │   ├── bloodCompatibility.ts   # AABB/WHO transfusion compatibility logic
│   │   └── geoDistance.ts          # Haversine distance & composite match score
│   ├── mockData.ts                 # Realistic international incident dataset
│   └── utils.ts                    # Badge color helpers & date formatters
└── types/
    └── index.ts                    # Complete TypeScript definitions
```

---

## 5. Getting Started

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node v24)
- npm or pnpm

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## 6. Safety, Privacy & Ethical Guardrails

1. **Decision Support Exclusivity:** LifeLink AI serves as decision support and rapid discovery. It does not replace clinical laboratory blood crossmatching or municipal emergency services (911/112/999).
2. **Location Obfuscation:** Victim coordinates are protected by dynamic location fuzzing to mitigate harassment and target stalking during disasters.
3. **Data Protection:** Engineered to comply with international HIPAA and GDPR health privacy principles.

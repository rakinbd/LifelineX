# Archived Modules & Features Restore Guide

The following modules were archived on user request:
1. **Emergency Response & Incidents** (`/incidents`, `/incidents/[id]`, `/triage`, `/api/incidents`, `/api/triage`, `src/components/emergency/`)
2. **Hospital Management System** (`/hospitals`)
3. **Analytics Dashboard** (`/analytics`, `src/components/dashboard/`)

---

## How to Restore

### To restore Emergency Response:
```powershell
Copy-Item -Recurse -Force 'src\_archive\app\incidents' 'src\app\'
Copy-Item -Recurse -Force 'src\_archive\app\triage' 'src\app\'
Copy-Item -Recurse -Force 'src\_archive\components\emergency' 'src\components\'
Copy-Item -Recurse -Force 'src\_archive\api\incidents' 'src\app\api\'
Copy-Item -Recurse -Force 'src\_archive\api\triage' 'src\app\api\'
```

### To restore Hospital Management System:
```powershell
Copy-Item -Recurse -Force 'src\_archive\app\hospitals' 'src\app\'
```

### To restore Tactical Map:
```powershell
Copy-Item -Recurse -Force 'src\_archive\app\map' 'src\app\'
```

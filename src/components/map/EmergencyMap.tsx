'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { useEmergency } from '@/context/EmergencyContext';
import { MOCK_FACILITIES, MOCK_VOLUNTEERS } from '@/lib/mockData';
import { Filter, Layers, Navigation, ShieldCheck } from 'lucide-react';

interface EmergencyMapProps {
  heightClass?: string;
  focusIncidentId?: string;
}

export default function EmergencyMap({ heightClass = 'h-[500px]', focusIncidentId }: EmergencyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const { incidents, donors, activeIncident, setActiveIncident } = useEmergency();

  // Layer filter toggles
  const [showIncidents, setShowIncidents] = useState(true);
  const [showDonors, setShowDonors] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showResponders, setShowResponders] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import leaflet to prevent SSR issues
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        // Initialize Map
        const map = L.map(mapContainerRef.current, {
          center: [40.74, -73.96],
          zoom: 12,
          zoomControl: false,
        });

        // Add sleek Dark Matter tiles for tactical operations
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;
        markersLayerRef.current = L.layerGroup().addTo(map);
      }

      // Update Markers
      const layer = markersLayerRef.current;
      if (!layer) return;
      layer.clearLayers();

      // Custom SVG Marker Generators
      const createTacticalIcon = (color: string, label: string, pulse = false) => {
        return L.divIcon({
          className: 'tactical-marker',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
              ${pulse ? `<div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${color}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
              <div style="width: 24px; height: 24px; border-radius: 50%; background: #0f172a; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.8);">
                <span style="color: ${color}; font-size: 11px; font-weight: bold; font-family: monospace;">${label}</span>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });
      };

      // 1. Incidents (Red Markers)
      if (showIncidents) {
        incidents.forEach((inc) => {
          const isCritical = inc.urgency === 'CRITICAL';
          const icon = createTacticalIcon(isCritical ? '#ef4444' : '#f59e0b', '!', isCritical);
          
          const marker = L.marker([inc.location.lat, inc.location.lng], { icon })
            .bindPopup(`
              <div style="padding: 4px; font-family: sans-serif; font-size: 12px; color: #f3f4f6; min-width: 200px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-weight: 700; color: #ef4444; font-size: 11px; font-family: monospace;">${inc.id}</span>
                  <span style="background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239,68,68,0.4); padding: 1px 6px; border-radius: 9999px; font-size: 10px; font-weight: 600;">${inc.urgency}</span>
                </div>
                <div style="font-weight: 600; font-size: 12px; margin-bottom: 2px; color: #ffffff;">${inc.title}</div>
                <div style="font-size: 11px; color: #9ca3af; margin-bottom: 6px;">${inc.location.address}</div>
                <div style="border-top: 1px solid #374151; padding-top: 6px; font-size: 11px; color: #38bdf8;">
                  Status: <strong>${inc.status}</strong>
                </div>
              </div>
            `);

          marker.on('click', () => {
            setActiveIncident(inc);
          });

          layer.addLayer(marker);

          // Obfuscated Privacy Radius
          if (inc.location.fuzzyRadiusKm) {
            L.circle([inc.location.lat, inc.location.lng], {
              radius: inc.location.fuzzyRadiusKm * 1000,
              color: isCritical ? '#ef4444' : '#f59e0b',
              fillColor: isCritical ? '#ef4444' : '#f59e0b',
              fillOpacity: 0.08,
              weight: 1,
              dashArray: '4, 4',
            }).addTo(layer);
          }
        });
      }

      // 2. Donors (Crimson Drop Markers)
      if (showDonors) {
        donors.forEach((donor) => {
          if (!donor.isAvailable) return;
          const icon = createTacticalIcon('#f43f5e', donor.bloodGroup);
          const marker = L.marker([donor.location.lat, donor.location.lng], { icon })
            .bindPopup(`
              <div style="padding: 4px; font-size: 12px; color: #f3f4f6;">
                <div style="font-weight: bold; color: #f43f5e; font-size: 11px;">VERIFIED BLOOD DONOR</div>
                <div style="font-weight: 600; color: #fff; margin-top: 2px;">${donor.fullName}</div>
                <div style="color: #94a3b8; font-size: 11px;">Blood: <strong style="color: #fda4af;">${donor.bloodGroup}</strong> | ${donor.totalDonations} Donations</div>
                <div style="color: #10b981; font-size: 10px; margin-top: 4px;">✓ Transfusion Eligible (Cooldown Cleared)</div>
              </div>
            `);
          layer.addLayer(marker);
        });
      }

      // 3. Hospitals & Trauma Centers (Blue Cross)
      if (showHospitals) {
        MOCK_FACILITIES.forEach((fac) => {
          const icon = createTacticalIcon('#38bdf8', '+');
          const marker = L.marker([fac.location.lat, fac.location.lng], { icon })
            .bindPopup(`
              <div style="padding: 4px; font-size: 12px; color: #f3f4f6;">
                <div style="font-weight: bold; color: #38bdf8; font-size: 11px;">${fac.type.replace('_', ' ')}</div>
                <div style="font-weight: 600; color: #fff; margin-top: 2px;">${fac.name}</div>
                <div style="color: #94a3b8; font-size: 11px; margin-top: 3px;">
                  ICU Beds: <strong style="color: #fff;">${fac.availableBeds}</strong> | Ambulances: <strong style="color: #fff;">${fac.ambulancesAvailable}</strong>
                </div>
                <div style="color: #38bdf8; font-size: 11px; margin-top: 3px;">Hotline: ${fac.emergencyHotline}</div>
              </div>
            `);
          layer.addLayer(marker);
        });
      }

      // 4. Community Responders (Emerald Markers)
      if (showResponders) {
        MOCK_VOLUNTEERS.forEach((vol) => {
          if (!vol.isAvailable) return;
          const icon = createTacticalIcon('#10b981', 'R');
          const marker = L.marker([vol.location.lat, vol.location.lng], { icon })
            .bindPopup(`
              <div style="padding: 4px; font-size: 12px; color: #f3f4f6;">
                <div style="font-weight: bold; color: #10b981; font-size: 11px;">FIELD FIRST RESPONDER</div>
                <div style="font-weight: 600; color: #fff; margin-top: 2px;">${vol.name}</div>
                <div style="color: #94a3b8; font-size: 11px;">Badge: ${vol.badgeLevel} | Missions: ${vol.completedMissions}</div>
                <div style="color: #a7f3d0; font-size: 10px; margin-top: 3px;">Avg Response: ${vol.averageResponseMinutes} min</div>
              </div>
            `);
          layer.addLayer(marker);
        });
      }

      // Pan to active incident if requested
      if (focusIncidentId && mapInstanceRef.current) {
        const target = incidents.find((i) => i.id === focusIncidentId);
        if (target) {
          mapInstanceRef.current.setView([target.location.lat, target.location.lng], 14, { animate: true });
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [incidents, donors, showIncidents, showDonors, showHospitals, showResponders, focusIncidentId]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl ${heightClass}`}>
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Layer Toggles Floating Control */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 rounded-xl border border-slate-800/90 bg-slate-950/85 p-1.5 backdrop-blur-md shadow-lg">
        <button
          onClick={() => setShowIncidents(!showIncidents)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            showIncidents
              ? 'bg-red-500/20 border-red-500/50 text-red-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
          <span>SOS Incidents ({incidents.length})</span>
        </button>

        <button
          onClick={() => setShowDonors(!showDonors)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            showDonors
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-rose-500"></span>
          <span>Blood Donors</span>
        </button>

        <button
          onClick={() => setShowHospitals(!showHospitals)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            showHospitals
              ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-sky-400"></span>
          <span>Trauma Centers</span>
        </button>

        <button
          onClick={() => setShowResponders(!showResponders)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            showResponders
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>First Responders</span>
        </button>
      </div>

      {/* Map Privacy Watermark Notice */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-950/80 px-2 py-1 text-[10px] text-slate-400 backdrop-blur-sm">
        <ShieldCheck className="h-3 w-3 text-emerald-400" />
        <span>Privacy Shield: Patient GPS Coordinates Fuzzed (±1.5 km)</span>
      </div>
    </div>
  );
}

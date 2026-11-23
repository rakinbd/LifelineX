'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { useEmergency } from '@/context/EmergencyContext';
import { MOCK_FACILITIES } from '@/lib/mockData';
import { ShieldCheck, Map as MapIcon, Globe, Compass, Check } from 'lucide-react';

interface EmergencyMapProps {
  heightClass?: string;
  focusIncidentId?: string;
}

type MapStyle = 'streets' | 'satellite' | 'voyager';

export default function EmergencyMap({ heightClass = 'h-[500px]', focusIncidentId }: EmergencyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const { incidents, donors, activeIncident, setActiveIncident } = useEmergency();

  // Layer filter toggles
  const [showIncidents, setShowIncidents] = useState(true);
  const [showDonors, setShowDonors] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);

  // Real Map Visual Style: Streets (Authentic Colorful), Satellite (Real aerial imagery), Voyager (Modern City)
  const [mapStyle, setMapStyle] = useState<MapStyle>('streets');

  // Tile configuration helper
  const getTileConfig = (style: MapStyle) => {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (mapboxToken) {
      if (style === 'satellite') {
        return {
          url: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`,
          attribution: '&copy; Mapbox &copy; OpenStreetMap',
          maxZoom: 20,
          label: 'Mapbox HD Satellite',
        };
      }
      return {
        url: `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`,
        attribution: '&copy; Mapbox &copy; OpenStreetMap',
        maxZoom: 20,
        label: 'Mapbox HD Streets',
      };
    }

    // 100% Free World Map Layers (No API key needed)
    if (style === 'satellite') {
      return {
        // High-resolution Esri World Imagery (real aerial and satellite photography)
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Satellite &copy; Esri, Maxar, Earthstar Geographics',
        maxZoom: 19,
        label: 'Real Satellite (Esri)',
      };
    }

    if (style === 'voyager') {
      return {
        // Vivid modern city navigation map
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
        label: 'City Voyager',
      };
    }

    // Default: OpenStreetMap Standard (Full-color, real street names, highways, buildings, parks)
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
      label: 'OpenStreetMap Real Streets',
    };
  };

  // 1. Initialize Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [40.74, -73.96],
          zoom: 12,
          zoomControl: false,
        });

        // Add initial tile layer
        const config = getTileConfig(mapStyle);
        tileLayerRef.current = L.tileLayer(config.url, {
          attribution: config.attribution,
          maxZoom: config.maxZoom,
          subdomains: 'abc',
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;
        markersLayerRef.current = L.layerGroup().addTo(map);
      }

      // Update Markers
      const layer = markersLayerRef.current;
      if (!layer) return;
      layer.clearLayers();

      // Custom SVG Marker Generator
      const createTacticalIcon = (color: string, label: string, pulse = false) => {
        return L.divIcon({
          className: 'tactical-marker',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
              ${pulse ? `<div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${color}; opacity: 0.45; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
              <div style="width: 28px; height: 28px; border-radius: 50%; background: #ffffff; border: 3px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.35);">
                <span style="color: ${color}; font-size: 11px; font-weight: 800; font-family: monospace;">${label}</span>
              </div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -17],
        });
      };

      // 1. Incidents (Red Markers)
      if (showIncidents) {
        incidents.forEach((inc) => {
          const isCritical = inc.urgency === 'CRITICAL';
          const icon = createTacticalIcon(isCritical ? '#dc2626' : '#d97706', '!', isCritical);
          
          const marker = L.marker([inc.location.lat, inc.location.lng], { icon })
            .bindPopup(`
              <div style="padding: 4px; font-family: sans-serif; font-size: 12px; color: #0f172a; min-width: 210px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-weight: 700; color: #dc2626; font-size: 11px; font-family: monospace;">${inc.id}</span>
                  <span style="background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; padding: 1px 6px; border-radius: 9999px; font-size: 10px; font-weight: 600;">${inc.urgency}</span>
                </div>
                <div style="font-weight: 700; font-size: 12px; margin-bottom: 2px; color: #0f172a;">${inc.title}</div>
                <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">${inc.location.address}</div>
                <div style="border-top: 1px solid #e2e8f0; padding-top: 6px; font-size: 11px; color: #0284c7;">
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
              color: isCritical ? '#dc2626' : '#d97706',
              fillColor: isCritical ? '#dc2626' : '#d97706',
              fillOpacity: 0.12,
              weight: 1.5,
              dashArray: '4, 4',
            }).addTo(layer);
          }
        });
      }

      // 2. Donors (Rose Markers)
      if (showDonors) {
        donors.forEach((donor) => {
          if (!donor.isAvailable) return;
          const icon = createTacticalIcon('#e11d48', donor.bloodGroup);
          const marker = L.marker([donor.location.lat, donor.location.lng], { icon })
            .bindPopup(`
              <div style="padding: 4px; font-size: 12px; color: #0f172a;">
                <div style="font-weight: bold; color: #e11d48; font-size: 11px;">VERIFIED BLOOD DONOR</div>
                <div style="font-weight: 700; color: #0f172a; margin-top: 2px;">${donor.fullName}</div>
                <div style="color: #475569; font-size: 11px;">Blood: <strong style="color: #be123c;">${donor.bloodGroup}</strong> | ${donor.totalDonations} Donations</div>
                <div style="color: #059669; font-size: 10px; margin-top: 4px; font-weight: 600;">✓ Cooldown Cleared</div>
              </div>
            `);
          layer.addLayer(marker);
        });
      }

      // 3. Hospitals & Trauma Centers (Blue Cross)
      if (showHospitals) {
        MOCK_FACILITIES.forEach((fac) => {
          const icon = createTacticalIcon('#0284c7', '+');
          const marker = L.marker([fac.location.lat, fac.location.lng], { icon })
            .bindPopup(`
              <div style="padding: 4px; font-size: 12px; color: #0f172a;">
                <div style="font-weight: bold; color: #0284c7; font-size: 11px;">${fac.type.replace('_', ' ')}</div>
                <div style="font-weight: 700; color: #0f172a; margin-top: 2px;">${fac.name}</div>
                <div style="color: #475569; font-size: 11px; margin-top: 3px;">
                  ICU Beds: <strong style="color: #059669;">${fac.availableBeds}</strong> | Fleet: <strong style="color: #0f172a;">${fac.ambulancesAvailable}</strong>
                </div>
                <div style="color: #0284c7; font-size: 11px; margin-top: 3px; font-weight: 600;">Hotline: ${fac.emergencyHotline}</div>
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
  }, [incidents, donors, showIncidents, showDonors, showHospitals, focusIncidentId]);

  // 2. Smoothly Switch Map Tiles when User Changes Style (Street / Satellite / City)
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === 'undefined') return;

    import('leaflet').then((L) => {
      if (tileLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }
      const config = getTileConfig(mapStyle);
      const newLayer = L.tileLayer(config.url, {
        attribution: config.attribution,
        maxZoom: config.maxZoom,
        subdomains: 'abc',
      });
      newLayer.addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
    });
  }, [mapStyle]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md ${heightClass}`}>
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left: Layer Toggles Floating Control */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white/95 p-1.5 backdrop-blur-md shadow-md">
        <button
          onClick={() => setShowIncidents(!showIncidents)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
            showIncidents
              ? 'bg-red-50 border-red-200 text-red-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-red-600"></span>
          <span>SOS Incidents ({incidents.length})</span>
        </button>

        <button
          onClick={() => setShowDonors(!showDonors)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
            showDonors
              ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-rose-600"></span>
          <span>Blood Donors</span>
        </button>

        <button
          onClick={() => setShowHospitals(!showHospitals)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
            showHospitals
              ? 'bg-sky-50 border-sky-200 text-sky-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-sky-600"></span>
          <span>Trauma Centers</span>
        </button>
      </div>

      {/* Top Right: Real Map Style Switcher (Street / Satellite / City) */}
      <div className="absolute top-3 right-3 z-10 flex items-center rounded-xl border border-slate-200 bg-white/95 p-1 backdrop-blur-md shadow-md">
        <button
          onClick={() => setMapStyle('streets')}
          title="Vibrant real street map with roads, rivers & neighborhoods"
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
            mapStyle === 'streets'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MapIcon className="h-3.5 w-3.5" />
          <span>Real Streets</span>
        </button>

        <button
          onClick={() => setMapStyle('satellite')}
          title="Real aerial satellite photography from space"
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
            mapStyle === 'satellite'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>Satellite</span>
        </button>

        <button
          onClick={() => setMapStyle('voyager')}
          title="Clean city navigation view"
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
            mapStyle === 'voyager'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>City View</span>
        </button>
      </div>

      {/* Bottom Left: Map Privacy Watermark Notice */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1 text-[10px] text-slate-600 backdrop-blur-sm shadow-sm font-medium">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Privacy Shield: Patient GPS Obfuscated (±1.5 km)</span>
      </div>
    </div>
  );
}

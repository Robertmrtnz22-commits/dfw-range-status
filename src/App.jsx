import { useState, useRef } from 'react';

const COURSES = [
  { id: 1,  name: 'Tour 18 Golf Course',       city: 'Flower Mound',         phone: '(972) 355-8920', rating: 4.5, zip: '75022' },
  { id: 4,  name: 'Texas Star Golf Course',     city: 'Euless',               phone: '(817) 685-7888', rating: 4.2, zip: '76039' },
  { id: 5,  name: 'Firewheel Golf Park',        city: 'Garland',              phone: '(972) 205-2795', rating: 4.1, zip: '75040' },
  { id: 6,  name: 'Cowboys Golf Club',          city: 'Grapevine',            phone: '(817) 481-7277', rating: 4.6, zip: '76051' },
  { id: 7,  name: 'Tierra Verde Golf Club',     city: 'Arlington',            phone: '(817) 572-4653', rating: 4.0, zip: '76011' },
  { id: 8,  name: 'Woodbridge Golf Club',       city: 'Wylie',                phone: '(972) 429-5100', rating: 3.9, zip: '75098' },
  { id: 9,  name: 'Tangle Ridge Golf Club',     city: 'Grand Prairie',        phone: '(972) 299-6837', rating: 4.2, zip: '75050' },
  { id: 10, name: 'Bear Creek Golf Club',       city: 'Dallas',               phone: '(972) 247-0492', rating: 3.8, zip: '75241' },
  { id: 11, name: 'Pecan Hollow Golf Course',   city: 'Plano',                phone: '(972) 941-7600', rating: 4.0, zip: '75025' },
  { id: 12, name: 'Tenison Highlands',          city: 'Dallas',               phone: '(214) 670-1402', rating: 3.7, zip: '75217' },
  { id: 13, name: 'Iron Horse Golf Course',     city: 'North Richland Hills', phone: '(817) 485-6666', rating: 4.1, zip: '76180' },
  { id: 14, name: 'Hyatt Bear Creek Golf',      city: 'Irving',               phone: '(972) 615-6800', rating: 4.3, zip: '75039' },
  { id: 15, name: 'The Tribute Golf Club',      city: 'The Colony',           phone: '(469) 609-7200', rating: 4.7, zip: '75056' },
  { id: 16, name: 'Stonebridge Ranch CC',       city: 'McKinney',             phone: '(972) 529-7888', rating: 4.5, zip: '75070' },
  { id: 17, name: 'Golf Club at Fossil Creek',  city: 'Fort Worth',           phone: '(817) 763-4653', rating: 4.4, zip: '76109' },
];

const TIERS = [
  { name: 'Rookie',         min: 0,   max: 9,        emoji: '🐣', color: '#8b8b6a' },
  { name: 'Regular',        min: 10,  max: 24,       emoji: '🏌️', color: '#6a9a6a' },
  { name: 'Local Expert',   min: 25,  max: 49,       emoji: '⛳', color: '#4a9a7a' },
  { name: 'Range Scout',    min: 50,  max: 99,       emoji: '🔭', color: '#4a7aaa' },
  { name: 'Trusted Source', min: 100, max: Infinity, emoji: '🏆', color: '#c8a850' },
];

// Zip code coordinates for distance-based search
const ZIP_COORDS = {
  // North DFW
  '75022': { lat: 33.0232, lng: -96.8292 }, // Flower Mound
  '75098': { lat: 32.9974, lng: -96.3433 }, // Wylie
  '75025': { lat: 33.0251, lng: -96.7490 }, // Plano
  '75070': { lat: 33.1959, lng: -96.6397 }, // McKinney
  '75056': { lat: 33.0916, lng: -96.4596 }, // The Colony
  '75013': { lat: 33.1032, lng: -96.6987 }, // Allen
  '75024': { lat: 33.0812, lng: -96.8036 }, // Plano
  '75023': { lat: 33.0617, lng: -96.7267 }, // Plano
  
  // Central DFW
  '75217': { lat: 32.7813, lng: -96.7944 }, // Dallas
  '75241': { lat: 32.6886, lng: -96.5151 }, // Dallas
  '75039': { lat: 32.8343, lng: -96.9487 }, // Irving
  '76011': { lat: 32.7127, lng: -97.1070 }, // Arlington
  '76051': { lat: 32.9344, lng: -97.0769 }, // Grapevine
  '76180': { lat: 32.8345, lng: -97.2347 }, // North Richland Hills
  '75229': { lat: 32.8944, lng: -96.8733 }, // Dallas
  '75201': { lat: 32.7767, lng: -96.7967 }, // Dallas Downtown
  
  // East DFW
  '75040': { lat: 32.9132, lng: -96.6391 }, // Garland
  '75041': { lat: 32.8812, lng: -96.6367 }, // Garland
  '75042': { lat: 32.9158, lng: -96.6694 }, // Garland
  
  // West DFW
  '75050': { lat: 32.6452, lng: -97.0082 }, // Grand Prairie
  '76039': { lat: 32.8379, lng: -97.1976 }, // Euless
  '76109': { lat: 32.7555, lng: -97.3308 }, // Fort Worth
  '76117': { lat: 32.6800, lng: -97.2800 }, // Fort Worth
  '76137': { lat: 32.8658, lng: -97.2917 }, // Fort Worth
  '76132': { lat: 32.6644, lng: -97.4167 }, // Fort Worth
  '75052': { lat: 32.6767, lng: -97.0267 }, // Grand Prairie
};

// Calculate distance between two coordinates in miles (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function getZipCoords(zip) {
  return ZIP_COORDS[zip] || null;
}

// Enhanced zip code search that handles unknown zip codes
function searchByZipCode(searchZip) {
  let searchCoords = getZipCoords(searchZip);
  
  if (!searchCoords) {
    // For unknown zip codes, show all courses (could implement API lookup later)
    return COURSES;
  }
  
  // Filter courses within 20 miles and sort by distance (closest first)
  return COURSES.filter(c => {
    const courseCoords = getZipCoords(c.zip);
    if (!courseCoords) return false;
    const distance = calculateDistance(searchCoords.lat, searchCoords.lng, courseCoords.lat, courseCoords.lng);
    return distance <= 20;
  }).sort((a, b) => {
    const aCoords = getZipCoords(a.zip);
    const bCoords = getZipCoords(b.zip);
    const aDist = calculateDistance(searchCoords.lat, searchCoords.lng, aCoords.lat, aCoords.lng);
    const bDist = calculateDistance(searchCoords.lat, searchCoords.lng, bCoords.lat, bCoords.lng);
    // Sort by distance ascending (closest first)
    return aDist - bDist;
  });
}

// Check if query looks like a zip code (5 digits)
function isZipCodeQuery(query) {
  return /^\d{5}$/.test(query.trim());
}

function getTier(r) {
  return TIERS.find(t => r >= t.min && r <= t.max) || TIERS[0];
}

function getStatus(v) {
  if (!v) return 'unknown';
  const tot = v.open + v.limited + v.closed;
  if (tot === 0) return 'unknown';
  if (v.open >= v.limited && v.open >= v.closed) return 'open';
  if (v.limited >= v.closed) return 'limited';
  return 'closed';
}

function getSurface(s) {
  if (!s || (s.grass === 0 && s.mats === 0)) return 'unknown';
  return s.grass >= s.mats ? 'grass' : 'mats';
}

function getBusy(b) {
  if (!b || b.empty + b.moderate + b.packed === 0) return 'unknown';
  if (b.empty >= b.moderate && b.empty >= b.packed) return 'empty';
  if (b.moderate >= b.packed) return 'moderate';
  return 'packed';
}

function getAccPct(a) {
  if (!a || a.total === 0) return null;
  return Math.round((a.correct / a.total) * 100);
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function seedVotes() {
  return Object.fromEntries(COURSES.map(c => {
    return [c.id, {
      open:    0,
      limited: 0,
      closed:  0,
      lastVote: null,
      note:    null,
      userVote: null,
    }];
  }));
}

function seedSurface() {
  return Object.fromEntries(COURSES.map(c => {
    return [c.id, { grass: 0, mats: 0, userVote: null }];
  }));
}

function seedBusy() {
  return Object.fromEntries(COURSES.map(c => {
    return [c.id, { empty: 0, moderate: 0, packed: 0, userVote: null }];
  }));
}

function seedAccuracy() {
  return Object.fromEntries(COURSES.map((c, i) => {
    const p = i % 7;
    const total = [22,16,32,11,28,9,20][p];
    const correct = Math.round(total * [0.91,0.875,0.94,0.82,0.89,0.78,0.90][p]);
    return [c.id, { correct, total, userFeedback: null }];
  }));
}

const STATUS_META = {
  open:    { label: '✅ OPEN',    cls: 'open',    dot: 'open'    },
  limited: { label: '⚠️ LIMITED', cls: 'limited', dot: 'limited' },
  closed:  { label: '⛔ CLOSED',  cls: 'closed',  dot: 'closed'  },
  unknown: { label: '❓ UNKNOWN', cls: 'unknown', dot: 'unknown' },
};
const SURF_META = {
  grass:   { label: '🌿 GRASS', cls: 'grass'       },
  mats:    { label: '🟦 MATS',  cls: 'mats'        },
  unknown: { label: '❓ SURF?', cls: 'surf-unknown' },
};
const BUSY_META = {
  empty:    { label: '🟢 EMPTY',    cls: 'empty'   },
  moderate: { label: '🟡 MODERATE', cls: 'moderate'},
  packed:   { label: '🔴 PACKED',   cls: 'packed'  },
  unknown:  { label: '❓ BUSY?',    cls: 'unknown' },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#0f1a0f;color:#e8f0e8;font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden}
.app{max-width:480px;margin:0 auto;min-height:100vh;position:relative}

/* HEADER */
.hdr{background:linear-gradient(135deg,#0a120a 0%,#152415 100%);padding:14px 16px 10px;border-bottom:1px solid #2a3a2a}
.hdr-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.logo-row{display:flex;align-items:center;gap:9px}
.logo-svg{width:34px;height:34px;flex-shrink:0}
.app-title{font-family:'Bebas Neue',sans-serif;font-size:25px;letter-spacing:1px;color:#7ecb7e;line-height:1}
.tier-badge{display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.3px}
.hdr-meta{display:flex;align-items:center;gap:12px;font-size:13px;color:#8aaa8a;margin-bottom:7px}
.streak{display:flex;align-items:center;gap:3px;font-weight:700;color:#f0a020}
.rpt-count{color:#7ecb7e;font-weight:700}
.stats-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.sc{display:flex;align-items:center;gap:4px;padding:3px 8px;border-radius:12px;font-size:12px;font-weight:700;background:#131f13}
.sc.open{color:#5cd65c;border:1px solid #2a5a2a}
.sc.limited{color:#f0c040;border:1px solid #4a4a10}
.sc.closed{color:#f05050;border:1px solid #4a1a1a}
.sc.unknown{color:#8aaa8a;border:1px solid #2a3a2a}
.sc.saved{color:#e060a0;border:1px solid #4a1a3a}
.add-btn{background:#3a6a3a;color:#fff;border:none;border-radius:20px;padding:5px 12px;font-size:13px;font-weight:700;cursor:pointer;margin-left:auto;transition:background .2s}
.add-btn:hover{background:#4a8a4a}

/* TABS */
.tabs{display:flex;background:#0a120a;border-bottom:1px solid #2a3a2a;position:sticky;top:0;z-index:90}
.tab-btn{flex:1;padding:12px 2px;background:none;border:none;color:#5a7a5a;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;border-bottom:3px solid transparent;transition:color .15s,border-color .15s}
.tab-btn.active{color:#7ecb7e;border-bottom-color:#7ecb7e}

/* CARDS */
.cards-list{padding:12px;display:flex;flex-direction:column;gap:12px}
.card{background:#1a2a1a;border-radius:14px;padding:14px;border:1px solid #2a3a2a;position:relative}
.card-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;gap:12px}
.card-info-left{flex:1;display:flex;gap:8px;align-items:flex-start}
.card-info-col{flex:1}
.card-info-top{flex:1}
.card-name{font-family:'Bebas Neue',sans-serif;font-size:17px;color:#c8e8c8;letter-spacing:.5px;line-height:1.2}
.card-city{font-size:12px;color:#7a9a7a;margin-top:2px}
.card-phone{font-size:12px;color:#5a7a5a}
.card-status-badge{display:flex;flex-direction:row;gap:3px;align-items:center;flex-shrink:0}
.card-info-bottom{display:flex;justify-content:space-between;align-items:center;margin-top:6px;margin-bottom:8px}
.star-row{display:flex;align-items:center;gap:4px;margin-top:2px}
.stars{color:#c8a850;font-size:12px;letter-spacing:1px}
.rating-num{font-size:12px;color:#7a9a7a}
.distance-display{font-size:11px;color:#5a8a5a;margin-top:3px;font-weight:600}
.card-actions-right{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0}
.action-buttons{display:flex;gap:6px}
.icon-btn{background:none;border:none;cursor:pointer;font-size:19px;padding:1px;line-height:1;transition:transform .15s}
.icon-btn:hover{transform:scale(1.25)}
.badge-group{display:flex;flex-direction:column;align-items:flex-end;gap:4px;min-width:82px;flex-shrink:0}
.badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.3px;white-space:nowrap}
.badge.open{background:#0f2a0f;color:#5cd65c;border:1px solid #2a5a2a}
.badge.limited{background:#2a2808;color:#f0c040;border:1px solid #5a4a10}
.badge.closed{background:#2a0808;color:#f05050;border:1px solid #5a1a1a}
.badge.unknown{background:#1a2a1a;color:#7a9a7a;border:1px solid #2a3a2a}
.badge.grass{background:#0f2a18;color:#50c878;border:1px solid #2a5a30}
.badge.mats{background:#0a1a30;color:#5090e0;border:1px solid #1a3060}
.badge.surf-unknown{background:#1a2a1a;color:#7a9a7a;border:1px solid #2a3a2a}
.badge.empty{background:#0f2a0f;color:#5cd65c;border:1px solid #2a5a2a}
.badge.moderate{background:#252508;color:#d0c040;border:1px solid #4a4a10}
.badge.packed{background:#2a0808;color:#f05050;border:1px solid #5a1a1a}
.pdot{width:5px;height:5px;border-radius:50%;flex-shrink:0;animation:pulse 2s infinite}
.pdot.open{background:#5cd65c}
.pdot.limited{background:#f0c040}
.pdot.closed{background:#f05050;animation:none}
.pdot.unknown{background:#7a9a7a;animation:none}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}

/* ACCURATE ROW */
.acc-row{display:flex;align-items:center;justify-content:space-between;margin:8px 0;padding:6px 10px;background:#131f13;border-radius:8px;border:1px solid #252f25}
.acc-pct{font-size:13px;font-weight:700;color:#7ecb7e}
.acc-no-data{font-size:12px;color:#5a7a5a}
.acc-btn{background:#222e22;border:1px solid #3a4a3a;color:#7ecb7e;border-radius:8px;padding:3px 10px;font-size:12px;font-weight:700;cursor:pointer;transition:background .15s}
.acc-btn:hover{background:#3a5a3a}

/* NOTE */
.last-note{font-size:12px;color:#8aaa8a;font-style:italic;margin-bottom:8px;padding:5px 8px;background:#131f13;border-radius:6px;border-left:3px solid #3a5a3a}

/* VOTE SECTIONS */
.vsec{margin-bottom:8px}
.vlbl{font-size:10px;font-weight:800;color:#5a7a5a;text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px}
.vrow{display:flex;gap:5px}
.vbtn{flex:1;min-width:0;display:flex;align-items:center;justify-content:center;gap:3px;padding:6px 3px;border-radius:8px;border:1px solid #252f25;background:#131f13;color:#c8e8c8;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;cursor:pointer;transition:background .15s,border-color .15s;white-space:nowrap}
.vbtn:hover{background:#1a2a1a;border-color:#3a4a3a}
.vbtn.sel-open{background:#0f2a0f;border-color:#5cd65c;color:#5cd65c}
.vbtn.sel-limited{background:#252508;border-color:#f0c040;color:#f0c040}
.vbtn.sel-closed{background:#2a0808;border-color:#f05050;color:#f05050}
.vbtn.sel-grass{background:#0f2a18;border-color:#50c878;color:#50c878}
.vbtn.sel-mats{background:#0a1a30;border-color:#5090e0;color:#5090e0}
.vbtn.sel-empty{background:#0f2a0f;border-color:#5cd65c;color:#5cd65c}
.vbtn.sel-moderate{background:#252508;border-color:#d0c040;color:#d0c040}
.vbtn.sel-packed{background:#2a0808;border-color:#f05050;color:#f05050}
.vcnt{font-size:10px;color:#5a7a5a;font-weight:500}

/* VOTE BAR */
.vbar{height:4px;border-radius:2px;background:#131f13;display:flex;overflow:hidden;margin:5px 0}
.vb-open{background:#5cd65c;transition:width .4s}
.vb-limited{background:#f0c040;transition:width .4s}
.vb-closed{background:#f05050;transition:width .4s}

/* DIVIDER */
.divider{border:none;border-top:1px solid #252f25;margin:8px 0}

/* FOOTER */
.card-foot{font-size:11px;color:#4a6a4a;display:flex;gap:5px;flex-wrap:wrap;align-items:center;margin-top:4px}
.fdot{color:#2a4a2a}

/* EMPTY STATE */
.empty{text-align:center;padding:60px 20px;color:#4a6a4a}
.empty-icon{font-size:48px;margin-bottom:12px}
.empty-title{font-family:'Bebas Neue',sans-serif;font-size:22px;color:#6a8a6a;margin-bottom:6px}

/* ALERTS */
.alerts-list{padding:12px;display:flex;flex-direction:column;gap:10px}
.alert-item{background:#1a2a1a;border:1px solid #2a3a2a;border-radius:12px;padding:12px;display:flex;align-items:center;justify-content:space-between;gap:10px}
.alert-info{flex:1;min-width:0}
.alert-name{font-weight:700;font-size:14px;color:#c8e8c8}
.alert-email{font-size:12px;color:#5a7a5a;margin-top:2px}
.alert-badges{display:flex;gap:5px;margin-top:5px;flex-wrap:wrap}
.rm-btn{background:#2a0808;border:1px solid #5a1818;color:#f05050;border-radius:8px;padding:4px 10px;font-size:12px;font-weight:700;cursor:pointer;transition:background .15s;white-space:nowrap}
.rm-btn:hover{background:#4a0a0a}

/* PROFILE */
.profile{padding:12px}
.tier-card{background:#1a2a1a;border-radius:14px;padding:18px;border:1px solid #2a3a2a;margin-bottom:12px}
.tier-top{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.tier-emoji{font-size:38px}
.tier-name{font-family:'Bebas Neue',sans-serif;font-size:24px;color:#7ecb7e}
.tier-sub{font-size:12px;color:#5a7a5a}
.prog-bg{height:8px;border-radius:4px;background:#131f13;overflow:hidden;border:1px solid #2a3a2a}
.prog-fill{height:100%;border-radius:4px;transition:width .5s}
.prog-lbl{font-size:11px;color:#5a7a5a;margin-top:4px;text-align:right}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}
.stat-card{background:#1a2a1a;border:1px solid #2a3a2a;border-radius:10px;padding:12px 8px;text-align:center}
.stat-val{font-family:'Bebas Neue',sans-serif;font-size:28px;color:#7ecb7e;line-height:1}
.stat-lbl{font-size:11px;color:#5a7a5a;margin-top:2px}
.ladder{background:#1a2a1a;border-radius:14px;padding:14px;border:1px solid #2a3a2a}
.ladder-title{font-family:'Bebas Neue',sans-serif;font-size:18px;color:#7ecb7e;margin-bottom:10px;letter-spacing:.5px}
.rung{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;margin-bottom:5px;border:1px solid transparent}
.rung.cur{border-color:#3a5a3a}
.rung.unlocked{opacity:.6}
.rung.locked{opacity:.3}
.rung-emoji{font-size:20px}
.rung-name{font-weight:700;font-size:14px;flex:1}
.rung-req{font-size:12px;color:#5a7a5a}
.rung-status{font-size:12px;font-weight:800}
.rung-status.done{color:#5cd65c}
.rung-status.here{color:#f0c040}

/* MODALS */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:200;display:flex;align-items:flex-end;justify-content:center}
.modal{background:#1a2a1a;border-radius:18px 18px 0 0;padding:20px;width:100%;max-width:480px;border-top:2px solid #3a5a3a;animation:slideUp .25s ease-out}
@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
.modal-title{font-family:'Bebas Neue',sans-serif;font-size:22px;color:#7ecb7e;margin-bottom:12px;letter-spacing:.5px}
.modal-lbl{font-size:13px;color:#7a9a7a;margin-bottom:6px}
.modal-ta{width:100%;background:#131f13;border:1px solid #2a3a2a;border-radius:8px;color:#c8e8c8;font-family:'DM Sans',sans-serif;font-size:14px;padding:10px;resize:none;height:76px;margin-bottom:12px;outline:none}
.modal-ta:focus{border-color:#5a8a5a}
.modal-in{width:100%;background:#131f13;border:1px solid #2a3a2a;border-radius:8px;color:#c8e8c8;font-family:'DM Sans',sans-serif;font-size:14px;padding:10px;margin-bottom:10px;outline:none}
.modal-in:focus{border-color:#5a8a5a}
.modal-row{display:flex;gap:8px;margin-top:4px}
.mbtn{flex:1;padding:12px;border-radius:10px;border:none;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:background .15s}
.mbtn.confirm{background:#3a6a3a;color:#fff}
.mbtn.confirm:hover{background:#4a8a4a}
.mbtn.cancel{background:#222;color:#8aaa8a}
.mbtn.cancel:hover{background:#333}
.mbtn.yes{background:#0f2a0f;color:#5cd65c;border:1px solid #2a5a2a}
.mbtn.yes:hover{background:#1a3a1a}
.mbtn.no{background:#2a0808;color:#f05050;border:1px solid #5a1a1a}
.mbtn.no:hover{background:#3a0a0a}

/* TOAST */
.toast{position:fixed;top:0;left:50%;transform:translateX(-50%);background:#1a3a1a;border:1px solid #3a7a3a;color:#7ecb7e;padding:12px 20px;border-radius:0 0 14px 14px;font-size:14px;font-weight:700;z-index:300;max-width:460px;width:calc(100% - 24px);text-align:center;animation:slideDown .3s ease-out;box-shadow:0 4px 20px rgba(0,0,0,.5)}
@keyframes slideDown{from{transform:translateX(-50%) translateY(-100%);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}

.tab-content{padding-bottom:80px}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:#0f1a0f}
::-webkit-scrollbar-thumb{background:#2a4a2a;border-radius:2px}
`;

export default function App() {
  const [tab, setTab]         = useState('ranges');
  const [votes, setVotes]     = useState(() => {
    const today = getToday();
    const lastReset = localStorage.getItem('lastReset');
    if (lastReset !== today) {
      localStorage.setItem('lastReset', today);
      return seedVotes();
    }
    const stored = localStorage.getItem('votes');
    return stored ? JSON.parse(stored) : seedVotes();
  });
  const [surface, setSurface] = useState(() => {
    const today = getToday();
    const lastReset = localStorage.getItem('lastReset');
    if (lastReset !== today) return seedSurface();
    const stored = localStorage.getItem('surface');
    return stored ? JSON.parse(stored) : seedSurface();
  });
  const [busy, setBusy]       = useState(() => {
    const today = getToday();
    const lastReset = localStorage.getItem('lastReset');
    if (lastReset !== today) return seedBusy();
    const stored = localStorage.getItem('busy');
    return stored ? JSON.parse(stored) : seedBusy();
  });
  const [accuracy, setAcc]    = useState(seedAccuracy);
  const [favorites, setFavs]  = useState(() => new Set());
  const [alerts, setAlerts]   = useState({});
  const [reports, setReports] = useState(7);
  const [streak]              = useState(3);
  const [cities, setCities]   = useState(() => new Set(['Dallas', 'Allen']));

  const [voteModal,    setVoteModal]    = useState(null);
  const [noteText,     setNoteText]     = useState('');
  const [accModal,     setAccModal]     = useState(null);
  const [alertModal,   setAlertModal]   = useState(null);
  const [alertEmail,   setAlertEmail]   = useState('');
  const [addModal,     setAddModal]     = useState(false);
  const [addName,      setAddName]      = useState('');
  const [addCity,      setAddCity]      = useState('');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [toast,        setToast]        = useState(null);
  const toastRef = useRef(null);

  // Track search context for displaying distances
  const searchContext = useRef({ type: null, zipCode: null });

  function showToast(msg) {
    setToast(msg);
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 6000);
  }

  function toggleFav(cid) {
    setFavs(prev => {
      const next = new Set(prev);
      if (next.has(cid)) { next.delete(cid); }
      else {
        next.add(cid);
        showToast(`❤️ ${COURSES.find(c => c.id === cid).name} saved!`);
      }
      return next;
    });
  }

  function openVoteModal(cid, type, val) {
    setVoteModal({ cid, type, val });
    setNoteText('');
  }

  function confirmVote() {
    if (!voteModal) return;
    const { cid, type, val } = voteModal;
    const course = COURSES.find(c => c.id === cid);

    if (type === 'status') {
      const prev = getStatus(votes[cid]);
      setVotes(p => {
        const updated = {
          ...p,
          [cid]: { ...p[cid], [val]: p[cid][val] + 1, lastVote: Date.now(), note: noteText || p[cid].note, userVote: val }
        };
        localStorage.setItem('votes', JSON.stringify(updated));
        return updated;
      });
      if (favorites.has(cid) && prev !== val) {
        const lbl = { open: '✅ Open', limited: '⚠️ Limited', closed: '⛔ Closed' }[val];
        showToast(`🔔 ${course.name} is now ${lbl}!`);
      }
    } else if (type === 'surface') {
      setSurface(p => {
        const updated = { ...p, [cid]: { ...p[cid], [val]: p[cid][val] + 1, userVote: val } };
        localStorage.setItem('surface', JSON.stringify(updated));
        return updated;
      });
    } else {
      setBusy(p => {
        const updated = { ...p, [cid]: { ...p[cid], [val]: p[cid][val] + 1, userVote: val } };
        localStorage.setItem('busy', JSON.stringify(updated));
        return updated;
      });
    }

    setReports(r => r + 1);
    setCities(p => new Set([...p, course.city]));
    setVoteModal(null);
  }

  function submitAcc(cid, ok) {
    setAcc(p => ({
      ...p,
      [cid]: { correct: ok ? p[cid].correct + 1 : p[cid].correct, total: p[cid].total + 1, userFeedback: ok ? 'yes' : 'no' }
    }));
    setAccModal(null);
  }

  function subscribeAlert(cid) {
    if (!alertEmail.trim()) return;
    setAlerts(p => ({ ...p, [cid]: alertEmail.trim() }));
    setAlertModal(null);
    setAlertEmail('');
    showToast(`🔔 Alert set for ${COURSES.find(c => c.id === cid).name}!`);
  }

  function removeAlert(cid) {
    setAlerts(p => { const n = { ...p }; delete n[cid]; return n; });
  }

  // Derived stats
  const statusCounts = COURSES.reduce((acc, c) => {
    const s = getStatus(votes[c.id]);
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const tier = getTier(reports);
  const tierIdx = TIERS.indexOf(tier);
  const nextTier = TIERS[tierIdx + 1];
  const tierProg = nextTier ? Math.min(((reports - tier.min) / (tier.max - tier.min + 1)) * 100, 100) : 100;
  const userAccPct = (() => {
    const fb = Object.values(accuracy).filter(a => a.userFeedback !== null);
    return fb.length ? Math.round(fb.filter(a => a.userFeedback === 'yes').length / fb.length * 100) : 94;
  })();

  function stars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? '½' : '';
    return '★'.repeat(full) + half + '☆'.repeat(5 - full - (half ? 1 : 0));
  }

  function renderCard(course) {
    const v = votes[course.id];
    const s = surface[course.id];
    const b = busy[course.id];
    const a = accuracy[course.id];

    const status   = getStatus(v);
    const surf     = getSurface(s);
    const busySt   = getBusy(b);
    const accPct   = getAccPct(a);

    const tot = v.open + v.limited + v.closed;
    const openPct    = tot > 0 ? (v.open    / tot) * 100 : 0;
    const limitedPct = tot > 0 ? (v.limited / tot) * 100 : 0;
    const closedPct  = tot > 0 ? (v.closed  / tot) * 100 : 0;
    const lastMin    = v.lastVote ? Math.floor((Date.now() - v.lastVote) / 60000) : null;
    const sm = STATUS_META[status];
    const sfm = SURF_META[surf];
    const bm = BUSY_META[busySt];

    // Calculate distance for zip code searches
    let distanceDisplay = null;
    if (searchContext.current.type === 'zip' && searchContext.current.zipCode) {
      const searchCoords = getZipCoords(searchContext.current.zipCode);
      const courseCoords = getZipCoords(course.zip);
      if (searchCoords && courseCoords) {
        const distance = calculateDistance(searchCoords.lat, searchCoords.lng, courseCoords.lat, courseCoords.lng);
        distanceDisplay = <div className="distance-display">📍 {distance.toFixed(1)} miles away</div>;
      }
    }

    return (
      <div key={course.id} className="card">
        <div className="card-hdr">
          <div className="card-info-left">
            <div className="card-info-col">
              <div className="card-name">{course.name}</div>
              <div className="card-city">{course.city}</div>
              <div className="card-phone">{course.phone} • {course.zip}</div>
              <div className="star-row">
                <span className="stars">{stars(course.rating)}</span>
                <span className="rating-num">{course.rating}</span>
              </div>
              {distanceDisplay}
            </div>
          </div>
          <div className="card-actions-right">
            <div className="action-buttons">
              <button className="icon-btn" onClick={() => toggleFav(course.id)} title="Favorite">
                {favorites.has(course.id) ? '❤️' : '🤍'}
              </button>
              <button className="icon-btn" onClick={() => { setAlertModal(course.id); setAlertEmail(alerts[course.id] || ''); }} title="Alert">
                {alerts[course.id] ? '🔔' : '🔕'}
              </button>
            </div>
            <div className="card-status-badge">
              <span className={`badge ${sm.cls}`}><span className={`pdot ${sm.dot}`}/>{sm.label}</span>
              <span className={`badge ${sfm.cls}`}>{sfm.label}</span>
              <span className={`badge ${bm.cls}`}>{bm.label}</span>
            </div>
          </div>
        </div>

        {/* Accurate? */}
        <div className="acc-row">
          {accPct !== null
            ? <span className="acc-pct">{accPct}% accurate</span>
            : <span className="acc-no-data">No accuracy data</span>}
          <button className="acc-btn" onClick={() => setAccModal(course.id)}>Accurate? 🤔</button>
        </div>

        {/* Last note */}
        {v.note && <div className="last-note">💬 {v.note}</div>}

        {/* Range Status */}
        <div className="vsec">
          <div className="vlbl">Range Status</div>
          {tot === 0 && <div style={{padding:'4px 0 8px 0',fontSize:'12px',color:'#7a9a7a',fontStyle:'italic'}}>👋 Be the first to provide status</div>}
          <div className="vrow">
            {[{k:'open',lbl:'✅ Open'},{k:'limited',lbl:'⚠️ Limited'},{k:'closed',lbl:'⛔ Closed'}].map(o => (
              <button key={o.k} className={`vbtn${v.userVote===o.k ? ` sel-${o.k}` : ''}`}
                onClick={() => openVoteModal(course.id,'status',o.k)}>
                <span>{o.lbl}</span><span className="vcnt">({v[o.k]})</span>
              </button>
            ))}
          </div>
          {tot > 0 && <div className="vbar">
            <div className="vb-open"    style={{width:`${openPct}%`}}/>
            <div className="vb-limited" style={{width:`${limitedPct}%`}}/>
            <div className="vb-closed"  style={{width:`${closedPct}%`}}/>
          </div>}
        </div>

        <hr className="divider"/>

        {/* Hitting Surface */}
        <div className="vsec">
          <div className="vlbl">Hitting Surface</div>
          {s.grass + s.mats === 0 && <div style={{padding:'4px 0 8px 0',fontSize:'12px',color:'#7a9a7a',fontStyle:'italic'}}>👋 Be the first to provide surface info</div>}
          <div className="vrow">
            {[{k:'grass',lbl:'🌿 Grass'},{k:'mats',lbl:'🟦 Mats'}].map(o => (
              <button key={o.k} className={`vbtn${s.userVote===o.k ? ` sel-${o.k}` : ''}`}
                onClick={() => openVoteModal(course.id,'surface',o.k)}>
                <span>{o.lbl}</span><span className="vcnt">({s[o.k]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* How Busy */}
        <div className="vsec">
          <div className="vlbl">How Busy</div>
          {b.empty + b.moderate + b.packed === 0 && <div style={{padding:'4px 0 8px 0',fontSize:'12px',color:'#7a9a7a',fontStyle:'italic'}}>👋 Be the first to rate how busy</div>}
          <div className="vrow">
            {[{k:'empty',lbl:'🟢 Empty'},{k:'moderate',lbl:'🟡 Moderate'},{k:'packed',lbl:'🔴 Packed'}].map(o => (
              <button key={o.k} className={`vbtn${b.userVote===o.k ? ` sel-${o.k}` : ''}`}
                onClick={() => openVoteModal(course.id,'busy',o.k)}>
                <span>{o.lbl}</span><span className="vcnt">({b[o.k]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="card-foot">
          <span>{tot} reports in last 4h</span>
          {lastMin !== null && <><span className="fdot">·</span><span>last {lastMin < 1 ? 'just now' : `${lastMin}m ago`}</span></>}
          {v.userVote && <><span className="fdot">·</span><span>you: {v.userVote}</span></>}
        </div>
      </div>
    );
  }

  const displayCourses = (() => {
    const query = searchQuery.trim();
    
    // If searching, always search all courses (not restricted by tab/favorites)
    if (query) {
      if (isZipCodeQuery(query)) {
        // Search is a zip code - show ranges within 20 miles
        searchContext.current = { type: 'zip', zipCode: query };
        return searchByZipCode(query);
      } else {
        // Search is not a zip code - search by name and city in all courses
        searchContext.current = { type: 'text', zipCode: null };
        const queryLower = query.toLowerCase();
        return COURSES.filter(c => c.name.toLowerCase().includes(queryLower) || c.city.toLowerCase().includes(queryLower));
      }
    }
    
    // No search query - respect tab selection
    searchContext.current = { type: null, zipCode: null };
    if (tab === 'favorites') {
      return COURSES.filter(c => favorites.has(c.id));
    }
    
    return COURSES;
  })();

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* TOAST */}
        {toast && <div className="toast">{toast}</div>}

        {/* HEADER */}
        <header className="hdr">
          <div className="hdr-top">
            <div className="logo-row">
              <svg className="logo-svg" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="#1a3a1a"/>
                <ellipse cx="20" cy="29" rx="13" ry="3.5" fill="#2a5a2a"/>
                <rect x="19" y="11" width="2" height="15" rx="1" fill="#8aaa8a"/>
                <path d="M13 23 Q12 17 14 15 Q14.5 20 16 23" fill="#5cd65c"/>
                <path d="M17 23 Q16 16 18 14 Q18.5 19 19 23" fill="#7ecb7e"/>
                <path d="M22 23 Q22 16 24 14 Q24 19 24 23" fill="#7ecb7e"/>
                <path d="M26 23 Q26 17 28 15 Q27.5 20 27 23" fill="#5cd65c"/>
              </svg>
              <span className="app-title">DFW Range Status</span>
            </div>
            <span className="tier-badge" style={{background:tier.color+'22',border:`1px solid ${tier.color}44`,color:tier.color}}>
              {tier.emoji} {tier.name}
            </span>
          </div>
          <div className="hdr-meta">
            <span className="streak">🔥 {streak}-day streak</span>
            <span className="rpt-count">📋 {reports} reports</span>
          </div>
          <div className="stats-row">
            <span className="sc open">✅ {statusCounts.open||0} Open</span>
            <span className="sc limited">⚠️ {statusCounts.limited||0} Ltd</span>
            <span className="sc closed">⛔ {statusCounts.closed||0} Closed</span>
            <span className="sc unknown">❓ {statusCounts.unknown||0} ?</span>
            <span className="sc saved">❤️ {favorites.size}</span>
            <button className="add-btn" onClick={() => setAddModal(true)}>+ Add Range</button>
          </div>
        </header>

        {/* TABS */}
        <nav className="tabs">
          <button className={`tab-btn${tab==='ranges'    ? ' active':''}`} onClick={() => setTab('ranges')}>⛳ Ranges</button>
          <button className={`tab-btn${tab==='favorites' ? ' active':''}`} onClick={() => setTab('favorites')}>❤️ Saved</button>
          <button className={`tab-btn${tab==='alerts'    ? ' active':''}`} onClick={() => setTab('alerts')}>
            🔔{Object.keys(alerts).length>0 ? ` (${Object.keys(alerts).length})`:''}
          </button>
          <button className={`tab-btn${tab==='profile'   ? ' active':''}`} onClick={() => setTab('profile')}>My Stats</button>
        </nav>

        {/* CONTENT */}
        <div className="tab-content">

          {/* SEARCH BOX - RANGES & FAVORITES TABS */}
          {(tab==='ranges'||tab==='favorites') && (
            <div style={{padding:'12px',borderBottom:'1px solid #2a3a2a'}}>
              <input 
                type="text" 
                placeholder="🔍 Search by name, city, or zip code..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width:'100%',
                  padding:'10px 14px',
                  borderRadius:'10px',
                  border:'1px solid #2a3a2a',
                  background:'#131f13',
                  color:'#c8e8c8',
                  fontFamily:"'DM Sans',sans-serif",
                  fontSize:'14px',
                  outline:'none',
                  boxSizing:'border-box',
                  transition:'border-color .2s'
                }}
                onFocus={(e) => e.target.style.borderColor='#5a8a5a'}
                onBlur={(e) => e.target.style.borderColor='#2a3a2a'}
              />
            </div>
          )}

          {/* RANGES / FAVORITES */}
          {(tab==='ranges'||tab==='favorites') && (
            <div className="cards-list">
              {displayCourses.length===0 && (
                <div className="empty">
                  <div className="empty-icon">❤️</div>
                  <div className="empty-title">No Saved Ranges</div>
                  <div>Tap the heart on any range to save it here</div>
                </div>
              )}
              {displayCourses.map(c => renderCard(c))}
            </div>
          )}

          {/* ALERTS */}
          {tab==='alerts' && (
            <div className="alerts-list">
              {Object.keys(alerts).length===0 && (
                <div className="empty">
                  <div className="empty-icon">🔔</div>
                  <div className="empty-title">No Active Alerts</div>
                  <div>Tap 🔕 on any range to set a status alert</div>
                </div>
              )}
              {Object.keys(alerts).map(cid => {
                const course = COURSES.find(c => c.id===parseInt(cid));
                const st = getStatus(votes[cid]);
                const sf = getSurface(surface[cid]);
                return (
                  <div key={cid} className="alert-item">
                    <div className="alert-info">
                      <div className="alert-name">{course.name}</div>
                      <div className="alert-email">📧 {alerts[cid]}</div>
                      <div className="alert-badges">
                        <span className={`badge ${STATUS_META[st].cls}`}>{STATUS_META[st].label}</span>
                        <span className={`badge ${SURF_META[sf].cls}`}>{SURF_META[sf].label}</span>
                      </div>
                    </div>
                    <button className="rm-btn" onClick={() => removeAlert(parseInt(cid))}>Remove</button>
                  </div>
                );
              })}
            </div>
          )}

          {/* PROFILE */}
          {tab==='profile' && (
            <div className="profile">
              {/* Tier card */}
              <div className="tier-card">
                <div className="tier-top">
                  <span className="tier-emoji">{tier.emoji}</span>
                  <div>
                    <div className="tier-name">{tier.name}</div>
                    <div className="tier-sub">{reports} reports filed</div>
                  </div>
                </div>
                <div className="prog-bg">
                  <div className="prog-fill" style={{width:`${tierProg}%`,background:tier.color}}/>
                </div>
                <div className="prog-lbl">
                  {nextTier
                    ? `${reports-tier.min} / ${tier.max-tier.min+1} to ${nextTier.name}`
                    : '🏆 Max tier reached!'}
                </div>
              </div>

              {/* Stats grid */}
              <div className="stats-grid">
                {[
                  {val:reports,                    lbl:'Reports Filed'},
                  {val:streak,                     lbl:'Day Streak'},
                  {val:`${userAccPct}%`,            lbl:'Your Accuracy'},
                  {val:favorites.size,             lbl:'Saved Ranges'},
                  {val:Object.keys(alerts).length, lbl:'Active Alerts'},
                  {val:cities.size,                lbl:'Cities Covered'},
                ].map((s,i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-val">{s.val}</div>
                    <div className="stat-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>

              {/* Tier ladder */}
              <div className="ladder">
                <div className="ladder-title">Tier Ladder</div>
                {TIERS.map(t => {
                  const isCur = tier.name===t.name;
                  const isUnlocked = reports>=t.min;
                  const cls = isCur ? 'cur' : isUnlocked ? 'unlocked' : 'locked';
                  return (
                    <div key={t.name} className={`rung ${cls}`}
                      style={{background:isCur?t.color+'0f':'',borderColor:isCur?t.color+'66':'transparent'}}>
                      <span className="rung-emoji">{t.emoji}</span>
                      <div style={{flex:1}}>
                        <div className="rung-name" style={{color:isUnlocked?t.color:'#4a6a4a'}}>{t.name}</div>
                        <div className="rung-req">{t.max===Infinity?`${t.min}+ reports`:`${t.min}–${t.max} reports`}</div>
                      </div>
                      <span className={`rung-status${isCur?' here':isUnlocked?' done':''}`}>
                        {isCur?'← HERE':isUnlocked?'✅':'🔒'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* VOTE MODAL */}
        {voteModal && (
          <div className="overlay" onClick={() => setVoteModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Confirm Report</div>
              <div className="modal-lbl">
                {voteModal.type==='status'  && `Reporting status: ${voteModal.val.toUpperCase()}`}
                {voteModal.type==='surface' && `Reporting surface: ${voteModal.val.toUpperCase()}`}
                {voteModal.type==='busy'    && `Reporting busyness: ${voteModal.val.toUpperCase()}`}
              </div>
              <div className="modal-lbl" style={{marginTop:10}}>Add a note (optional)</div>
              <textarea className="modal-ta" placeholder="e.g. Grass tees in great shape, back bays open…"
                value={noteText} onChange={e => setNoteText(e.target.value)}/>
              <div className="modal-row">
                <button className="mbtn cancel" onClick={() => setVoteModal(null)}>Cancel</button>
                <button className="mbtn confirm" onClick={confirmVote}>Submit Report</button>
              </div>
            </div>
          </div>
        )}

        {/* ACCURACY MODAL */}
        {accModal !== null && (
          <div className="overlay" onClick={() => setAccModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Was This Accurate?</div>
              <div className="modal-lbl">Help improve data quality for {COURSES.find(c=>c.id===accModal)?.name}</div>
              <div className="modal-row" style={{marginTop:16}}>
                <button className="mbtn cancel" onClick={() => setAccModal(null)}>Skip</button>
                <button className="mbtn no"  onClick={() => submitAcc(accModal, false)}>👎 No</button>
                <button className="mbtn yes" onClick={() => submitAcc(accModal, true)}>👍 Yes</button>
              </div>
            </div>
          </div>
        )}

        {/* ALERT MODAL */}
        {alertModal !== null && (
          <div className="overlay" onClick={() => setAlertModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Set Status Alert</div>
              <div className="modal-lbl">Get notified when {COURSES.find(c=>c.id===alertModal)?.name} changes status</div>
              <input className="modal-in" type="email" placeholder="your@email.com"
                value={alertEmail} onChange={e => setAlertEmail(e.target.value)} style={{marginTop:10}}/>
              <div className="modal-row">
                <button className="mbtn cancel" onClick={() => setAlertModal(null)}>Cancel</button>
                <button className="mbtn confirm" onClick={() => subscribeAlert(alertModal)}>Set Alert</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD RANGE MODAL */}
        {addModal && (
          <div className="overlay" onClick={() => setAddModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Add a Range</div>
              <div className="modal-lbl">Range Name</div>
              <input className="modal-in" placeholder="e.g. Topgolf Fort Worth"
                value={addName} onChange={e => setAddName(e.target.value)}/>
              <div className="modal-lbl">City</div>
              <input className="modal-in" placeholder="e.g. Fort Worth"
                value={addCity} onChange={e => setAddCity(e.target.value)}/>
              <div className="modal-row">
                <button className="mbtn cancel" onClick={() => setAddModal(false)}>Cancel</button>
                <button className="mbtn confirm" onClick={() => {
                  if (addName.trim() && addCity.trim()) {
                    showToast(`✅ "${addName}" submitted for review!`);
                    setAddName(''); setAddCity(''); setAddModal(false);
                  }
                }}>Submit</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

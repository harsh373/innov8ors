import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MARKET_LOCATIONS, DELHI_CENTER } from '../utils/marketLocations';
import { formatCurrency } from '../utils/formatters';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MarketData {
  marketName: string;
  actualAvgPrice: number;
  predictedAvgPrice: number;
  deviation: number;
  isAnomaly: boolean;
}

interface MapViewProps {
  data: MarketData[];
}

const MapView = ({ data }: MapViewProps) => {
  const getMarkerColor = (deviation: number): string => {
    const abs = Math.abs(deviation);
    if (abs <= 5) return '#22c55e';
    if (abs <= 15) return '#eab308';
    return '#ef4444';
  };

  const createCustomIcon = (color: string) =>
    L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color:${color};
        width:28px;height:28px;
        border-radius:50%;
        border:3px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,0.35);
      "></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

  return (
    <div style={{ position: 'relative', zIndex: 0, isolation: 'isolate' }}>
      <style>{`
        .leaflet-container { z-index: 0 !important; }
        .leaflet-pane { z-index: 0 !important; }
        .leaflet-top, .leaflet-bottom { z-index: 1 !important; }
        .leaflet-popup { z-index: 2 !important; }
        .leaflet-popup-content { margin: 12px 14px !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px !important; box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important; }
      `}</style>

      <MapContainer
        center={[DELHI_CENTER.lat, DELHI_CENTER.lng]}
        zoom={11}
        style={{
          height: 'clamp(480px, 70vh, 650px)',
          width: '100%',
          borderRadius: '0 0 16px 16px',
          position: 'relative',
          zIndex: 0,
        }}
        minZoom={10}
        maxZoom={15}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data.map((market) => {
          const location = MARKET_LOCATIONS[market.marketName];
          if (!location) return null;

          return (
            <Marker
              key={market.marketName}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(getMarkerColor(market.deviation))}
            >
              <Popup autoPan={true} autoPanPadding={[20, 20]}>
                <div style={{ minWidth: '190px' }}>
                  <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px', color: '#111827' }}>
                    📍 {market.marketName}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                      <span style={{ color: '#6b7280' }}>Actual Price</span>
                      <span style={{ fontWeight: 700, color: '#111827' }}>{formatCurrency(market.actualAvgPrice)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                      <span style={{ color: '#6b7280' }}>AI Predicted</span>
                      <span style={{ fontWeight: 700, color: '#2563eb' }}>{formatCurrency(market.predictedAvgPrice)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                      <span style={{ color: '#6b7280' }}>Deviation</span>
                      <span style={{ fontWeight: 700, color: market.deviation > 0 ? '#dc2626' : '#16a34a' }}>
                        {market.deviation > 0 ? '+' : ''}{market.deviation.toFixed(2)}%
                      </span>
                    </div>
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
                      <span style={{
                        padding: '3px 12px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: market.isAnomaly ? '#fee2e2' : '#dcfce7',
                        color: market.isAnomaly ? '#991b1b' : '#166534',
                      }}>
                        {market.isAnomaly ? '⚠ Anomalous' : '✓ Normal'}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
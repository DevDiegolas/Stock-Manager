// Mock data for Stock Manager prototype

const PRODUCTS = [
  { id: 'p1', name: 'Biquíni Ibiza', sku: 'IBZ-001', category: 'Biquíni', color: 'Coral', sizes: ['P', 'M', 'G'], price: 189.00, stock: 12, status: 'active', photos: 4, created: '2026-04-02' },
  { id: 'p2', name: 'Maiô Acapulco', sku: 'ACP-012', category: 'Maiô', color: 'Preto', sizes: ['P', 'M'], price: 249.00, stock: 3, status: 'active', photos: 6, created: '2026-04-01', low: true },
  { id: 'p3', name: 'Saída Noronha', sku: 'NRN-004', category: 'Saída', color: 'Off-white', sizes: ['Único'], price: 159.00, stock: 0, status: 'active', photos: 3, created: '2026-03-28', out: true },
  { id: 'p4', name: 'Biquíni Jericoacoara', sku: 'JRC-007', category: 'Biquíni', color: 'Verde Água', sizes: ['P', 'M', 'G'], price: 199.00, stock: 18, status: 'active', photos: 5, created: '2026-03-25' },
  { id: 'p5', name: 'Calcinha Copacabana', sku: 'CPC-022', category: 'Calcinha', color: 'Laranja', sizes: ['P', 'M', 'G', 'GG'], price: 89.00, stock: 24, status: 'active', photos: 2, created: '2026-03-22' },
  { id: 'p6', name: 'Sunga Tulum', sku: 'TLM-003', category: 'Sunga', color: 'Azul Marinho', sizes: ['P', 'M', 'G'], price: 119.00, stock: 8, status: 'active', photos: 3, created: '2026-03-18' },
  { id: 'p7', name: 'Biquíni Maragogi', sku: 'MRG-019', category: 'Biquíni', color: 'Tropical', sizes: ['P', 'M'], price: 179.00, stock: 2, status: 'active', photos: 4, created: '2026-03-15', low: true },
  { id: 'p8', name: 'Maiô Buzios', sku: 'BZS-008', category: 'Maiô', color: 'Rosé', sizes: ['M', 'G'], price: 229.00, stock: 0, status: 'inactive', photos: 5, created: '2026-03-10' },
  { id: 'p9', name: 'Saída Morro de SP', sku: 'MSP-011', category: 'Saída', color: 'Listras', sizes: ['P', 'M', 'G'], price: 139.00, stock: 15, status: 'active', photos: 4, created: '2026-03-05' },
  { id: 'p10', name: 'Biquíni Fernando', sku: 'FER-031', category: 'Biquíni', color: 'Coral Neon', sizes: ['P', 'M', 'G'], price: 209.00, stock: 11, status: 'active', photos: 5, created: '2026-03-01' },
];

const CATEGORIES = ['Biquíni', 'Calcinha', 'Sunga', 'Maiô', 'Saída'];

const ACTIVITY = [
  { id: 'a1', type: 'CREATED', product: 'Biquíni Ibiza', user: 'Carla', time: '2h atrás', day: 'Hoje' },
  { id: 'a2', type: 'UPDATED', product: 'Maiô Acapulco', detail: 'Estoque 8 → 3', user: 'Carla', time: '4h atrás', day: 'Hoje' },
  { id: 'a3', type: 'VIEWED', product: 'Vitrine pública', detail: '47 visitas', user: 'Sistema', time: '5h atrás', day: 'Hoje' },
  { id: 'a4', type: 'DELETED', product: 'Short Praia Havaí', user: 'Carla', time: '1 dia atrás', day: 'Ontem' },
  { id: 'a5', type: 'UPDATED', product: 'Saída Noronha', detail: 'Preço R$179 → R$159', user: 'Carla', time: '1 dia atrás', day: 'Ontem' },
  { id: 'a6', type: 'CREATED', product: 'Calcinha Copacabana', user: 'Carla', time: '2 dias atrás', day: 'Ontem' },
  { id: 'a7', type: 'TOGGLED', product: 'Maiô Buzios', detail: 'Ativo → Inativo', user: 'Carla', time: '3 dias atrás', day: 'Esta semana' },
  { id: 'a8', type: 'SHARED', product: 'Link da vitrine', detail: 'Instagram stories', user: 'Carla', time: '4 dias atrás', day: 'Esta semana' },
  { id: 'a9', type: 'CREATED', product: 'Biquíni Jericoacoara', user: 'Carla', time: '5 dias atrás', day: 'Esta semana' },
];

const ACTIVITY_COLORS = {
  CREATED: { bg: 'var(--success-bg)', fg: 'var(--success)', label: 'Criado' },
  UPDATED: { bg: 'var(--aqua-soft)', fg: 'var(--aqua)', label: 'Atualizado' },
  DELETED: { bg: 'var(--danger-bg)', fg: 'var(--danger)', label: 'Removido' },
  VIEWED: { bg: 'var(--ember-soft)', fg: 'var(--ember)', label: 'Visualizado' },
  TOGGLED: { bg: 'var(--warn-bg)', fg: 'var(--warn)', label: 'Alterado' },
  SHARED: { bg: 'rgba(167, 243, 208, 0.4)', fg: '#047857', label: 'Compartilhado' },
};

const STATS = {
  total: 84,
  active: 71,
  lowStock: 6,
  outOfStock: 3,
  views7d: 1247,
  views7dDelta: +18,
  clicks7d: 89,
  clicks7dDelta: +24,
  topCategory: 'Biquíni',
};

// sparkline points (0-100 scale)
const SPARK_VIEWS = [42, 48, 38, 55, 62, 58, 71, 68, 79, 82, 75, 88, 92, 87];
const SPARK_CLICKS = [12, 18, 15, 22, 19, 28, 32, 29, 35, 42, 38, 45, 52, 49];
const SPARK_STOCK = [88, 85, 82, 80, 78, 76, 74, 72, 70, 68, 72, 74, 71, 71];

// for heatmap
const HEATMAP = Array.from({length: 28}, (_, i) => ({
  day: i,
  intensity: Math.max(0, Math.min(1, 0.3 + 0.5 * Math.sin(i * 0.7) + 0.2 * Math.cos(i * 0.3)))
}));

Object.assign(window, {
  PRODUCTS, CATEGORIES, ACTIVITY, ACTIVITY_COLORS, STATS,
  SPARK_VIEWS, SPARK_CLICKS, SPARK_STOCK, HEATMAP,
});

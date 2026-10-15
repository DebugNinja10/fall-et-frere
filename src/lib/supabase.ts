import type { Session } from '@supabase/supabase-js';

type AnyRecord = Record<string, any>;

type TableName =
  | 'products'
  | 'services'
  | 'trucks'
  | 'orders'
  | 'order_items'
  | 'quotes'
  | 'reservations'
  | 'projects'
  | 'testimonials'
  | 'newsletter';

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  unit: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  duration: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Truck = {
  id: string;
  name: string;
  description: string | null;
  daily_rate: number;
  capacity: string | null;
  plate_number: string | null;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_address: string | null;
  notes: string | null;
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  created_at: string;
};

export type Quote = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_address: string | null;
  service_type: string | null;
  project_description: string;
  budget: number | null;
  status: string;
  admin_response: string | null;
  estimated_price: number | null;
  created_at: string;
  updated_at: string;
};

export type Reservation = {
  id: string;
  truck_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_address: string | null;
  start_date: string;
  end_date: string;
  notes: string | null;
  status: string;
  total_cost: number;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  client_name: string | null;
  location: string | null;
  image_url: string | null;
  completed_date: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  service_type: string | null;
  is_approved: boolean;
  created_at: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

const STORAGE_PREFIX = 'fall_frere_local_db';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin1234';

const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const now = () => new Date().toISOString();

const defaultData: Record<TableName, any[]> = {
  products: [
    {
      id: 'prod_1',
      name: 'Scie circulaire 180 mm',
      description: 'Scie fiable pour coupes rapides et précises en menuiserie et chantier.',
      price: 42000,
      category: 'quincaillerie',
      stock: 12,
      unit: 'pièce',
      image_url: 'https://images.unsplash.com/photo-1581092921461-4a7ab6f5f4d8?auto=format&fit=crop&w=900&q=80',
      is_active: true,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: 'prod_2',
      name: 'Boulons et vis acier galvanisé',
      description: 'Lot de boulons, vis et rondelles pour assemblages solides.',
      price: 12500,
      category: 'quincaillerie',
      stock: 30,
      unit: 'lot',
      image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
      is_active: true,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: 'prod_3',
      name: 'Panneau MDF 18 mm',
      description: 'Panneau de menuiserie pour agencement, porte et habillage.',
      price: 18000,
      category: 'menuiserie',
      stock: 20,
      unit: 'planche',
      image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
      is_active: true,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: 'prod_4',
      name: 'Ciment 25 kg',
      description: 'Ciment de construction adapté au gros œuvre et à la maçonnerie.',
      price: 9500,
      category: 'maconnerie',
      stock: 40,
      unit: 'sac',
      image_url: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=900&q=80',
      is_active: true,
      created_at: now(),
      updated_at: now(),
    },
  ],
  services: [
    {
      id: 'srv_1',
      name: 'Pose de menuiseries',
      description: 'Installation de portes, fenêtres et fermetures sur mesure.',
      price: 120000,
      category: 'menuiserie',
      duration: '3-5 jours',
      image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
      is_active: true,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: 'srv_2',
      name: 'Gros œuvre & maçonnerie',
      description: 'Travaux d’enduit, fondation, dallage et finition de bâtiment.',
      price: 250000,
      category: 'maconnerie',
      duration: '1-3 semaines',
      image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
      is_active: true,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: 'srv_3',
      name: 'Conseil produit BTP',
      description: 'Aide à la sélection des matériaux et du bon outillage pour votre projet.',
      price: 40000,
      category: 'quincaillerie',
      duration: '1 journée',
      image_url: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=900&q=80',
      is_active: true,
      created_at: now(),
      updated_at: now(),
    },
  ],
  trucks: [
    {
      id: 'trk_1',
      name: 'Camion plateau 3.5T',
      description: 'Parfait pour les petits déplacements et livraisons de chantier.',
      daily_rate: 45000,
      capacity: '3.5 tonnes',
      plate_number: 'AB-123-CD',
      image_url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: 'trk_2',
      name: 'Camion benne 7T',
      description: 'Adapté aux charges lourdes et aux travaux de terrassement.',
      daily_rate: 70000,
      capacity: '7 tonnes',
      plate_number: 'CD-456-EF',
      image_url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: now(),
      updated_at: now(),
    },
  ],
  orders: [
    {
      id: 'ord_1',
      customer_name: 'Moussa Diop',
      customer_email: 'moussa@example.com',
      customer_phone: '+221 77 123 45 67',
      customer_address: 'Dakar, Yoff',
      notes: 'Livraison avant le week-end',
      status: 'pending',
      total: 225000,
      created_at: oneDayAgo,
      updated_at: now(),
    },
  ],
  order_items: [
    {
      id: 'oi_1',
      order_id: 'ord_1',
      product_id: 'prod_1',
      product_name: 'Scie circulaire 180 mm',
      quantity: 2,
      unit_price: 42000,
      created_at: oneDayAgo,
    },
    {
      id: 'oi_2',
      order_id: 'ord_1',
      product_id: 'prod_2',
      product_name: 'Boulons et vis acier galvanisé',
      quantity: 3,
      unit_price: 12500,
      created_at: oneDayAgo,
    },
  ],
  quotes: [
    {
      id: 'quo_1',
      customer_name: 'Saliou Faye',
      customer_email: 'saliou@example.com',
      customer_phone: '+221 76 987 65 43',
      customer_address: 'Saint-Louis',
      service_type: 'Menuiserie',
      project_description: 'Installation de fenêtres en aluminium et pose de portes intérieures.',
      budget: 500000,
      status: 'pending',
      admin_response: null,
      estimated_price: null,
      created_at: oneDayAgo,
      updated_at: now(),
    },
  ],
  reservations: [
    {
      id: 'res_1',
      truck_id: 'trk_1',
      customer_name: 'Awa Ndiaye',
      customer_email: 'awa@example.com',
      customer_phone: '+221 70 111 22 33',
      customer_address: 'Thiès',
      start_date: now(),
      end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Besoin pour un chantier de démolition',
      status: 'pending',
      total_cost: 90000,
      created_at: oneDayAgo,
      updated_at: now(),
    },
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'Rénovation de villa à Dakar',
      description: 'Rénovation complète avec menuiserie sur mesure et finition extérieure.',
      category: 'menuiserie',
      client_name: 'Sow',
      location: 'Dakar',
      image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
      completed_date: now(),
      is_featured: true,
      is_active: true,
      created_at: now(),
      updated_at: now(),
    },
  ],
  testimonials: [
    {
      id: 'tes_1',
      customer_name: 'Amadou Sarr',
      rating: 5,
      comment: 'Très professionnel, livraison rapide et qualité au rendez-vous.',
      service_type: 'Quincaillerie',
      is_approved: true,
      created_at: now(),
    },
  ],
  newsletter: [
    { id: 'news_1', email: 'client@example.com', created_at: now() },
  ],
};

function hasStorage(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage;
}

function ensureSeeded(): void {
  if (!hasStorage()) return;
  (Object.keys(defaultData) as TableName[]).forEach((table) => {
    const key = `${STORAGE_PREFIX}:${table}`;
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData[table]));
    }
  });
}

function readTable<T>(table: TableName): T[] {
  ensureSeeded();
  if (!hasStorage()) return [...defaultData[table]] as T[];
  const raw = localStorage.getItem(`${STORAGE_PREFIX}:${table}`);
  if (!raw) return [...defaultData[table]] as T[];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : ([] as T[]);
  } catch {
    return [...defaultData[table]] as T[];
  }
}

function writeTable<T>(table: TableName, rows: T[]) {
  if (!hasStorage()) return;
  localStorage.setItem(`${STORAGE_PREFIX}:${table}`, JSON.stringify(rows));
}

function getSessionStorageKey(): string {
  return `${STORAGE_PREFIX}:session`;
}

function readSession(): Session | null {
  if (!hasStorage()) return null;
  const raw = localStorage.getItem(getSessionStorageKey());
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function writeSession(session: Session | null) {
  if (!hasStorage()) return;
  if (!session) {
    localStorage.removeItem(getSessionStorageKey());
    return;
  }
  localStorage.setItem(getSessionStorageKey(), JSON.stringify(session));
}

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function matchValue(value: any, compare: any): boolean {
  if (value == null) return false;
  return String(value).toLowerCase() === String(compare).toLowerCase();
}

function matchILike(value: any, pattern: string): boolean {
  const raw = String(value ?? '').toLowerCase();
  const needle = pattern.replace(/^%|%$/g, '').toLowerCase();
  return raw.includes(needle);
}

function applyOrExpression(records: AnyRecord[], expression: string): AnyRecord[] {
  if (!expression) return records;
  const clauses = expression.split(',').map((segment) => segment.trim()).filter(Boolean);
  if (!clauses.length) return records;

  return records.filter((record) =>
    clauses.some((clause) => {
      const match = clause.match(/^([A-Za-z0-9_]+)\.ilike\.(.+)$/);
      if (!match) return false;
      const field = match[1];
      const pattern = match[2].replace(/^%|%$/g, '');
      return matchILike(record[field], pattern);
    })
  );
}

function sortRecords<T>(items: T[], field?: string, ascending = true): T[] {
  if (!field) return items;
  return [...items].sort((a: any, b: any) => {
    const first = a?.[field];
    const second = b?.[field];
    const left = first == null ? '' : String(first);
    const right = second == null ? '' : String(second);
    return ascending ? left.localeCompare(right) : right.localeCompare(left);
  });
}

function projectRecord(record: AnyRecord, selectText?: string): AnyRecord {
  if (!selectText || selectText === '*' || selectText === '*, truck:trucks(*)' || selectText.includes('truck:trucks(*)')) {
    if (selectText && selectText.includes('truck:trucks(*)') && record.truck_id) {
      const trucks = readTable<any>('trucks');
      const truck = trucks.find((item: AnyRecord) => item.id === record.truck_id) ?? null;
      return { ...record, truck };
    }
    return record;
  }

  const fields = selectText
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !part.includes(':'));

  if (!fields.length) return record;
  return fields.reduce((acc, field) => {
    acc[field] = record[field];
    return acc;
  }, {} as AnyRecord);
}

function createTableQuery(table: TableName) {
  const state: AnyRecord = {
    table,
    filters: [] as Array<{ field: string; op: 'eq' | 'ilike'; value: any }>,
    orExpression: '',
    orderField: '',
    orderAscending: true,
    limitValue: undefined as number | undefined,
    selectText: '*',
    selectMeta: {} as AnyRecord,
    updatePayload: null as AnyRecord | null,
    deleteMode: false,
  };

  const execute = async () => {
    let rows = readTable<any>(table) as AnyRecord[];

    for (const filter of state.filters) {
      if (filter.op === 'eq') {
        rows = rows.filter((row) => matchValue(row[filter.field], filter.value));
      }
      if (filter.op === 'ilike') {
        rows = rows.filter((row) => matchILike(row[filter.field], String(filter.value)));
      }
    }

    if (state.orExpression) {
      rows = applyOrExpression(rows, state.orExpression);
    }

    if (state.orderField) {
      rows = sortRecords(rows, state.orderField, state.orderAscending);
    }

    if (state.limitValue !== undefined) {
      rows = rows.slice(0, state.limitValue);
    }

    if (state.updatePayload) {
      rows = rows.map((row) => ({ ...row, ...state.updatePayload, updated_at: now() }));
      const currentRows = readTable<any>(table) as AnyRecord[];
      writeTable(table, currentRows.map((existing: AnyRecord) => {
        const current = rows.find((next: AnyRecord) => next.id === existing.id);
        return current ?? existing;
      }));
      return { data: rows, error: null, count: rows.length };
    }

    if (state.deleteMode) {
      const idsToDelete = new Set(rows.map((row: AnyRecord) => row.id));
      const remaining = readTable<any>(table).filter((row: AnyRecord) => !idsToDelete.has(row.id));
      writeTable(table, remaining);
      return { data: [], error: null, count: 0 };
    }

    const count = rows.length;

    const shouldHeadOnly = state.selectMeta?.count === 'exact' && state.selectMeta?.head === true;
    if (shouldHeadOnly) {
      return { data: [], error: null, count };
    }

    const projected = rows.map((row) => projectRecord(row, state.selectText));
    return { data: projected, error: null, count };
  };

  const query: any = {
    select: (fieldText = '*', meta: AnyRecord = {}) => {
      state.selectText = fieldText;
      state.selectMeta = meta;
      return query;
    },
    eq: (field: string, value: any) => {
      state.filters.push({ field, op: 'eq', value });
      return query;
    },
    ilike: (field: string, value: string) => {
      state.filters.push({ field, op: 'ilike', value });
      return query;
    },
    or: (expression: string) => {
      state.orExpression = expression;
      return query;
    },
    order: (field: string, options: { ascending?: boolean } = {}) => {
      state.orderField = field;
      state.orderAscending = options.ascending ?? true;
      return query;
    },
    limit: (value: number) => {
      state.limitValue = value;
      return query;
    },
    insert: async (payload: AnyRecord | AnyRecord[]) => {
      const rows = readTable<any>(table) as AnyRecord[];
      const incoming = Array.isArray(payload) ? payload : [payload];
      const inserted = incoming.map((row: AnyRecord) => ({
        ...row,
        id: row.id ?? makeId(table.replace(/s$/, '')),
        created_at: row.created_at ?? now(),
        updated_at: row.updated_at ?? now(),
      }));
      writeTable(table, [...rows, ...inserted]);
      return { data: inserted.length === 1 ? inserted[0] : inserted, error: null };
    },
    update: (payload: AnyRecord) => {
      state.updatePayload = payload;
      return query;
    },
    delete: () => {
      state.deleteMode = true;
      return query;
    },
    single: async () => {
      const response = await execute();
      return {
        data: Array.isArray(response.data) ? response.data[0] ?? null : response.data ?? null,
        error: null,
      };
    },
    then: async (resolve: any, reject?: any) => {
      try {
        const response = await execute();
        return resolve(response);
      } catch (error) {
        if (reject) return reject(error);
        throw error;
      }
    },
  };

  return query;
}

function createTableClient(table: TableName) {
  return {
    select: (fieldText = '*', meta: AnyRecord = {}) => createTableQuery(table).select(fieldText, meta),
    insert: async (payload: AnyRecord | AnyRecord[]) => {
      const rows = readTable(table) as AnyRecord[];
      const incoming = Array.isArray(payload) ? payload : [payload];
      const created = incoming.map((row) => ({
        ...row,
        id: row.id ?? makeId(table.replace(/s$/, '')),
        created_at: row.created_at ?? now(),
        updated_at: row.updated_at ?? now(),
      }));
      const next = [...rows, ...created];
      writeTable(table, next);
      return { data: created.length === 1 ? created[0] : created, error: null };
    },
    update: (payload: AnyRecord) => createTableQuery(table).update(payload),
    delete: () => createTableQuery(table).delete(),
    from: () => createTableQuery(table),
  };
}

export const supabase: any = {
  auth: {
    getSession: async () => {
      const session = readSession();
      return { data: { session }, error: null };
    },
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
      const current = readSession();
      callback('INITIAL_SESSION', current);
      return {
        data: {
          subscription: {
            unsubscribe: () => undefined,
          },
        },
      };
    },
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const trimmedEmail = String(email).trim().toLowerCase();
      const trimmedPassword = String(password).trim();
      if (trimmedEmail === ADMIN_EMAIL && trimmedPassword === ADMIN_PASSWORD) {
        const session: Session = {
          access_token: 'local-admin-token',
          token_type: 'bearer',
          expires_in: 3600,
          expires_at: Math.floor((Date.now() + 3600 * 1000) / 1000),
          refresh_token: 'local-admin-refresh',
          user: {
            id: 'admin-id',
            email: ADMIN_EMAIL,
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: now(),
            role: 'authenticated',
            updated_at: now(),
          },
        } as unknown as Session;
        writeSession(session);
        return { data: { user: session.user, session }, error: null };
      }
      return {
        data: { user: null, session: null },
        error: { message: 'Identifiants invalides' },
      };
    },
    signOut: async () => {
      writeSession(null);
      return { error: null };
    },
  },
  from: (table: TableName) => createTableQuery(table),
};

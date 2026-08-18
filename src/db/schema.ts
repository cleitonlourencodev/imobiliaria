import { pgTable, text, timestamp, integer, boolean, decimal, jsonb } from 'drizzle-orm/pg-core';

// Corretores (Real Estate Brokers)
export const brokers = pgTable('brokers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  creci: text('creci').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  whatsapp: text('whatsapp').notNull(), // Direct WhatsApp number formatted e.g. 5511999998888
  photoUrl: text('photo_url').notNull(),
  bio: text('bio'),
  specialties: text('specialties').array(), // e.g. ['Condomínios de Alto Padrão', 'Terrenos', 'Aluguéis']
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Imóveis (Properties)
export const properties = pgTable('properties', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(), // e.g., "IMV-1024"
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  type: text('type').notNull(), // 'venda' | 'aluguel' | 'ambos'
  category: text('category').notNull(), // 'casa' | 'apartamento' | 'terreno' | 'cobertura' | 'comercial' | 'chacara'
  
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  condoFee: decimal('condo_fee', { precision: 10, scale: 2 }).default('0'),
  iptu: decimal('iptu', { precision: 10, scale: 2 }).default('0'),
  
  bedrooms: integer('bedrooms').default(0).notNull(),
  suites: integer('suites').default(0).notNull(),
  bathrooms: integer('bathrooms').default(0).notNull(),
  parkingSpaces: integer('parking_spaces').default(0).notNull(), // vagas
  totalArea: integer('total_area').default(0).notNull(), // m² total
  builtArea: integer('built_area').default(0).notNull(), // m² útil / construída
  
  address: text('address').notNull(),
  neighborhood: text('neighborhood').notNull(), // Bairro
  city: text('city').notNull(),
  state: text('state').notNull().default('SP'),
  zipCode: text('zip_code'),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  
  // Status and Features
  status: text('status').default('disponivel').notNull(), // 'disponivel' | 'reservado' | 'vendido' | 'alugado'
  featured: boolean('featured').default(false).notNull(), // Destaque na home
  
  // WHATSAPP DIRECT TO BROKER TOGGLE (Requirement)
  whatsappDirectEnabled: boolean('whatsapp_direct_enabled').default(true).notNull(),
  brokerId: text('broker_id').references(() => brokers.id, { onDelete: 'set null' }),
  
  // Media & Virtual Tour
  coverImage: text('cover_image').notNull(),
  images: text('images').array().notNull(), // Array of image URLs
  videoUrl: text('video_url'),
  virtualTourUrl: text('virtual_tour_url'),
  
  // Amenities / Characteristics
  amenities: text('amenities').array().notNull(), // e.g. ['Piscina', 'Churrasqueira', 'Portaria 24h', 'Ar Condicionado', 'Mobiliado', 'Energia Solar', 'Pet Friendly']
  
  viewsCount: integer('views_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Leads / Atendimentos CRM
export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  propertyId: text('property_id').references(() => properties.id, { onDelete: 'set null' }),
  brokerId: text('broker_id').references(() => brokers.id, { onDelete: 'set null' }),
  
  clientName: text('client_name').notNull(),
  clientPhone: text('client_phone').notNull(),
  clientEmail: text('client_email'),
  type: text('type').notNull(), // 'whatsapp_direto' | 'agendamento_visita' | 'simulacao_financiamento' | 'contato_geral'
  
  message: text('message'),
  preferredDate: text('preferred_date'), // For visit appointments
  preferredTime: text('preferred_time'),
  
  status: text('status').default('novo').notNull(), // 'novo' | 'em_atendimento' | 'visita_agendada' | 'proposta' | 'fechado' | 'perdido'
  notes: text('notes'),
  
  whatsappDirectTriggered: boolean('whatsapp_direct_triggered').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Avaliação de Imóveis (Owner Valuation Requests)
export const valuationRequests = pgTable('valuation_requests', {
  id: text('id').primaryKey(),
  ownerName: text('owner_name').notNull(),
  ownerPhone: text('owner_phone').notNull(),
  ownerEmail: text('owner_email').notNull(),
  
  propertyType: text('property_type').notNull(), // 'casa' | 'apartamento' | 'terreno' | 'comercial'
  intent: text('intent').notNull(), // 'vender' | 'alugar' | 'apenas_avaliar'
  city: text('city').notNull(),
  neighborhood: text('neighborhood').notNull(),
  estimatedArea: integer('estimated_area').notNull(),
  bedrooms: integer('bedrooms'),
  estimatedValue: decimal('estimated_value', { precision: 12, scale: 2 }),
  notes: text('notes'),
  
  status: text('status').default('pendente').notNull(), // 'pendente' | 'em_analise' | 'contatado' | 'concluido'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Configurações Globais do Site
export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey(), // 'main'
  agencyName: text('agency_name').notNull().default('Prime Imóveis & Negócios'),
  creci: text('creci').notNull().default('CRECI 45.892-J'),
  phone: text('phone').notNull().default('(11) 3890-4000'),
  whatsappDefault: text('whatsapp_default').notNull().default('5511998887777'),
  email: text('email').notNull().default('contato@primeimoveis.com.br'),
  address: text('address').notNull().default('Av. Brigadeiro Faria Lima, 2200 - Ithaim Bibi, São Paulo - SP'),
  
  heroTitle: text('hero_title').notNull().default('Encontre o imóvel dos seus sonhos com atendimento exclusivo'),
  heroSubtitle: text('hero_subtitle').notNull().default('Casas, apartamentos, terrenos e oportunidades de investimento nas melhores localizações.'),
  
  whatsappTemplateMsg: text('whatsapp_template_msg').notNull().default('Olá! Tenho interesse no imóvel *{title}* (Cód: *{code}*), no valor de *{price}*. Poderia me passar mais detalhes?'),
  
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

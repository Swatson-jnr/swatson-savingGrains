// // ============================================
// // SESSION MANAGEMENT
// // File: src/lib/session.ts
// // ============================================

// import { v4 as uuidv4 } from 'uuid';

// export interface PurchaseSessionData {
//   stockDetails?: {
//     grainTypeId: string;
//     sellerId: string;
//   };
//   farmerDetails?: {
//     farmerId?: string;
//   };
//   paymentDetails?: {
//     isThirdPartyPayment: boolean;
//     paymentPhoneNumber: string;
//     quantity: number;
//     measurementUnit: 'KG' | 'BAG';
//     pricePerUnit: number;
//     charges: number;
//   };
//   confirmationDetails?: {
//     moveToStorehouse: boolean;
//     purchaseDate?: Date;
//   };
// }

// // In production, use Redis or MongoDB sessions
// const sessionStore = new Map<string, PurchaseSessionData>();

// export const createSession = (): string => {
//   const sessionId = uuidv4();
//   sessionStore.set(sessionId, {});
//   return sessionId;
// };

// export const getSession = (sessionId: string): PurchaseSessionData | null => {
//   return sessionStore.get(sessionId) || null;
// };

// export const updateSession = (
//   sessionId: string,
//   data: Partial<PurchaseSessionData>
// ): void => {
//   const existing = sessionStore.get(sessionId) || {};
//   sessionStore.set(sessionId, { ...existing, ...data });
// };

// export const clearSession = (sessionId: string): void => {
//   sessionStore.delete(sessionId);
// };
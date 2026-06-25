import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  getDoc,
  onSnapshot
} from "firebase/firestore";
import { 
  Service, 
  TeamMember, 
  Project, 
  PricingTier, 
  Testimonial, 
  Inquiry, 
  SiteSettings,
  defaultServices,
  defaultTeam,
  defaultPortfolio,
  defaultPricing,
  defaultTestimonials,
  defaultSettings
} from "./seedData";

export const dbService = {
  // Services
  getServices: async (): Promise<Service[]> => {
    if (!isFirebaseConfigured) return [];
    try {
      const q = query(collection(db, "services"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: Service[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Service);
      });
      return list;
    } catch (e) {
      console.warn("Firestore error getting services:", e);
      return [];
    }
  },

  saveService: async (id: string, data: Omit<Service, "id">): Promise<void> => {
    if (!isFirebaseConfigured) return;
    await setDoc(doc(db, "services", id), data);
  },

  // Team
  getTeam: async (): Promise<TeamMember[]> => {
    if (!isFirebaseConfigured) return [];
    try {
      const q = query(collection(db, "team"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: TeamMember[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as TeamMember);
      });
      return list;
    } catch (e) {
      console.warn(e);
      return [];
    }
  },

  saveTeamMember: async (id: string | null, data: Omit<TeamMember, "id">): Promise<string> => {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
    if (id) {
      await setDoc(doc(db, "team", id), data);
      return id;
    } else {
      const docRef = await addDoc(collection(db, "team"), data);
      return docRef.id;
    }
  },

  deleteTeamMember: async (id: string): Promise<void> => {
    if (!isFirebaseConfigured) return;
    await deleteDoc(doc(db, "team", id));
  },

  // Portfolio
  getPortfolio: async (): Promise<Project[]> => {
    if (!isFirebaseConfigured) return [];
    try {
      const q = query(collection(db, "portfolio"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: Project[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Project);
      });
      return list;
    } catch (e) {
      console.warn(e);
      return [];
    }
  },

  saveProject: async (id: string | null, data: Omit<Project, "id">): Promise<string> => {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
    if (id) {
      await setDoc(doc(db, "portfolio", id), data);
      return id;
    } else {
      const docRef = await addDoc(collection(db, "portfolio"), data);
      return docRef.id;
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    if (!isFirebaseConfigured) return;
    await deleteDoc(doc(db, "portfolio", id));
  },

  // Pricing
  getPricing: async (): Promise<PricingTier[]> => {
    if (!isFirebaseConfigured) return [];
    try {
      const q = query(collection(db, "pricing"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: PricingTier[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as PricingTier);
      });
      return list;
    } catch (e) {
      console.warn(e);
      return [];
    }
  },

  savePricingTier: async (id: string | null, data: Omit<PricingTier, "id">): Promise<string> => {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
    if (id) {
      await setDoc(doc(db, "pricing", id), data);
      return id;
    } else {
      const docRef = await addDoc(collection(db, "pricing"), data);
      return docRef.id;
    }
  },

  deletePricingTier: async (id: string): Promise<void> => {
    if (!isFirebaseConfigured) return;
    await deleteDoc(doc(db, "pricing", id));
  },

  // Testimonials
  getTestimonials: async (): Promise<Testimonial[]> => {
    if (!isFirebaseConfigured) return [];
    try {
      const q = query(collection(db, "testimonials"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: Testimonial[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Testimonial);
      });
      return list;
    } catch (e) {
      console.warn(e);
      return [];
    }
  },

  saveTestimonial: async (id: string | null, data: Omit<Testimonial, "id">): Promise<string> => {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
    if (id) {
      await setDoc(doc(db, "testimonials", id), data);
      return id;
    } else {
      const docRef = await addDoc(collection(db, "testimonials"), data);
      return docRef.id;
    }
  },

  deleteTestimonial: async (id: string): Promise<void> => {
    if (!isFirebaseConfigured) return;
    await deleteDoc(doc(db, "testimonials", id));
  },

  // Inquiries
  getInquiries: async (): Promise<Inquiry[]> => {
    if (!isFirebaseConfigured) return [];
    try {
      const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list: Inquiry[] = [];
      snap.forEach((d) => {
        const dData = d.data();
        list.push({
          id: d.id,
          ...dData,
          createdAt: dData.createdAt?.toDate ? dData.createdAt.toDate().toISOString() : dData.createdAt
        } as Inquiry);
      });
      return list;
    } catch (e) {
      console.warn(e);
      return [];
    }
  },

  addInquiry: async (data: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<Inquiry> => {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
    const record = {
      ...data,
      status: "NEW",
      createdAt: new Date()
    };
    const docRef = await addDoc(collection(db, "inquiries"), record);
    return {
      id: docRef.id,
      ...data,
      status: "NEW",
      createdAt: record.createdAt.toISOString()
    };
  },

  updateInquiryStatus: async (id: string, status: Inquiry["status"]): Promise<void> => {
    if (!isFirebaseConfigured) return;
    await updateDoc(doc(db, "inquiries", id), { status });
  },

  deleteInquiry: async (id: string): Promise<void> => {
    if (!isFirebaseConfigured) return;
    await deleteDoc(doc(db, "inquiries", id));
  },

  // Site Settings
  getSettings: async (): Promise<SiteSettings> => {
    if (!isFirebaseConfigured) return defaultSettings;
    try {
      const docRef = doc(db, "settings", "site-config");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as SiteSettings;
      } else {
        // Do not auto-write defaults into Firestore - return in-memory defaults
        return defaultSettings;
      }
    } catch (e) {
      console.warn("Failed to get settings from firestore, using default", e);
      return defaultSettings;
    }
  },

  saveSettings: async (data: SiteSettings): Promise<void> => {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
    await setDoc(doc(db, "settings", "site-config"), data);
  }
};

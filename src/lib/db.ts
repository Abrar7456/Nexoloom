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
import { fallbackDB, Service, TeamMember, Project, PricingTier, Testimonial, Inquiry, SiteSettings } from "./mockData";

export const dbService = {
  // Services
  getServices: async (): Promise<Service[]> => {
    if (!isFirebaseConfigured) {
      return fallbackDB.getServices();
    }
    try {
      const q = query(collection(db, "services"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: Service[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Service);
      });
      if (list.length === 0) {
        // Seed database if empty
        const defaults = fallbackDB.getServices();
        for (const item of defaults) {
          const { id, ...rest } = item;
          await setDoc(doc(db, "services", id), rest);
        }
        return defaults;
      }
      return list;
    } catch (e) {
      console.warn("Firestore error, falling back to LocalStorage:", e);
      return fallbackDB.getServices();
    }
  },

  saveService: async (id: string, data: Omit<Service, "id">): Promise<void> => {
    if (!isFirebaseConfigured) {
      const list = fallbackDB.getServices();
      const idx = list.findIndex((item) => item.id === id);
      if (idx > -1) {
        list[idx] = { id, ...data };
      } else {
        list.push({ id, ...data });
      }
      fallbackDB.saveServices(list);
      return;
    }
    await setDoc(doc(db, "services", id), data);
  },

  // Team
  getTeam: async (): Promise<TeamMember[]> => {
    if (!isFirebaseConfigured) {
      return fallbackDB.getTeam();
    }
    try {
      const q = query(collection(db, "team"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: TeamMember[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as TeamMember);
      });
      if (list.length === 0) {
        const defaults = fallbackDB.getTeam();
        for (const item of defaults) {
          const { id, ...rest } = item;
          await setDoc(doc(db, "team", id), rest);
        }
        return defaults;
      }
      return list;
    } catch (e) {
      console.warn(e);
      return fallbackDB.getTeam();
    }
  },

  saveTeamMember: async (id: string | null, data: Omit<TeamMember, "id">): Promise<string> => {
    if (!isFirebaseConfigured) {
      const list = fallbackDB.getTeam();
      const targetId = id || "team_" + Math.random().toString(36).substr(2, 9);
      const idx = list.findIndex((item) => item.id === targetId);
      const newMember = { id: targetId, ...data };
      if (idx > -1) {
        list[idx] = newMember;
      } else {
        list.push(newMember);
      }
      fallbackDB.saveTeam(list);
      return targetId;
    }

    if (id) {
      await setDoc(doc(db, "team", id), data);
      return id;
    } else {
      const docRef = await addDoc(collection(db, "team"), data);
      return docRef.id;
    }
  },

  deleteTeamMember: async (id: string): Promise<void> => {
    if (!isFirebaseConfigured) {
      const list = fallbackDB.getTeam();
      fallbackDB.saveTeam(list.filter((item) => item.id !== id));
      return;
    }
    await deleteDoc(doc(db, "team", id));
  },

  // Portfolio
  getPortfolio: async (): Promise<Project[]> => {
    if (!isFirebaseConfigured) {
      return fallbackDB.getPortfolio();
    }
    try {
      const q = query(collection(db, "portfolio"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: Project[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Project);
      });
      if (list.length === 0) {
        const defaults = fallbackDB.getPortfolio();
        for (const item of defaults) {
          const { id, ...rest } = item;
          await setDoc(doc(db, "portfolio", id), rest);
        }
        return defaults;
      }
      return list;
    } catch (e) {
      console.warn(e);
      return fallbackDB.getPortfolio();
    }
  },

  saveProject: async (id: string | null, data: Omit<Project, "id">): Promise<string> => {
    if (!isFirebaseConfigured) {
      const list = fallbackDB.getPortfolio();
      const targetId = id || "proj_" + Math.random().toString(36).substr(2, 9);
      const idx = list.findIndex((item) => item.id === targetId);
      const newProject = { id: targetId, ...data };
      if (idx > -1) {
        list[idx] = newProject;
      } else {
        list.push(newProject);
      }
      fallbackDB.savePortfolio(list);
      return targetId;
    }

    if (id) {
      await setDoc(doc(db, "portfolio", id), data);
      return id;
    } else {
      const docRef = await addDoc(collection(db, "portfolio"), data);
      return docRef.id;
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    if (!isFirebaseConfigured) {
      const list = fallbackDB.getPortfolio();
      fallbackDB.savePortfolio(list.filter((item) => item.id !== id));
      return;
    }
    await deleteDoc(doc(db, "portfolio", id));
  },

  // Pricing
  getPricing: async (): Promise<PricingTier[]> => {
    if (!isFirebaseConfigured) {
      return fallbackDB.getPricing();
    }
    try {
      const q = query(collection(db, "pricing"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: PricingTier[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as PricingTier);
      });
      if (list.length === 0) {
        const defaults = fallbackDB.getPricing();
        for (const item of defaults) {
          const { id, ...rest } = item;
          await setDoc(doc(db, "pricing", id), rest);
        }
        return defaults;
      }
      return list;
    } catch (e) {
      console.warn(e);
      return fallbackDB.getPricing();
    }
  },

  savePricingTier: async (id: string | null, data: Omit<PricingTier, "id">): Promise<string> => {
    if (!isFirebaseConfigured) {
      const list = fallbackDB.getPricing();
      const targetId = id || "price_" + Math.random().toString(36).substr(2, 9);
      const idx = list.findIndex((item) => item.id === targetId);
      const newTier = { id: targetId, ...data };
      if (idx > -1) {
        list[idx] = newTier;
      } else {
        list.push(newTier);
      }
      fallbackDB.savePricing(list);
      return targetId;
    }

    if (id) {
      await setDoc(doc(db, "pricing", id), data);
      return id;
    } else {
      const docRef = await addDoc(collection(db, "pricing"), data);
      return docRef.id;
    }
  },

  deletePricingTier: async (id: string): Promise<void> => {
    if (!isFirebaseConfigured) {
      const list = fallbackDB.getPricing();
      fallbackDB.savePricing(list.filter((item) => item.id !== id));
      return;
    }
    await deleteDoc(doc(db, "pricing", id));
  },

  // Testimonials
  getTestimonials: async (): Promise<Testimonial[]> => {
    if (!isFirebaseConfigured) {
      return fallbackDB.getTestimonials();
    }
    try {
      const q = query(collection(db, "testimonials"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: Testimonial[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Testimonial);
      });
      if (list.length === 0) {
        const defaults = fallbackDB.getTestimonials();
        for (const item of defaults) {
          const { id, ...rest } = item;
          await setDoc(doc(db, "testimonials", id), rest);
        }
        return defaults;
      }
      return list;
    } catch (e) {
      console.warn(e);
      return fallbackDB.getTestimonials();
    }
  },

  saveTestimonial: async (id: string | null, data: Omit<Testimonial, "id">): Promise<string> => {
    if (!isFirebaseConfigured) {
      const list = fallbackDB.getTestimonials();
      const targetId = id || "test_" + Math.random().toString(36).substr(2, 9);
      const idx = list.findIndex((item) => item.id === targetId);
      const newTest = { id: targetId, ...data };
      if (idx > -1) {
        list[idx] = newTest;
      } else {
        list.push(newTest);
      }
      fallbackDB.saveTestimonials(list);
      return targetId;
    }

    if (id) {
      await setDoc(doc(db, "testimonials", id), data);
      return id;
    } else {
      const docRef = await addDoc(collection(db, "testimonials"), data);
      return docRef.id;
    }
  },

  deleteTestimonial: async (id: string): Promise<void> => {
    if (!isFirebaseConfigured) {
      const list = fallbackDB.getTestimonials();
      fallbackDB.saveTestimonials(list.filter((item) => item.id !== id));
      return;
    }
    await deleteDoc(doc(db, "testimonials", id));
  },

  // Inquiries
  getInquiries: async (): Promise<Inquiry[]> => {
    if (!isFirebaseConfigured) {
      return fallbackDB.getInquiries();
    }
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
      return fallbackDB.getInquiries();
    }
  },

  addInquiry: async (data: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<Inquiry> => {
    if (!isFirebaseConfigured) {
      return fallbackDB.addInquiry(data);
    }
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
    if (!isFirebaseConfigured) {
      const list = fallbackDB.getInquiries();
      const idx = list.findIndex((item) => item.id === id);
      if (idx > -1) {
        list[idx].status = status;
        fallbackDB.saveInquiries(list);
      }
      return;
    }
    await updateDoc(doc(db, "inquiries", id), { status });
  },

  deleteInquiry: async (id: string): Promise<void> => {
    if (!isFirebaseConfigured) {
      const list = fallbackDB.getInquiries();
      fallbackDB.saveInquiries(list.filter((item) => item.id !== id));
      return;
    }
    await deleteDoc(doc(db, "inquiries", id));
  },

  // Site Settings
  getSettings: async (): Promise<SiteSettings> => {
    if (!isFirebaseConfigured) {
      return fallbackDB.getSettings();
    }
    try {
      const docRef = doc(db, "settings", "site-config");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as SiteSettings;
      } else {
        const defaults = fallbackDB.getSettings();
        await setDoc(docRef, defaults);
        return defaults;
      }
    } catch (e) {
      console.warn(e);
      return fallbackDB.getSettings();
    }
  },

  saveSettings: async (data: SiteSettings): Promise<void> => {
    if (!isFirebaseConfigured) {
      fallbackDB.saveSettings(data);
      return;
    }
    await setDoc(doc(db, "settings", "site-config"), data);
  }
};

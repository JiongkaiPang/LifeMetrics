import { 
    doc, 
    setDoc, 
    getDoc, 
    collection, 
    query, 
    where, 
    getDocs,
    Timestamp,
    orderBy,
    addDoc,
    deleteDoc,
  } from 'firebase/firestore';
  import { db } from '../config/firebase';
  
  export interface HealthMetric {
    id?: string;
    value: string;
    timestamp: Timestamp;
    type: string;
  }
  
  export interface RangeNames {
    normal: string;
    elevated: string;
    high: string;
  }
  
  export interface StatusThresholds {
    normal: number;
    elevated: number;
    high: number;
    ranges: RangeNames;
  }
  
  export interface StatusType {
    id: string;
    name: string;
    thresholds: StatusThresholds;
  }
  
  export interface UserData {
    email: string;
    name: string;
    avatar?: string;
  }
  
  export const firestoreService = {
    user: {
        async createUserProfile(userId: string, userData: UserData) {
            try {
                const userRef = doc(db, 'users', userId);
                await setDoc(userRef, {
                    ...userData,
                    updatedAt: Timestamp.now()
                }, { merge: true });
                return true;
            } catch (error) {
                console.error('Error creating user profile:', error);
                throw error;
            }
        },
  
        async getUserProfile(userId: string) {
            try {
                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef);
                return userDoc.exists() ? userDoc.data() as UserData : null;
            } catch (error) {
                console.error('Error getting user profile:', error);
                throw error;
            }
        },
  
        async updateProfile(userId: string, updates: Partial<UserData>) {
            try {
                const userRef = doc(db, 'users', userId);
                await setDoc(userRef, {
                    ...updates,
                    updatedAt: Timestamp.now()
                }, { merge: true });
                return true;
            } catch (error) {
                console.error('Error updating user profile:', error);
                throw error;
            }
        }
    },

  healthMetrics: {
    async addMetric(userId: string, data: Omit<HealthMetric, 'id'>) {
        try {
            const metricsRef = collection(db, `users/${userId}/healthMetrics`);
            await addDoc(metricsRef, {
                type: data.type,
                value: data.value,
                timestamp: data.timestamp
            });
        } catch (error) {
            console.error('Error adding metric:', error);
            throw error;
        }
    },
    
    async deleteMetric(userId: string, metricId: string) {
        try {
            const metricRef = doc(db, `users/${userId}/healthMetrics/${metricId}`);
            await deleteDoc(metricRef);
        } catch (error) {
            console.error('Error deleting metric:', error);
            throw error;
        }
    },

    async getMetrics(
        userId: string, 
        type: string, 
        startDate: Date, 
        endDate: Date
    ): Promise<HealthMetric[]> {
        try {
            // Set the time to start and end of day in local timezone
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            const metricsRef = collection(db, `users/${userId}/healthMetrics`);
            const q = query(
                metricsRef,
                where('type', '==', type),
                where('timestamp', '>=', Timestamp.fromDate(start)),
                where('timestamp', '<=', Timestamp.fromDate(end)),
                orderBy('timestamp', 'desc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp
            })) as HealthMetric[];
        } catch (error) {
            console.error('Error getting metrics:', error);
            throw error;
        }
    },

    async getLastMonthMetrics(userId: string, type: string): Promise<HealthMetric[]> {
        const lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 30);
        return this.getMetrics(userId, type, lastMonth, new Date());
    },

    async getLastYearMetrics(userId: string, type: string): Promise<HealthMetric[]> {
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        return this.getMetrics(userId, type, lastYear, new Date());
    }
},

  statusTypes: {
      async addStatusType(userId: string, name: string, thresholds: StatusThresholds) {
          try {
              const statusRef = collection(db, `users/${userId}/statusTypes`);
              const id = name.toLowerCase().replace(/\s+/g, '-');
              await setDoc(doc(statusRef, id), {
                  name,
                  id,
                  thresholds
              });
              return { id, name, thresholds };
          } catch (error) {
              console.error('Error adding status type:', error);
              throw error;
          }
      },

      async getStatusTypes(userId: string): Promise<StatusType[]> {
          try {
              const statusRef = collection(db, `users/${userId}/statusTypes`);
              const snapshot = await getDocs(statusRef);
              return snapshot.docs.map(doc => doc.data() as StatusType);
          } catch (error) {
              console.error('Error getting status types:', error);
              throw error;
          }
      },

      async deleteStatusType(userId: string, statusId: string) {
          try {
              const statusRef = doc(db, `users/${userId}/statusTypes/${statusId}`);
              await deleteDoc(statusRef);
          } catch (error) {
              console.error('Error deleting status type:', error);
              throw error;
          }
      }
  }
};
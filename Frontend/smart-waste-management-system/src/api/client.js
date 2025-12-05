import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082'
  //'https://smart-waste-app-production.up.railway.app'

// 'http://localhost:8082'
// 
//    || 
const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // expect backend to set HTTP-only cookies for auth when applicable
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include JWT token in Authorization header
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => client.post('/api/auth/login', data),
  register: (data) => client.post('/api/auth/register', data),
}

export const adminAPI = {
  getDashboardStats: () => client.get('/api/admin/dashboard/stats'),
  getUsers: () => client.get('/api/admin/users'),
  createUser: (data) => client.post('/api/admin/users', data),
  updateUser: (id, data) => client.put(`/api/admin/users/${id}`, data),
  deleteUser: (id) => client.delete(`/api/admin/users/${id}`),
  getRoutes: () => client.get('/api/admin/routes'),
  createRoute: (data) => client.post('/api/admin/routes', data),
  deleteRoute: (id) => client.delete(`/api/admin/routes/${id}`),
  getVehicles: () => client.get('/api/admin/vehicles'),
  createVehicle: (data) => client.post('/api/admin/vehicles', data),
  deleteVehicle: (id) => client.delete(`/api/admin/vehicles/${id}`),
  getReports: () => client.get('/api/admin/reports'),
}

export const dashboardAPI = {
  getDashboardStats: () => client.get('/api/dashboard/stats'),
}

export const employeeAPI = {
  getTodayRoutes: () => client.get('/api/employee/routes/today'),
  getRouteWaypoints: (routeId) => client.get(`/api/dashboard/routes/${routeId}/waypoints`),
  completeRoute: (data) => client.post('/api/employee/route/complete', data),
  markRouteComplete: (routeId, remark, photoUrl) => client.post('/api/employee/route/complete', { routeId, remark, photoUrl }),
  getTodayAttendance: () => client.get('/api/employee/attendance/today'),
  markAttendance: (status, remarks) => client.post('/api/employee/attendance/mark', null, { params: { status, remarks } }),
  getTodayCollections: () => client.get('/api/employee/collections/today'),
}

export const complaintAPI = {
  createComplaint: (data) => client.post('/api/citizen/complaint', data),
  getMyComplaints: () => client.get('/api/citizen/complaints'),
  getAllComplaints: (status) => client.get('/api/supervisor/complaints', { params: { status } }),
  updateComplaintStatus: (complaintId, status) => client.put(`/api/supervisor/complaints/${complaintId}/status`, { status }),
  assignEmployee: (complaintId, employeeId) => client.put(`/api/supervisor/complaints/${complaintId}/assign`, { employeeId }),
}

export const citizenAPI = {
  getSchedule: (date) => client.get('/api/citizen/schedule', { params: { date } }),
}

export { client as apiClient };
export default client;

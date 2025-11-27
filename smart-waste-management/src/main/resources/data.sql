-- Insert dummy data for testing

-- Insert dummy data for testing (tables will be created by Hibernate first)

-- Insert Users
INSERT IGNORE INTO users (name, email, phone, password, role) VALUES
('Admin User', 'admin@example.com', '1234567890', '$2a$10$examplehashedpassword', 'ADMIN'),
('Employee One', 'employee1@example.com', '1234567891', '$2a$10$examplehashedpassword', 'EMPLOYEE'),
('Citizen One', 'citizen1@example.com', '1234567892', '$2a$10$examplehashedpassword', 'CITIZEN'),
('Citizen Two', 'citizen2@example.com', '1234567893', '$2a$10$examplehashedpassword', 'CITIZEN');

-- Insert SmartBins
INSERT IGNORE INTO smart_bins (bin_id, latitude, longitude, current_fill_level, waste_type, last_updated, status) VALUES
('BIN001', 12.9716, 77.5946, 45.5, 'GENERAL', '2023-10-01 10:00:00', 'OPERATIONAL'),
('BIN002', 12.9720, 77.5950, 78.2, 'RECYCLABLE', '2023-10-01 09:30:00', 'OPERATIONAL'),
('BIN003', 12.9700, 77.5930, 90.0, 'GENERAL', '2023-09-30 15:00:00', 'NEEDS_MAINTENANCE');

-- Insert Vehicles
INSERT IGNORE INTO vehicles (registration_no, type, capacity_kg) VALUES
('KA01AB1234', 'TRUCK', 1000.0),
('KA01CD5678', 'VAN', 1200.0);

-- Insert Routes
INSERT IGNORE INTO routes (name, vehicle_id, employee_id, schedule_date, status) VALUES
('Morning Route 1', 1, 2, '2023-10-01 08:00:00', 'IN_PROGRESS'),
('Afternoon Route 2', 2, 2, '2023-09-30 08:00:00', 'COMPLETED');

-- Insert Waypoints
INSERT IGNORE INTO waypoints (route_id, sequence, latitude, longitude, bin_id) VALUES
(1, 1, 12.9716, 77.5946, 'BIN001'),
(1, 2, 12.9720, 77.5950, 'BIN002'),
(2, 1, 12.9700, 77.5930, 'BIN003');

-- Insert Collection Records
INSERT IGNORE INTO collection_records (route_id, waypoint_id, status, collected_at, latitude, longitude, collection_date) VALUES
(1, 1, 'COLLECTED', '2023-10-01 10:00:00', 12.9716, 77.5946, '2023-10-01'),
(2, 3, 'COLLECTED', '2023-09-30 09:00:00', 12.9700, 77.5930, '2023-09-30');

-- Insert Complaints
INSERT IGNORE INTO complaints (citizen_id, description, latitude, longitude, status, created_at) VALUES
(3, 'Bin is overflowing', 12.9716, 77.5946, 'PENDING', '2023-10-01 12:00:00'),
(4, 'Bin not collected for 3 days', 12.9720, 77.5950, 'IN_PROGRESS', '2023-09-29 14:00:00');

-- Insert Employee Performance
INSERT IGNORE INTO employee_performance (employee_id, total_points, monthly_points, routes_completed, last_updated, current_badge, performance_level) VALUES
(2, 1500, 150, 15, '2023-10-01 10:00:00', 'GOLD', 'GOLD');

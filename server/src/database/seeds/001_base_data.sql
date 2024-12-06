-- Insert base roles
INSERT INTO roles (name, category, max_capacity, requires_training) VALUES
('Worship Leader', 'worship', 1, true),
('Vocals', 'worship', 4, false),
('Guitar', 'worship', 2, true),
('Keys', 'worship', 1, true),
('Drums', 'worship', 1, true),
('Bass', 'worship', 1, true),
('Sound', 'production', 1, true),
('Video', 'production', 1, true),
('Lights', 'production', 1, true),
('Presentation', 'production', 1, false),
('Host', 'service', 1, true),
('Ushers', 'service', 4, false),
('Welcome Team', 'service', 3, false),
('Prayer Team', 'service', 2, true);

-- Insert some test data for services
INSERT INTO services (date, service_type, start_time, end_time) VALUES
('2024-12-15', 'english', '09:00', '10:30'),
('2024-12-15', 'italian', '11:00', '12:30'),
('2024-12-22', 'english', '09:00', '10:30'),
('2024-12-22', 'italian', '11:00', '12:30');

-- Insert serving preferences
INSERT INTO serving_preferences (user_id, preference_type, preference_value) VALUES
(1, 'family_serve_together', '{"enabled": true}'),
(1, 'max_frequency', '{"times_per_month": 2}'),
(2, 'max_frequency', '{"times_per_month": 3}'),
(3, 'family_serve_together', '{"enabled": false}');

-- Insert availability data
INSERT INTO availability (user_id, date, is_available, reason) VALUES
(1, '2024-12-15', true, NULL),
(1, '2024-12-22', false, 'Holiday'),
(2, '2024-12-15', true, NULL),
(2, '2024-12-22', true, NULL),
(3, '2024-12-15', true, NULL),
(3, '2024-12-22', true, NULL);

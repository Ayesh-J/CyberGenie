CREATE DATABASE cybergenie_auth;

USE cybergenie_auth;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing learning modules (LearnZone content)
CREATE TABLE learning_modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
  duration VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for tracking user progress on learning modules
CREATE TABLE user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  module_id INT NOT NULL,
  progress_percent INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES learning_modules(id) ON DELETE CASCADE,
  UNIQUE KEY user_module_unique (user_id, module_id)
);

 

INSERT INTO learning_resources (module_id, title, description, resource_type, url, duration) VALUES
(1, 'Introduction to Cybersecurity', 'Overview of basic cybersecurity concepts and principles.', 'article', 'https://example.com/cybersecurity-intro', '10 min'),
(1, 'Understanding Malware', 'Detailed explanation of different types of malware and how they work.', 'video', 'https://example.com/malware-guide', '15 min'),
(2, 'Phishing Attacks', 'Learn how phishing attacks operate and ways to recognize them.', 'article', 'https://example.com/phishing-attacks', '8 min'),
(2, 'Password Management', 'Best practices for creating and managing strong passwords.', 'video', 'https://example.com/password-management', '12 min'),
(3, 'Network Security Basics', 'Introduction to securing computer networks and devices.', 'article', 'https://example.com/network-security', '9 min'),
(3, 'Firewalls and VPNs', 'Understanding the role of firewalls and VPNs in protecting networks.', 'video', 'https://example.com/firewalls-vpns', '14 min');

-- Table to store each conversation node
CREATE TABLE chatbot_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    node_id VARCHAR(255) UNIQUE NOT NULL,
    question TEXT,
    answer TEXT,
    follow_up TEXT,
    options JSON
);

 

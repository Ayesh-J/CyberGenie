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

-- table for learning resources
CREATE TABLE learning_resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  type ENUM('video', 'article', 'website', 'pdf', 'quiz') DEFAULT 'article',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES learning_modules(id) ON DELETE CASCADE
);


 

INSERT INTO learning_resources (module_id, title, description, resource_type, url, duration) VALUES
-- Module 1
(1, 'Understanding Password Security', 'Learn why strong passwords are essential for cybersecurity.', 'article', 'https://www.cybersecurity101.com/passwords', '8 min'),
(1, 'Password Best Practices', 'Video explaining how to create and manage strong passwords.', 'video', 'https://www.youtube.com/watch?v=abc123', '12 min'),

-- Module 2
(2, 'Phishing Attacks Explained', 'Detailed article on how phishing scams work and how to avoid them.', 'article', 'https://www.cybersecurity101.com/phishing', '10 min'),
(2, 'Recognizing Phishing Emails', 'Video tutorial on identifying phishing attempts.', 'video', 'https://www.youtube.com/watch?v=def456', '15 min'),

-- Module 3
(3, 'Safe Browsing Tips', 'Article about safe web browsing habits to protect your data.', 'article', 'https://www.cybersecurity101.com/safebrowsing', '7 min'),
(3, 'Browser Security Settings', 'Video on configuring your browser for maximum security.', 'video', 'https://www.youtube.com/watch?v=ghi789', '9 min'),

-- Module 4
(4, 'Introduction to Two-Factor Authentication (2FA)', 'Why and how to enable 2FA on your accounts.', 'article', 'https://www.cybersecurity101.com/2fa', '6 min'),
(4, 'Setting Up 2FA on Your Phone', 'Step-by-step video guide to enable 2FA.', 'video', 'https://www.youtube.com/watch?v=jkl012', '11 min'),

-- Module 5
(5, 'Protecting Your Social Media Privacy', 'Learn to configure privacy settings on popular social platforms.', 'article', 'https://www.cybersecurity101.com/socialmedia-privacy', '9 min'),
(5, 'Social Media Safety Tips', 'Video on how to stay safe and avoid scams on social media.', 'video', 'https://www.youtube.com/watch?v=mno345', '13 min'),

-- Module 6
(6, 'Basics of Network Security', 'Understanding how to secure your home and office networks.', 'article', 'https://www.cybersecurity101.com/network-security', '10 min'),
(6, 'Router Security Settings', 'Video tutorial on securing your wireless router.', 'video', 'https://www.youtube.com/watch?v=pqr678', '14 min'),

-- Module 7
(7, 'Recognizing Malware and Ransomware', 'How to detect and avoid malware attacks.', 'article', 'https://www.cybersecurity101.com/malware', '8 min'),
(7, 'Malware Protection Tools', 'Video on choosing and using antivirus software.', 'video', 'https://www.youtube.com/watch?v=stu901', '12 min');



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
 
  INSERT INTO chatbot_nodes (id, question, answer, follow_up, options)
VALUES (
  'phishing_awareness',
  'What is phishing and how can I spot it?',
  'Phishing is a fraudulent attempt to obtain sensitive information. Always check the sender’s email, look for spelling errors, and avoid clicking suspicious links.',
  'Would you like to learn about types of phishing or how to report it?',
  '["phishing_types", "report_phishing"]'
);

INSERT INTO chatbot_nodes (id, question, answer, follow_up, options)
VALUES (
  'malware_protection',
  'How can I protect my device from malware?',
  'Use trusted antivirus software, avoid downloading from unknown sources, and keep your OS and apps updated.',
  'Do you want to know about antivirus tools or safe browsing practices?',
  '["antivirus_tools", "safe_browsing"]'
);

INSERT INTO chatbot_nodes (id, question, answer, follow_up, options)
VALUES (
  'social_engineering',
  'What is social engineering?',
  'It’s the psychological manipulation of people into performing actions or revealing confidential information. Be skeptical of unexpected requests for sensitive data.',
  'Want examples or protection tips?',
  '["social_examples", "social_protection"]'
);

INSERT INTO chatbot_nodes (id, question, answer, follow_up, options)
VALUES (
  'report_incident',
  'How do I report a cybersecurity incident?',
  'You should report it to your local cybercrime authority or internal IT/security team immediately. Save all evidence like screenshots or emails.',
  '',
  '[]'
);




 CREATE TABLE resource_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  resource_id INT NOT NULL,
  is_viewed BOOLEAN DEFAULT FALSE,
  viewed_at DATETIME,
  UNIQUE KEY user_resource_unique (user_id, resource_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE CASCADE
);

CREATE TABLE quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  total_questions INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES learning_modules(id) ON DELETE CASCADE
);

CREATE TABLE quiz_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  question_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE quiz_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  option_text VARCHAR(255) NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

CREATE TABLE quiz_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  quiz_id INT NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  passed BOOLEAN,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

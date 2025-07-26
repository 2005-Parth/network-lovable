/*
  # Insert Sample Data

  1. Sample Data
    - Carousel slides
    - Testimonials
    - Events
    - Committee members
    - Gallery items
    - Sponsors
    - Blog posts
*/

-- Insert sample carousel slides
INSERT INTO carousel_slides (title, subtitle, description, image_url, order_index) VALUES
('Welcome to The Network', 'Connect, collaborate, and create the future together', 'Join our community of innovators, developers, and visionaries shaping tomorrow''s technology landscape.', 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1920&h=1080&fit=crop', 1),
('Innovation Through Collaboration', 'Where brilliant minds converge', 'Experience the power of collective intelligence and breakthrough thinking in our dynamic ecosystem.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop', 2),
('Shape the Digital Future', 'Technology meets creativity', 'Be part of the revolution that''s transforming how we work, learn, and connect in the digital age.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop', 3);

-- Insert sample testimonials
INSERT INTO testimonials (name, role, company, quote, image_url, is_featured) VALUES
('Sarah Chen', 'Software Engineer', 'Google', 'The Network transformed my career. The workshops and community support helped me land my dream job at Google.', 'https://images.unsplash.com/photo-1494790108755-2616b612b742?w=400&h=400&fit=crop', true),
('Marcus Rodriguez', 'Startup Founder', 'TechStart Inc.', 'The connections I made here led to finding my co-founder. We built our startup from ideas discussed in The Network.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', true),
('Emily Park', 'AI Research Scientist', 'MIT Labs', 'The cutting-edge workshops and expert mentorship accelerated my transition into AI research. Incredible community!', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', true);

-- Insert sample events
INSERT INTO events (title, description, date, time, location, category, image_url, max_attendees, is_featured) VALUES
('AI & Machine Learning Workshop', 'Deep dive into the latest AI technologies and practical applications in modern software development.', '2024-03-15', '2:00 PM - 6:00 PM', 'Tech Lab A', 'Workshops', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop', 50, true),
('Tech Talk: Future of Web Development', 'Industry experts discuss emerging trends in web development and the evolution of frontend frameworks.', '2024-03-20', '7:00 PM - 9:00 PM', 'Main Auditorium', 'Talks', 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop', 150, false),
('Hackathon 2024', 'Code, collaborate, and compete in our annual hackathon event. Build amazing projects in 48 hours.', '2024-04-01', '9:00 AM - 5:00 PM', 'Innovation Center', 'Competitions', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', 100, true);

-- Insert sample committee members
INSERT INTO committee_members (name, role, department, year, major, bio, image_url, email, linkedin_url, github_url, member_type, order_index) VALUES
('Dr. Sarah Chen', 'Faculty Advisor', 'Computer Science', NULL, NULL, 'Leading expert in AI and machine learning with 15+ years of research experience.', 'https://images.unsplash.com/photo-1494790108755-2616b612b742?w=400&h=400&fit=crop', 'sarah.chen@university.edu', '#', NULL, 'advisor', 1),
('Prof. Michael Rodriguez', 'Technical Advisor', 'Software Engineering', NULL, NULL, 'Industry veteran with expertise in distributed systems and cloud architecture.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', 'michael.r@university.edu', '#', NULL, 'advisor', 2),
('Alex Thompson', 'President', NULL, 'Senior', 'Computer Science', 'Passionate about building inclusive tech communities and fostering innovation.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 'alex.t@student.edu', '#', '#', 'super_core', 1),
('Emily Wang', 'Vice President', NULL, 'Senior', 'Software Engineering', 'Focused on organizing impactful events and building industry partnerships.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', 'emily.w@student.edu', '#', '#', 'super_core', 2);

-- Insert sample gallery items
INSERT INTO gallery_items (title, description, image_url, category, date) VALUES
('AI Workshop Session', 'Students learning about machine learning algorithms and their practical applications.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop', 'Workshops', '2024-01-15'),
('Annual Tech Conference', 'Industry leaders sharing insights on emerging technologies and future trends.', 'https://images.unsplash.com/photo-1515169067868-5387ec36d7b7?w=800&h=600&fit=crop', 'Events', '2024-01-10'),
('Hackathon 2024 Teams', 'Passionate developers collaborating on innovative solutions during our annual hackathon.', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop', 'Competitions', '2024-01-05');

-- Insert sample sponsors
INSERT INTO sponsors (name, description, logo_url, website_url, tier) VALUES
('TechCorp Global', 'Leading technology solutions provider', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop', 'https://techcorp.com', 'Title'),
('Innovation Labs', 'Cutting-edge research and development', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop', 'https://innovationlabs.com', 'Title'),
('CloudTech Solutions', 'Cloud infrastructure specialists', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop', 'https://cloudtech.com', 'Gold'),
('DataFlow Inc.', 'Big data analytics platform', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop', 'https://dataflow.com', 'Gold');

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, author_name, author_image_url, featured_image_url, category, read_time, is_published, is_featured, published_at) VALUES
('The Future of Artificial Intelligence in Software Development', 'future-ai-software-development', 'Explore how AI is revolutionizing the way we write code, from automated testing to intelligent code completion.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Dr. Sarah Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b742?w=100&h=100&fit=crop', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop', 'Technology', '8 min read', true, true, now()),
('Building Your First React Application: A Complete Guide', 'react-application-guide', 'Learn the fundamentals of React development with this comprehensive tutorial for beginners.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'David Kim', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop', 'Tutorials', '12 min read', true, false, now());
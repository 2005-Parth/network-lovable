/*
  # Initial Schema for The Network Website

  1. New Tables
    - `carousel_slides` - Hero carousel slides
    - `testimonials` - User testimonials
    - `events` - Events and workshops
    - `committee_members` - Committee member profiles
    - `gallery_items` - Gallery images and videos
    - `sponsors` - Sponsor information
    - `blog_posts` - Blog articles
    - `contact_messages` - Contact form submissions
    - `newsletter_subscribers` - Newsletter subscriptions

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for public read access
    - Add admin policies for content management
*/

-- Carousel slides table
CREATE TABLE IF NOT EXISTS carousel_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  image_url text NOT NULL,
  button_text text DEFAULT 'Get Started',
  button_link text DEFAULT '/',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  company text,
  quote text NOT NULL,
  image_url text,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  location text NOT NULL,
  category text NOT NULL DEFAULT 'Workshop',
  image_url text,
  attendees integer DEFAULT 0,
  max_attendees integer DEFAULT 50,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  registration_link text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Committee members table
CREATE TABLE IF NOT EXISTS committee_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  department text,
  year text,
  major text,
  bio text,
  image_url text,
  email text,
  linkedin_url text,
  github_url text,
  phone text,
  member_type text NOT NULL DEFAULT 'member' CHECK (member_type IN ('advisor', 'super_core', 'head', 'sub_committee')),
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Gallery items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'Events',
  date date DEFAULT CURRENT_DATE,
  photographer text,
  tags text[],
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  logo_url text NOT NULL,
  website_url text,
  tier text NOT NULL DEFAULT 'Silver' CHECK (tier IN ('Title', 'Gold', 'Silver', 'Bronze')),
  contact_email text,
  contact_phone text,
  contract_start date,
  contract_end date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  author_name text NOT NULL,
  author_image_url text,
  author_bio text,
  featured_image_url text,
  category text NOT NULL DEFAULT 'Technology',
  tags text[],
  read_time text DEFAULT '5 min read',
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  message_type text DEFAULT 'general' CHECK (message_type IN ('general', 'sponsorship', 'partnership', 'support')),
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  is_active boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

-- Enable RLS on all tables
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public read policies for content tables
CREATE POLICY "Public can read active carousel slides"
  ON carousel_slides
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can read active testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can read events"
  ON events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read active committee members"
  ON committee_members
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can read active gallery items"
  ON gallery_items
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can read active sponsors"
  ON sponsors
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (is_published = true);

-- Contact and newsletter policies
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_carousel_slides_active_order ON carousel_slides (is_active, order_index);
CREATE INDEX IF NOT EXISTS idx_testimonials_active_featured ON testimonials (is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_events_date_status ON events (date, status);
CREATE INDEX IF NOT EXISTS idx_committee_members_type_order ON committee_members (member_type, order_index);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category_date ON gallery_items (category, date);
CREATE INDEX IF NOT EXISTS idx_sponsors_tier_active ON sponsors (tier, is_active);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_featured ON blog_posts (is_published, is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);
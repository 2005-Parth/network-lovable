import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct

// 1. Define a strong type for our committee members
interface Member {
  id: string;
  name: string;
  role: string;
  member_type: 'advisor' | 'super_core' | 'head' | 'sub_committee';
  image_name?: string;
  bio?: string;
  year?: string;
  major?: string;
  department?: string;
  linkedin_url?: string;
  github_url?: string;
  email?: string;
  image?: string; // This will be the constructed public URL
}

interface MemberCardProps {
  member: Member;
  showBio?: boolean;
}

// 2. MemberCard component is now strongly typed
function MemberCard({ member, showBio = false }: MemberCardProps) {
  return (
    <Card className="group h-full hover:shadow-glass transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/30">
      <CardContent className="p-6 text-center flex flex-col h-full">
        <div className="relative mb-6">
          <img
            src={member.image}
            alt={member.name}
            className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/40 transition-colors"
          />
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity" />
        </div>
        
        <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
        <p className="text-primary font-medium mb-1">{member.role}</p>
        
        {member.year && <p className="text-sm text-muted-foreground mb-2">{member.year} • {member.major}</p>}
        {member.department && <p className="text-sm text-muted-foreground mb-2">{member.department}</p>}
        {showBio && member.bio && <p className="text-muted-foreground text-sm mb-4 flex-grow">{member.bio}</p>}
        
        <div className="flex justify-center space-x-3 mt-auto pt-4">
          {member.email && (
            <a href={`mailto:${member.email}`} className="p-2 rounded-full bg-secondary hover:bg-primary/10 hover:text-primary transition-colors"><Mail className="w-4 h-4" /></a>
          )}
          {member.linkedin_url && (
            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary hover:bg-primary/10 hover:text-primary transition-colors"><Linkedin className="w-4 h-4" /></a>
          )}
          {member.github_url && (
            <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary hover:bg-primary/10 hover:text-primary transition-colors"><Github className="w-4 h-4" /></a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Committee() {
  // 3. State for each member type
  const [advisors, setAdvisors] = useState<Member[]>([]);
  const [superCore, setSuperCore] = useState<Member[]>([]);
  const [heads, setHeads] = useState<Member[]>([]);
  const [subCommittee, setSubCommittee] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // 4. Fetch all members once and distribute them
  useEffect(() => {
    const fetchCommitteeData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('committee_members')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error("Error fetching committee data:", error);
      } else {
        const processedMembers = data.map(member => ({
          ...member,
          image: member.image_name 
            ? supabase.storage.from('carousel-images').getPublicUrl(member.image_name).data.publicUrl
            : `https://ui-avatars.com/api/?name=${member.name.replace(' ', '+')}&background=0d0d0d&color=fff` // Fallback avatar
        }));

        // Distribute members into their respective groups
        setAdvisors(processedMembers.filter(m => m.member_type === 'advisor'));
        setSuperCore(processedMembers.filter(m => m.member_type === 'super_core'));
        setHeads(processedMembers.filter(m => m.member_type === 'head'));
        setSubCommittee(processedMembers.filter(m => m.member_type === 'sub_committee'));
      }
      setLoading(false);
    };

    fetchCommitteeData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading team members...</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <section className="py-20 bg-gradient-hero text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-5xl font-bold mb-4">Meet Our <span className="bg-gradient-primary bg-clip-text text-transparent">Committee</span></h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">The passionate individuals driving our community forward.</p>
        </motion.div>
      </section>

      {/* Advisors */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div /* ... intro ... */ className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Faculty Advisors</h2>
            <p className="text-muted-foreground">Experienced mentors guiding our community.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {advisors.map((member, index) => (
              <motion.div key={member.id} /* ... animation ... */>
                <MemberCard member={member} showBio={true} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Super Core */}
      <section className="py-16 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div /* ... intro ... */ className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Super Core Team</h2>
            <p className="text-muted-foreground">The leadership team driving our vision.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {superCore.map((member, index) => (
              <motion.div key={member.id} /* ... animation ... */>
                <MemberCard member={member} showBio={true} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Heads */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div /* ... intro ... */ className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Department Heads</h2>
            <p className="text-muted-foreground">Specialists leading our various initiatives.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {heads.map((member, index) => (
              <motion.div key={member.id} /* ... animation ... */>
                <MemberCard member={member} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub Committee */}
      <section className="py-16 bg-gradient-subtle">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div /* ... intro ... */ className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Sub Committee</h2>
              <p className="text-muted-foreground">Dedicated members supporting our daily operations.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subCommittee.map((member, index) => (
                 <motion.div key={member.id} /* ... animation ... */>
                   <MemberCard member={member} />
                 </motion.div>
              ))}
            </div>
         </div>
      </section>

      {/* Join Us Section */}
      <section id="join" className="py-20 bg-background">
        {/* ... This section remains static ... */}
      </section>
    </div>
  );
}
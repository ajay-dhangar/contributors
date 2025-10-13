import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Users, TrendingUp, Sparkles } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ThemeToggle } from '../components/ThemeToggle';
import { ContributorCard } from '../components/ContributorCard';
import { ContributorGridSkeleton } from '../components/LoadingSkeleton';
import { fetchContributors, getTopContributors, filterContributorsByName, Contributor } from '../utils/github';

export function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = 'Contributors | CodeHarborHub';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Meet the amazing contributors who make CodeHarborHub possible. Join our open-source community today!'
      );
    }

    loadContributors();
  }, []);

  async function loadContributors() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchContributors();
      setContributors(data);
    } catch (err) {
      setError('Failed to load contributors. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredContributors = useMemo(() => {
    return searchTerm
      ? filterContributorsByName(contributors, searchTerm)
      : contributors;
  }, [contributors, searchTerm]);

  const topContributors = useMemo(() => {
    return getTopContributors(filteredContributors, 10);
  }, [filteredContributors]);

  const recentContributors = useMemo(() => {
    return [...filteredContributors].slice(0, 20);
  }, [filteredContributors]);

  const newContributors = useMemo(() => {
    return [...filteredContributors].slice(-20).reverse();
  }, [filteredContributors]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Contributors
              </h1>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <a
                  href="https://github.com/CodeHarborHub/codeharborhub.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Star className="h-4 w-4 fill-current" />
                  Star on GitHub
                </a>
              </Button>
            </div>
          </div>

          <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
            Meet the amazing developers who contribute to CodeHarborHub. Join our community of{' '}
            <span className="font-semibold text-primary">{contributors.length}+</span> contributors!
          </p>

          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search contributors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-card border-2"
            />
          </div>
        </motion.div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All ({filteredContributors.length})
            </TabsTrigger>
            <TabsTrigger value="top" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top 10
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {loading ? (
              <ContributorGridSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredContributors.map((contributor, index) => (
                  <ContributorCard key={contributor.id} contributor={contributor} index={index} />
                ))}
              </motion.div>
            )}
            {!loading && filteredContributors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No contributors found matching your search.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="top" className="space-y-6">
            {loading ? (
              <ContributorGridSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {topContributors.map((contributor, index) => (
                  <ContributorCard key={contributor.id} contributor={contributor} index={index} />
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            {loading ? (
              <ContributorGridSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {recentContributors.map((contributor, index) => (
                  <ContributorCard key={contributor.id} contributor={contributor} index={index} />
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            {loading ? (
              <ContributorGridSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {newContributors.map((contributor, index) => (
                  <ContributorCard key={contributor.id} contributor={contributor} index={index} />
                ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

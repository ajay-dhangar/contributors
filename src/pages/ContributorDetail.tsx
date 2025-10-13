import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Briefcase,
  Link as LinkIcon,
  Mail,
  Users,
  GitCommit,
  Calendar,
  Twitter,
  BookOpen,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import { ThemeToggle } from '../components/ThemeToggle';
import { fetchContributorDetail, fetchContributorCommits, ContributorDetail, Commit } from '../utils/github';

export function ContributorDetailPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [contributor, setContributor] = useState<ContributorDetail | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      document.title = `${username} | Contributors | CodeHarborHub`;
      loadContributorData();
    }
  }, [username]);

  async function loadContributorData() {
    if (!username) return;

    try {
      setLoading(true);
      setError(null);
      const [detailData, commitsData] = await Promise.all([
        fetchContributorDetail(username),
        fetchContributorCommits(username),
      ]);
      setContributor(detailData);
      setCommits(commitsData);
    } catch (err) {
      setError('Failed to load contributor details. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <Skeleton className="h-48 w-48 rounded-full mx-auto" />
                  <Skeleton className="h-8 w-32 mx-auto" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !contributor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Button variant="outline" onClick={() => navigate('/contributors')} className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contributors
          </Button>
          <Alert variant="destructive">
            <AlertDescription>{error || 'Contributor not found'}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-2 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <Button variant="outline" onClick={() => navigate('/contributors')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contributors
          </Button>
          <ThemeToggle />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1"
          >
            <Card className="sticky top-8">
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-48 w-48 border-4 border-primary/20 shadow-xl">
                    <AvatarImage src={contributor.avatar_url} alt={contributor.login} />
                    <AvatarFallback className="text-4xl">
                      {contributor.login.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold">{contributor.name || contributor.login}</h1>
                    <p className="text-muted-foreground">@{contributor.login}</p>
                  </div>

                  {contributor.bio && (
                    <p className="text-start text-muted-foreground">{contributor.bio}</p>
                  )}

                  <Button asChild className="w-full">
                    <a
                      href={contributor.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View GitHub Profile
                    </a>
                  </Button>
                </div>

                <div className="space-y-3 pt-6 border-t">
                  {contributor.company && (
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{contributor.company}</span>
                    </div>
                  )}

                  {contributor.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{contributor.location}</span>
                    </div>
                  )}

                  {contributor.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`mailto:${contributor.email}`}
                        className="text-primary hover:underline truncate"
                      >
                        {contributor.email}
                      </a>
                    </div>
                  )}

                  {contributor.blog && (
                    <div className="flex items-center gap-3 text-sm">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={contributor.blog.startsWith('http') ? contributor.blog : `https://${contributor.blog}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        {contributor.blog}
                      </a>
                    </div>
                  )}

                  {contributor.twitter_username && (
                    <div className="flex items-center gap-3 text-sm">
                      <Twitter className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`https://twitter.com/${contributor.twitter_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        @{contributor.twitter_username}
                      </a>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{contributor.public_repos}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <BookOpen className="h-3 w-3" />
                      Repos
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{contributor.followers}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <Users className="h-3 w-3" />
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{contributor.following}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <Users className="h-3 w-3" />
                      Following
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(contributor.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2"
          >
            <Tabs defaultValue="commits" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="commits" className="flex items-center gap-2">
                  <GitCommit className="h-4 w-4" />
                  Commits ({commits.length})
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Overview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="commits" className="space-y-4">
                {commits.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">No commits found</p>
                    </CardContent>
                  </Card>
                ) : (
                  commits.map((commit, index) => (
                    <motion.div
                      key={commit.sha}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <GitCommit className="h-5 w-5 text-primary" />
                              </div>
                            </div>
                            <div className="flex-1 space-y-2">
                              <p className="font-medium line-clamp-2">{commit.commit.message}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(commit.commit.author.date).toLocaleDateString()}
                                </span>
                                <Badge variant="outline" className="font-mono text-xs">
                                  {commit.sha.substring(0, 7)}
                                </Badge>
                              </div>
                              <a
                                href={commit.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                              >
                                View commit
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contribution Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Activity</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Commits</span>
                          <Badge className="bg-gradient-to-r from-primary to-primary/80">
                            {commits.length}
                          </Badge>
                        </div>
                        {commits.length > 0 && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Latest Commit</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(commits[0].commit.author.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">First Commit</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(commits[commits.length - 1].commit.author.date).toLocaleDateString()}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">GitHub Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary">{contributor.public_repos}</div>
                            <div className="text-sm text-muted-foreground mt-1">Public Repositories</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary">{contributor.followers}</div>
                            <div className="text-sm text-muted-foreground mt-1">Followers</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

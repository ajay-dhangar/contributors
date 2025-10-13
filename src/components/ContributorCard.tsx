import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, GitCommit } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Contributor } from '../utils/github';

interface ContributorCardProps {
  contributor: Contributor;
  index: number;
}

export function ContributorCard({ contributor, index }: ContributorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/contributors/${contributor.login}`}>
        <Card className="overflow-hidden border-2 hover:border-primary transition-all duration-300 h-full bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-lg">
                  <AvatarImage src={contributor.avatar_url} alt={contributor.login} />
                  <AvatarFallback>{contributor.login.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                  <GitCommit className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-2 w-full">
                <h3 className="font-semibold text-lg truncate">{contributor.login}</h3>

                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-semibold"
                >
                  {contributor.contributions} contributions
                </Badge>
              </div>

              <a
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View GitHub Profile
              </a>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

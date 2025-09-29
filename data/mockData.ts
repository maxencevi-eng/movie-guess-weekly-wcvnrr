
import { Movie, User, Leaderboard } from '../types';

export const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'The Matrix',
    week: 1,
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
      'https://images.unsplash.com/photo-1489599735734-79b4f9ab7b34?w=400',
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400'
    ],
    isActive: true,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-21')
  },
  {
    id: '2',
    title: 'Inception',
    week: 2,
    images: [
      'https://images.unsplash.com/photo-1489599735734-79b4f9ab7b34?w=400',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400'
    ],
    isActive: false,
    startDate: new Date('2024-01-22'),
    endDate: new Date('2024-01-28')
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'MovieBuff',
    email: 'user@example.com',
    isAdmin: false,
    totalPoints: 45,
    weeklyPoints: 6,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'admin',
    username: 'Admin',
    email: 'admin@example.com',
    isAdmin: true,
    totalPoints: 0,
    weeklyPoints: 0,
    createdAt: new Date('2024-01-01')
  }
];

export const mockLeaderboard: Leaderboard[] = [
  {
    userId: '1',
    username: 'MovieBuff',
    totalPoints: 45,
    weeklyPoints: 6,
    rank: 1
  },
  {
    userId: '2',
    username: 'CinemaFan',
    totalPoints: 42,
    weeklyPoints: 3,
    rank: 2
  },
  {
    userId: '3',
    username: 'FilmLover',
    totalPoints: 38,
    weeklyPoints: 1,
    rank: 3
  }
];

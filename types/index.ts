
export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  totalPoints: number;
  weeklyPoints: number;
  createdAt: Date;
}

export interface Movie {
  id: string;
  title: string;
  week: number;
  images: string[];
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

export interface Guess {
  id: string;
  userId: string;
  movieId: string;
  guess: string;
  isCorrect: boolean;
  points: number;
  submittedAt: Date;
  imageIndex: number; // Which image was available when they guessed (0, 1, or 2)
}

export interface GameState {
  currentWeek: number;
  currentMovie: Movie | null;
  gameStarted: boolean;
  nextImageRelease: Date | null;
  currentImageIndex: number; // 0, 1, or 2
}

export interface Leaderboard {
  userId: string;
  username: string;
  totalPoints: number;
  weeklyPoints: number;
  rank: number;
}

export interface NotificationSchedule {
  gameStart: boolean;
  imageRelease: boolean;
  leaderboardUpdate: boolean;
}

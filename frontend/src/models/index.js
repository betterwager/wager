// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Leaderboard, UserLeaderboard } = initSchema(schema);

export {
  User,
  Leaderboard,
  UserLeaderboard
};
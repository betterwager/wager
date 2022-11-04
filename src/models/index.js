// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Leaderboard, User } = initSchema(schema);

export {
  Leaderboard,
  User
};
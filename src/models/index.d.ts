import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerUser = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly birthdate: string;
  readonly phonenumber: string;
  readonly trustscore: string;
  readonly bettingscore: string;
  readonly bets?: string[] | null;
  readonly wallet: string;
  readonly leaderboards: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly birthdate: string;
  readonly phonenumber: string;
  readonly trustscore: string;
  readonly bettingscore: string;
  readonly bets?: string[] | null;
  readonly wallet: string;
  readonly leaderboards: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User, UserMetaData>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}
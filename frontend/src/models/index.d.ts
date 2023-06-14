import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";





type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly birthdate: string;
  readonly phonenumber: string;
  readonly trustscore: string;
  readonly bettingscore: string;
  readonly friends?: string[] | null;
  readonly requests?: string[] | null;
  readonly leaderboards?: (UserLeaderboard | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly birthdate: string;
  readonly phonenumber: string;
  readonly trustscore: string;
  readonly bettingscore: string;
  readonly friends?: string[] | null;
  readonly requests?: string[] | null;
  readonly leaderboards: AsyncCollection<UserLeaderboard>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerLeaderboard = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Leaderboard, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly users?: (UserLeaderboard | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLeaderboard = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Leaderboard, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly users: AsyncCollection<UserLeaderboard>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Leaderboard = LazyLoading extends LazyLoadingDisabled ? EagerLeaderboard : LazyLeaderboard

export declare const Leaderboard: (new (init: ModelInit<Leaderboard>) => Leaderboard) & {
  copyOf(source: Leaderboard, mutator: (draft: MutableModel<Leaderboard>) => MutableModel<Leaderboard> | void): Leaderboard;
}

type EagerUserLeaderboard = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserLeaderboard, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId?: string | null;
  readonly leaderboardId?: string | null;
  readonly user: User;
  readonly leaderboard: Leaderboard;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUserLeaderboard = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserLeaderboard, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId?: string | null;
  readonly leaderboardId?: string | null;
  readonly user: AsyncItem<User>;
  readonly leaderboard: AsyncItem<Leaderboard>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UserLeaderboard = LazyLoading extends LazyLoadingDisabled ? EagerUserLeaderboard : LazyUserLeaderboard

export declare const UserLeaderboard: (new (init: ModelInit<UserLeaderboard>) => UserLeaderboard) & {
  copyOf(source: UserLeaderboard, mutator: (draft: MutableModel<UserLeaderboard>) => MutableModel<UserLeaderboard> | void): UserLeaderboard;
}
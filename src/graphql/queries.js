/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLeaderboard = /* GraphQL */ `
  query GetLeaderboard($id: ID!) {
    getLeaderboard(id: $id) {
      id
      users
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listLeaderboards = /* GraphQL */ `
  query ListLeaderboards(
    $filter: ModelLeaderboardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLeaderboards(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        users
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncLeaderboards = /* GraphQL */ `
  query SyncLeaderboards(
    $filter: ModelLeaderboardFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncLeaderboards(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        users
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      name
      birthdate
      phonenumber
      trustscore
      bettingscore
      bets
      wallet
      leaderboards
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        name
        birthdate
        phonenumber
        trustscore
        bettingscore
        bets
        wallet
        leaderboards
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        email
        name
        birthdate
        phonenumber
        trustscore
        bettingscore
        bets
        wallet
        leaderboards
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;

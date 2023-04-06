/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      id
      name
      birthdate
      phonenumber
      trustscore
      bettingscore
      friends
      requests
      leaderboards {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      name
      birthdate
      phonenumber
      trustscore
      bettingscore
      friends
      requests
      leaderboards {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      name
      birthdate
      phonenumber
      trustscore
      bettingscore
      friends
      requests
      leaderboards {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onCreateLeaderboard = /* GraphQL */ `
  subscription OnCreateLeaderboard(
    $filter: ModelSubscriptionLeaderboardFilterInput
  ) {
    onCreateLeaderboard(filter: $filter) {
      id
      name
      users {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onUpdateLeaderboard = /* GraphQL */ `
  subscription OnUpdateLeaderboard(
    $filter: ModelSubscriptionLeaderboardFilterInput
  ) {
    onUpdateLeaderboard(filter: $filter) {
      id
      name
      users {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onDeleteLeaderboard = /* GraphQL */ `
  subscription OnDeleteLeaderboard(
    $filter: ModelSubscriptionLeaderboardFilterInput
  ) {
    onDeleteLeaderboard(filter: $filter) {
      id
      name
      users {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onCreateUserLeaderboard = /* GraphQL */ `
  subscription OnCreateUserLeaderboard(
    $filter: ModelSubscriptionUserLeaderboardFilterInput
  ) {
    onCreateUserLeaderboard(filter: $filter) {
      id
      userId
      leaderboardId
      user {
        id
        name
        birthdate
        phonenumber
        trustscore
        bettingscore
        friends
        requests
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      leaderboard {
        id
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onUpdateUserLeaderboard = /* GraphQL */ `
  subscription OnUpdateUserLeaderboard(
    $filter: ModelSubscriptionUserLeaderboardFilterInput
  ) {
    onUpdateUserLeaderboard(filter: $filter) {
      id
      userId
      leaderboardId
      user {
        id
        name
        birthdate
        phonenumber
        trustscore
        bettingscore
        friends
        requests
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      leaderboard {
        id
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onDeleteUserLeaderboard = /* GraphQL */ `
  subscription OnDeleteUserLeaderboard(
    $filter: ModelSubscriptionUserLeaderboardFilterInput
  ) {
    onDeleteUserLeaderboard(filter: $filter) {
      id
      userId
      leaderboardId
      user {
        id
        name
        birthdate
        phonenumber
        trustscore
        bettingscore
        friends
        requests
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      leaderboard {
        id
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;

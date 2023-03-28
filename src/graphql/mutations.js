/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createLeaderboard = /* GraphQL */ `
  mutation CreateLeaderboard(
    $input: CreateLeaderboardInput!
    $condition: ModelLeaderboardConditionInput
  ) {
    createLeaderboard(input: $input, condition: $condition) {
      id
      users {
        nextToken
        startedAt
      }
      name
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateLeaderboard = /* GraphQL */ `
  mutation UpdateLeaderboard(
    $input: UpdateLeaderboardInput!
    $condition: ModelLeaderboardConditionInput
  ) {
    updateLeaderboard(input: $input, condition: $condition) {
      id
      users {
        nextToken
        startedAt
      }
      name
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteLeaderboard = /* GraphQL */ `
  mutation DeleteLeaderboard(
    $input: DeleteLeaderboardInput!
    $condition: ModelLeaderboardConditionInput
  ) {
    deleteLeaderboard(input: $input, condition: $condition) {
      id
      users {
        nextToken
        startedAt
      }
      name
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      email
      name
      birthdate
      phonenumber
      trustscore
      bettingscore
      friends
      Leaderboards {
        nextToken
        startedAt
      }
      requests
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      email
      name
      birthdate
      phonenumber
      trustscore
      bettingscore
      friends
      Leaderboards {
        nextToken
        startedAt
      }
      requests
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      email
      name
      birthdate
      phonenumber
      trustscore
      bettingscore
      friends
      Leaderboards {
        nextToken
        startedAt
      }
      requests
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createUserLeaderboard = /* GraphQL */ `
  mutation CreateUserLeaderboard(
    $input: CreateUserLeaderboardInput!
    $condition: ModelUserLeaderboardConditionInput
  ) {
    createUserLeaderboard(input: $input, condition: $condition) {
      id
      leaderboardID
      userID
      leaderboard {
        id
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      user {
        id
        email
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateUserLeaderboard = /* GraphQL */ `
  mutation UpdateUserLeaderboard(
    $input: UpdateUserLeaderboardInput!
    $condition: ModelUserLeaderboardConditionInput
  ) {
    updateUserLeaderboard(input: $input, condition: $condition) {
      id
      leaderboardID
      userID
      leaderboard {
        id
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      user {
        id
        email
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteUserLeaderboard = /* GraphQL */ `
  mutation DeleteUserLeaderboard(
    $input: DeleteUserLeaderboardInput!
    $condition: ModelUserLeaderboardConditionInput
  ) {
    deleteUserLeaderboard(input: $input, condition: $condition) {
      id
      leaderboardID
      userID
      leaderboard {
        id
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      user {
        id
        email
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;

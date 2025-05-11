import { expect, test } from "vitest";
import { accessTokenCookieManager, GenerateAccessTokens, IsUserAuthenticated, refreshTokenCookieManager, UpdateAuthTokens, VerifyAccessToken } from "./authentication";
import { HttpResponse } from "msw";
import jwt from "jsonwebtoken";
import { UserAuthenticationData, UserAuthenticationDataValidator } from "../components/types";
import { User, UserValidator } from "./types";

const ACCESS_TOKEN_SECRET = import.meta.env.VITE_ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = import.meta.env.VITE_REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_COOKIE="eyJhY2Nlc3NUb2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpWYzJWeVNXUWlPallzSWxWelpYSnVZVzFsSWpvaWRHVnpkRlZ6WlhJaUxDSlFZWE56SWpvaUpESmlKREV3SkRocVdYVTFXbHBWU0RGUk5td3hSMnAxVVM1aFRrOXhNVkJVZUVkcVVXRnlkRWQ0T0V0TGVWa3hiVU5PWldKdlVVOURWMkpwSWl3aVJXMWhhV3dpT2lKdFlXaGthV0ptYjJaaGJtRkFaMjFoYVd3dVkyOXRJaXdpVlhObGNsUjVjR1VpT2lKVFpXTnlaWFJoY25raUxDSnBZWFFpT2pFM05EWTVOamt6TURjc0ltVjRjQ0k2TVRjME5qazJPVE0yTjMwLjRaRlJWWThSTlowMV9LdzQ1WElFOHJlaHY5VDZ0M1daMkZFSGZVa0N0cEkifQ%3D%3D";
const REFRESH_TOKEN_COOKIE="eyJyZWZyZXNoVG9rZW4iOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKVmMyVnlTV1FpT2pZc0lsVnpaWEp1WVcxbElqb2lkR1Z6ZEZWelpYSWlMQ0pRWVhOeklqb2lKREppSkRFd0pEaHFXWFUxV2xwVlNERlJObXd4UjJwMVVTNWhUazl4TVZCVWVFZHFVV0Z5ZEVkNE9FdExlVmt4YlVOT1pXSnZVVTlEVjJKcElpd2lSVzFoYVd3aU9pSnRZV2hrYVdKbWIyWmhibUZBWjIxaGFXd3VZMjl0SWl3aVZYTmxjbFI1Y0dVaU9pSlRaV055WlhSaGNua2lMQ0pwWVhRaU9qRTNORFk1Tmprek1EY3NJbVY0Y0NJNk1UYzBOamsyT1RZd04zMC5tNTJ5RVU3LU9raGs5eVBFRnhwaG9nWHFFYjdTMzhESGZ5U0pocEhobkx3In0%3D";


const MockUser: User = {
  Username: "MockUser",
  Pass: "RandomPass",
  Email: "MockEmail@gmail.com",
  UserType: "Secretary"
}

const MockUser2: User = {
  Username: "MockUse",
  Pass: "RandomPass",
  Email: "MockEmail@gmail.com",
  UserType: "Secretary"
}

const FormatRawAuthTokenHeader = (rawCookieHeader: string): string => {
  // This is necessary to convert them to the format they'll be in post a Set-Cookie operation
  return rawCookieHeader.substring(rawCookieHeader.length-31,0);
}

// Generation of New Auth Tokens from Scratch, Put in the User then get the response and unserialise it to check.
test("Generating New Auth Tokens Happy Path", async () => {
  const rawCookieHeaders = await GenerateAccessTokens(MockUser);
  // This is necessary to convert them to the format they'll be in post a Set-Cookie operation
  // [0][1] is necessary because of the format that GenerateAccessTokens returns the Set-Cookies.
  const formattedAccessTokenHeader = FormatRawAuthTokenHeader(rawCookieHeaders[0][1]);
  const formattedRefreshTokenHeader = FormatRawAuthTokenHeader(rawCookieHeaders[1][1]);

  const newAccessTokenCookie = await accessTokenCookieManager.parse(formattedAccessTokenHeader);
  const newRefreshTokenCookie = await refreshTokenCookieManager.parse(formattedRefreshTokenHeader);

  const accessTokenUser = await jwt.verify(newAccessTokenCookie.accessToken, ACCESS_TOKEN_SECRET);
  const refreshTokenUser = await jwt.verify(newRefreshTokenCookie.refreshToken, REFRESH_TOKEN_SECRET);
  const validatedAccessTokenUser = UserValidator.safeParse(accessTokenUser);
  const validatedRefreshTokenUser = UserValidator.safeParse(refreshTokenUser);


  expect(validatedAccessTokenUser.success).toBe(true);
  expect(validatedRefreshTokenUser.success).toBe(true);
  expect(validatedAccessTokenUser.data).toStrictEqual(MockUser);
  expect(validatedRefreshTokenUser.data).toStrictEqual(validatedAccessTokenUser.data);
})

test("IsUserAuthenticated: Happy Path", async () => {
  // Generates new auth tokens and checks that they can be validated successfully.
  const rawHeaders = await GenerateAccessTokens(MockUser);
  const formattedAccessTokenHeader = FormatRawAuthTokenHeader(rawHeaders[0][1]);
  const formattedRefreshTokenHeader = FormatRawAuthTokenHeader(rawHeaders[1][1]);

  const newAccessTokenCookie = await accessTokenCookieManager.parse(formattedAccessTokenHeader);
  const newRefreshTokenCookie = await refreshTokenCookieManager.parse(formattedRefreshTokenHeader);
  
  const serializedAccessToken = await accessTokenCookieManager.serialize(newAccessTokenCookie);
  const serializedRefreshToken = await refreshTokenCookieManager.serialize(newRefreshTokenCookie);
  
  const formattedSerializedAccessToken = FormatRawAuthTokenHeader(serializedAccessToken);
  const formattedSerializedRefreshToken = FormatRawAuthTokenHeader(serializedRefreshToken);
  const colonSuffixRemovedRefreshToken = formattedSerializedRefreshToken.substring(formattedSerializedRefreshToken.length-1,0);

  const MOCK_REQUEST = new HttpResponse(null, {
    headers: {"cookie": `${formattedSerializedAccessToken} ${colonSuffixRemovedRefreshToken}`},
  });

  const responseData = await IsUserAuthenticated(MOCK_REQUEST);

  expect(responseData.clientResponse.success).toBe(true);
  expect(responseData.clientResponse.user).toStrictEqual(MockUser);
})

test("IsUserAuthenticated: Access Token Missing", async () => {

});

// Make sure that the refresh occurs
// test("IsUserAuthenticated: Outdated Access Token but Valid Refresh Token")

// test("IsUserAuthenticated: Outdated Access Token but Invalid Refresh Token")

// Generate Outdated auth tokens for testing.

// Test that if they logout that the cookies are actually invalid.
// test("Logout")
// Logout

async function GenerateTestAccessTokens(user: User, accessTokenLifetime: string, refreshTokenLifetime: string ): Promise<any[]> {
  // Give them access token and refresh tokens     
  const accessTokenCookie = {
    accessToken: jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: accessTokenLifetime})
  };
  const refreshTokenCookie = {
    refreshToken: jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: refreshTokenLifetime})
  };

  return([
      ["Set-Cookie", await accessTokenCookieManager.serialize(accessTokenCookie)],
      ["Set-Cookie", await refreshTokenCookieManager.serialize(refreshTokenCookie)]
    ]);
}
import { expect, test } from "vitest";
import { accessTokenCookieManager, GenerateAccessTokens, IsUserAuthenticated, Logout, refreshTokenCookieManager } from "./authentication";
import { HttpResponse } from "msw";
import jwt from "jsonwebtoken";
import { User, UserValidator } from "./types";


const ACCESS_TOKEN_SECRET = import.meta.env.VITE_ACCESS_TOKEN_SECRET || "TEST SECRET";
const REFRESH_TOKEN_SECRET = import.meta.env.VITE_REFRESH_TOKEN_SECRET || "TEST SECRET";

const MockUser: User = {
  Username: "MockUser",
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
  expect(validatedRefreshTokenUser.data).toStrictEqual(MockUser);
})

// Generates new auth tokens and checks that they can be validated successfully.
test("IsUserAuthenticated: Happy Path", async () => {
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
  const MOCK_REQUEST = new HttpResponse(null, {
    headers: {"cookie": ``},
  });

  const responseData = await IsUserAuthenticated(MOCK_REQUEST);

  expect(responseData.clientResponse.success).toBe(false);
  expect(responseData.clientResponse.user).toBeNull();
});

// Make sure that the refresh occurs
test("IsUserAuthenticated: Outdated Access Token but Valid Refresh Token", async () => {
    // Generates new auth tokens and checks that they can be validated successfully.
  const rawHeaders = await GenerateTestAccessTokens(MockUser, "-1m", "5m");
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

// Make sure that the refresh occurs
test("IsUserAuthenticated: Outdated Access Token but Invalid Refresh Tokenn", async () => {
    // Generates new auth tokens and checks that they can be validated successfully.
  const rawHeaders = await GenerateTestAccessTokens(MockUser, "-1m", "-5m");
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

  expect(responseData.clientResponse.success).toBe(false);
  expect(responseData.clientResponse.user).toBeNull();
})

// Test that if they logout that the cookies are actually invalid.
test("Logout: Happy Path", async () => {
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

  const invalidatedCookies = await Logout(MOCK_REQUEST);

  const verificationAccessToken = await accessTokenCookieManager.parse(FormatRawAuthTokenHeader(invalidatedCookies[0][1]));
  const verificationRefreshToken = await refreshTokenCookieManager.parse(FormatRawAuthTokenHeader(invalidatedCookies[1][1]));
  
  expect(() => jwt.verify(newAccessTokenCookie.accessToken, ACCESS_TOKEN_SECRET)).not.toThrowError();
  expect(() => jwt.verify(newRefreshTokenCookie.refreshToken, REFRESH_TOKEN_SECRET)).not.toThrowError();
  expect(() => jwt.verify(verificationAccessToken.accessToken, ACCESS_TOKEN_SECRET)).toThrowError("expired");
  expect(() => jwt.verify(verificationRefreshToken.refreshToken, REFRESH_TOKEN_SECRET)).toThrowError("expired");
})

async function GenerateTestAccessTokens(user: User, accessTokenLifetime: any, refreshTokenLifetime: any ): Promise<any[]> {
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


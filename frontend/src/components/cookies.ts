import { createCookie } from "react-router";

export const accessTokenCookieManager = createCookie("accessToken");
export const refreshTokenCookieManager = createCookie("refreshToken");
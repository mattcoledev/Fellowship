import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={180} height={180}>
      <rect width="512" height="512" rx="90" fill="#0F172A"/>
      <polygon points="256,28 148,228 364,228" fill="#6B5744"/>
      <polygon points="256,28 148,228 220,228" fill="#7D6854" opacity="0.5"/>
      <rect x="132" y="218" width="248" height="34" rx="17" fill="#3D2A18"/>
      <ellipse cx="256" cy="300" rx="70" ry="63" fill="#D4956A"/>
      <path d="M192 271 Q214 257 245 265" stroke="#8C7555" stroke-width="11" fill="none" stroke-linecap="round"/>
      <path d="M267 265 Q298 257 320 271" stroke="#8C7555" stroke-width="11" fill="none" stroke-linecap="round"/>
      <circle cx="220" cy="283" r="11" fill="#1A0E06"/>
      <circle cx="292" cy="283" r="11" fill="#1A0E06"/>
      <circle cx="223" cy="280" r="3.5" fill="white" opacity="0.85"/>
      <circle cx="295" cy="280" r="3.5" fill="white" opacity="0.85"/>
      <ellipse cx="256" cy="303" rx="11" ry="15" fill="#BD7248"/>
      <path d="M214 324 Q235 315 256 319 Q277 315 298 324" stroke="#D0C5A8" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M186 342 Q150 397 157 454 Q173 502 256 510 Q339 502 355 454 Q362 397 326 342 Q300 330 256 334 Q212 330 186 342Z" fill="#E5E2D8"/>
      <path d="M256 338 Q251 393 253 448 Q254 478 256 505" stroke="#C2BEB4" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>
      <path d="M218 345 Q201 395 208 448 Q218 478 244 496" stroke="#C2BEB4" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.7"/>
      <path d="M294 345 Q311 395 304 448 Q294 478 268 496" stroke="#C2BEB4" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.7"/>
    </svg>,
    { ...size }
  )
}

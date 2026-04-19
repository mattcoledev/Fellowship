import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={180} height={180}>
      <rect width="512" height="512" rx="90" fill="#0F172A"/>
      <path d="M256,92 L82,103 Q74,104 74,112 L74,408 Q74,416 82,417 L256,406 Z" fill="#F5F0E5"/>
      <path d="M256,92 L430,103 Q438,104 438,112 L438,408 Q438,416 430,417 L256,406 Z" fill="#EDE9DE"/>
      <path d="M256,92 L234,94 L234,406 L256,406 Z" fill="#C8BFB0" opacity="0.45"/>
      <path d="M256,92 L278,94 L278,406 L256,406 Z" fill="#B8B0A0" opacity="0.35"/>
      <rect x="247" y="86" width="18" height="326" rx="4" fill="#C49A3C"/>
      <rect x="251" y="86" width="6" height="326" rx="3" fill="#D4B04C" opacity="0.55"/>
      <rect x="106" y="155" width="126" height="9" rx="4" fill="#B0A492" opacity="0.85"/>
      <rect x="106" y="181" width="114" height="9" rx="4" fill="#B0A492" opacity="0.85"/>
      <rect x="106" y="207" width="134" height="9" rx="4" fill="#B0A492" opacity="0.85"/>
      <rect x="106" y="233" width="108" height="9" rx="4" fill="#B0A492" opacity="0.85"/>
      <rect x="106" y="259" width="130" height="9" rx="4" fill="#B0A492" opacity="0.85"/>
      <rect x="106" y="285" width="118" height="9" rx="4" fill="#B0A492" opacity="0.85"/>
      <rect x="280" y="155" width="118" height="9" rx="4" fill="#A09890" opacity="0.85"/>
      <rect x="280" y="181" width="132" height="9" rx="4" fill="#A09890" opacity="0.85"/>
      <rect x="280" y="207" width="106" height="9" rx="4" fill="#A09890" opacity="0.85"/>
      <rect x="280" y="233" width="128" height="9" rx="4" fill="#A09890" opacity="0.85"/>
      <rect x="280" y="259" width="112" height="9" rx="4" fill="#A09890" opacity="0.85"/>
      <rect x="280" y="285" width="126" height="9" rx="4" fill="#A09890" opacity="0.85"/>
    </svg>,
    { ...size }
  )
}

"use client"

import React from "react"
import { QRCodeSVG } from "qrcode.react"

export function AssetQRCode({ value, size = 120, className = "" }) {
  if (!value) return null

  return (
    <div className={`p-[2px] bg-white rounded-md inline-block border border-slate-100 ${className}`}>
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        includeMargin={false}
        imageSettings={{
          src: "/railway-logo-mini.png", // Optional: Add a small logo in the middle if exists
          x: undefined,
          y: undefined,
          height: 24,
          width: 24,
          excavate: true,
        }}
      />
    </div>
  )
}

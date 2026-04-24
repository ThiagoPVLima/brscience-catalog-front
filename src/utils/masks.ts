export function maskNCM(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 4) return d
  if (d.length <= 6) return `${d.slice(0, 4)}.${d.slice(4)}`
  return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6)}`
}

export function maskCEST(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 7)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
}

// Format: X.XXXX.XXXX.XXX-X (13 digits)
export function maskANVISA(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 13)
  if (d.length <= 1) return d
  if (d.length <= 5) return `${d.slice(0, 1)}.${d.slice(1)}`
  if (d.length <= 9) return `${d.slice(0, 1)}.${d.slice(1, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 1)}.${d.slice(1, 5)}.${d.slice(5, 9)}.${d.slice(9)}`
  return `${d.slice(0, 1)}.${d.slice(1, 5)}.${d.slice(5, 9)}.${d.slice(9, 12)}-${d.slice(12)}`
}

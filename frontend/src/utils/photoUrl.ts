const apiUrl = import.meta.env.VITE_API_URL || '/api/v1'

function getApiOrigin(): string {
  if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
    return new URL(apiUrl).origin
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return ''
}

export function resolvePhotoUrl(photoRef: string, size: 800 | 100 = 800): string {
  if (!photoRef) return ''

  if (photoRef.startsWith('http://') || photoRef.startsWith('https://')) {
    return photoRef
  }

  if (photoRef.startsWith('blob:') || photoRef.startsWith('data:')) {
    return photoRef
  }

  if (photoRef.startsWith('/uploads/')) {
    return `${getApiOrigin()}${photoRef}`
  }

  if (photoRef.startsWith('uploads/')) {
    return `${getApiOrigin()}/${photoRef}`
  }

  return `https://drive.google.com/thumbnail?id=${photoRef}&sz=w${size}`
}

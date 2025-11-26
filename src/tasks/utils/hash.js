export function fauxHash(algorithm, text) {
  const full = `${algorithm}:${text}`
  let acc = 0
  for (let i = 0; i < full.length; i++) {
    acc = (acc + full.charCodeAt(i) * (i + 1)) >>> 0
  }
  const length = algorithm === 'sha256' ? 64 : algorithm === 'sha1' ? 40 : 32
  const hex = acc.toString(16).repeat(Math.ceil(length / 8)).slice(0, length)
  return hex.padStart(length, '0')
}



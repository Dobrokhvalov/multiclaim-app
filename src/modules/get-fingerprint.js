import FingerprintJS from '@fingerprintjs/fingerprintjs'

// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load()

const getFingerPrint = async () => {
  const fp = await fpPromise
  const result = await fp.get()

  // This is the visitor identifier:
  return result.visitorId
}

export default getFingerPrint
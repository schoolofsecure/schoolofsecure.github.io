export const FORMSUBMIT_EMAIL = 'erikapappkovacs@gmail.com'

export async function submitToFormSubmit(fields, { honeypot } = {}) {
  if (honeypot) {
    return { success: true }
  }

  const res = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _template: 'table',
      ...fields,
    }),
  })

  const data = await res.json().catch(() => ({}))
  const failed = !res.ok || data.success === 'false' || data.success === false

  if (failed) {
    throw new Error(data.message || 'Could not send the request.')
  }

  return data
}

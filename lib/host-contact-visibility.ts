/** Whether the host opted to share email and/or phone on the listing. */
export function hostSharesContactInfo(property: {
  showContactEmail?: boolean
  showContactPhone?: boolean
  contactEmail?: string
  contactPhone?: string
}): boolean {
  const email = property.contactEmail?.trim()
  const phone = property.contactPhone?.trim()
  return Boolean((property.showContactEmail && email) || (property.showContactPhone && phone))
}

/** Contact details are only shown to signed-in users when the host enabled sharing. */
export function canViewHostContactInfo(
  property: Parameters<typeof hostSharesContactInfo>[0],
  isSignedIn: boolean
): boolean {
  return isSignedIn && hostSharesContactInfo(property)
}

import { redirect } from 'next/navigation'

/** Canonical host marketing + listing entry is /create */
export default function ListYourTreehousePage() {
  redirect('/create')
}

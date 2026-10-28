import { company } from '../data.js'
import { WhatsAppLink } from './WhatsAppLink.jsx'

// "Book a free call": opens the Cal.com booking page once company.calLink is set in data.js,
// and until then starts a WhatsApp chat asking for a call.
export default function BookCallLink(props) {
  if (company.calLink) {
    return <a href={company.calLink} target="_blank" rel="noopener noreferrer" {...props} />
  }
  return <WhatsAppLink page="call" {...props} />
}

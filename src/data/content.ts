export const navigation = [['Home','home'],['Solutions','solutions'],['How It Works','process'],['Pricing','pricing'],['About','about'],['Contact','contact']] as const
export const engine = {
  id:'sales-engine', title:'Rainmakers Sales Engine', price:'30,000',
  subtitle:'AI-powered sales automation platform',
  description:'An AI-powered sales automation platform designed to manage and automate sales activities from lead capture to follow-up. CRM is built into the system, alongside AI assistance, WhatsApp integration and sales workflow automation.',
  summary:'AI-powered sales automation with built-in CRM, WhatsApp integration and intelligent lead management.',
  features:['AI Chat Assistant','Built-in CRM','WhatsApp API integration','Automated lead capture','Lead qualification','Lead scoring and categorisation','Automated follow-ups','Lead nurturing','Sales pipeline management','AI-powered objection handling','Sales analytics and reporting','Human sales team handover','Automated data entry'],
  highlights:['AI Chat Assistant','Built-in CRM','WhatsApp API integration','Automated lead capture','Automated follow-ups'],
  message:"Hi Rainmakers, I'm interested in the Rainmakers Sales Engine. Please share more details."
}
export const outsourcing = {
  id:'outsourcing', title:'Inbound Sales Outsourcing', price:'80,000',
  subtitle:'Your inbound sales team, without building one in-house',
  description:'Your inbound sales operation, handled by our expert team. We manage incoming enquiries, engage prospects, qualify opportunities, follow up and work towards converting leads into customers.',
  summary:'End-to-end inbound sales handling by an expert team.',
  features:['Receive incoming enquiries','Respond to prospects','Understand customer requirements','Qualify leads','Present products and services','Handle objections','Follow up with prospects','Negotiate and close sales','Maintain customer records','Provide sales performance reports'],
  highlights:['Respond to prospects','Qualify leads','Follow up with prospects','Negotiate and close sales','Provide sales performance reports'],
  message:"Hi Rainmakers, I'm interested in inbound sales outsourcing for my business. Please contact me."
}
export const plans = [engine, outsourcing]
export const principles = [
  ['Technology','Use automation and AI to support repetitive sales activities and organise the sales process.'],
  ['Human expertise','Put trained sales professionals behind customer conversations when businesses outsource inbound sales.'],
  ['One objective','Help businesses make better use of the enquiries and opportunities they already receive.']
]
export const benefits = ['Respond to enquiries more consistently.','Reduce manual and repetitive sales tasks.','Keep lead information and conversations organised.','Improve follow-up discipline.','Support better visibility across the sales pipeline.','Combine technology with human sales expertise.']
export const stages = [['Capture','Bring customer enquiries into an organised sales process.'],['Engage','Respond and start relevant conversations.'],['Qualify','Understand needs and identify sales-ready prospects.'],['Convert','Follow up and move opportunities towards a sale.']]
export const faq = [
  ['What is Rainmakers?','Rainmakers is a Sri Lankan sales technology and outsourcing company offering AI-powered sales automation and expert inbound sales management.'],
  ['What is the Rainmakers Sales Engine?',engine.description],
  ['Does the Sales Engine include a CRM?','Yes. CRM is built into the Sales Engine alongside AI chat assistance, WhatsApp integration and workflow automation.'],
  ['What is inbound sales outsourcing?',outsourcing.description],
  ['How much does Rainmakers Sales Engine cost?',`LKR ${engine.price} per month.`],
  ['How much does inbound sales outsourcing cost?',`LKR ${outsourcing.price} per month.`],
  ['Is there a setup fee?','Both packages have zero setup fee.'],
  ['How can I contact Rainmakers?','Message Rainmakers on WhatsApp or call +94 76 670 7391.']
]

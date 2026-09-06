export type PlanId='core'|'pro'|'operator'|'enterprise';
export const plans=[
{id:'core' as PlanId,name:'Core',price:29,description:'Your persistent AI operating layer.',features:['3 active projects','5 specialized agents','2 GB durable memory','Standard model routing','Community support']},
{id:'pro' as PlanId,name:'Pro',price:99,description:'For builders running serious agentic workflows.',popular:true,features:['Unlimited projects','25 specialized agents','25 GB durable memory','Advanced model routing','Automations + research','Priority support']},
{id:'operator' as PlanId,name:'Operator',price:249,description:'An AI operating system for a company or power user.',features:['Team workspace','100 specialized agents','100 GB durable memory','Private-routing policies','Audit & compliance history','Advanced automations','Operator support']},
{id:'enterprise' as PlanId,name:'Enterprise',price:null,description:'Private deployment, governance and dedicated support.',features:['Custom capacity','SSO / SCIM roadmap','Private model endpoints','Custom retention policies','Dedicated environments','Security review + SLA']}
];

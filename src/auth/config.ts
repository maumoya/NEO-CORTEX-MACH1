export function clerkConfigured(){return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY&&process.env.CLERK_SECRET_KEY);}
export function stripeConfigured(){return Boolean(process.env.STRIPE_SECRET_KEY);}
export function databaseConfigured(){return Boolean(process.env.DATABASE_URL);}
export function isAdminUserId(userId:string|null|undefined){if(!userId)return false;return (process.env.ADMIN_USER_IDS??'').split(',').map(v=>v.trim()).filter(Boolean).includes(userId);}

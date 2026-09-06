export function Kpi({label,value,note}:{label:string;value:string;note?:string}){return <div className="kpi"><span>{label}</span><strong>{value}</strong>{note&&<small>{note}</small>}</div>}

import Link from "next/link";

export default function LoginPage() {
  return <main className="main"><div className="page" style={{maxWidth:520,paddingTop:80}}><div className="card stack"><div><h1 style={{margin:0}}>Entrar al OS</h1><p className="meta">Esta build corre en demo aislada hasta conectar un proyecto Supabase propio.</p></div><input className="input" placeholder="email@empresa.com"/><input className="input" type="password" placeholder="Contraseña"/><button className="btn" disabled>Entrar con Supabase</button><Link className="btn secondary" href="/dashboard">Entrar a Northstar Demo</Link></div></div></main>;
}

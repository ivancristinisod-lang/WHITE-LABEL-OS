import { createSupabaseServerClient } from "./supabase/server";

export async function requireCapability(capability:string){
  const supabase=await createSupabaseServerClient(); if(!supabase)throw new Error("Supabase is not configured");
  const {data:auth}=await supabase.auth.getUser(); if(!auth.user)throw new Error("Unauthorized");
  const {data,error}=await supabase.rpc("current_user_has_capability",{capability_key:capability}); if(error||data!==true)throw new Error("Forbidden");
  return {supabase,user:auth.user};
}

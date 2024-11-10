import { createClient } from "@supabase/supabase-js";

const url = "https://mmxshjhiqppcrygzikja.supabase.co";
const pubKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1teHNoamhpcXBwY3J5Z3ppa2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3OTc3MTksImV4cCI6MjA0NjM3MzcxOX0.nZDD3noIuBTuGlZ04VV5Cw6zDx4krXO3wSZn1bkhgwU";

const supabase = createClient(url, pubKey);

export default supabase;

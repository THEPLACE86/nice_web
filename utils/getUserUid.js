import { supabase } from "./supabaseClient";

const Uid = async () => {
    const user = await supabase.auth.getUser();
    return user?.id
}

export default Uid
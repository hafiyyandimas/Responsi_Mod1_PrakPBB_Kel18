import { supabase } from "../config/supabaseClient.js";

export const LoanModel = {
  // filters: { status, member_name, book_title }
  async getAll(filters = {}) {
    let query = supabase
      .from("loans")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters.status) query = query.eq("status", filters.status);
    if (filters.member_name) query = query.ilike("member_name", `%${filters.member_name}%`);
    if (filters.book_title) query = query.ilike("book_title", `%${filters.book_title}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // mengembalikan null jika data tidak ditemukan
  async getById(id) {
    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("loans")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // mengembalikan null jika data tidak ditemukan
  async update(id, payload) {
    const { data, error } = await supabase
      .from("loans")
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // mengembalikan null jika data tidak ditemukan
  async remove(id) {
    const { data, error } = await supabase
      .from("loans")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};

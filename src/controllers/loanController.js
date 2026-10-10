import { LoanModel } from "../models/loanModel.js";

const VALID_STATUS = ["Dipinjam", "Dikembalikan", "Terlambat"];
const ALLOWED_FIELDS = ["member_name", "book_title", "loan_date", "due_date", "return_date", "status"];
const DATE_FIELDS = ["loan_date", "due_date", "return_date"];
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

// Ambil hanya field yang diizinkan dari body
const pick = (body = {}) =>
  Object.fromEntries(Object.entries(body).filter(([key]) => ALLOWED_FIELDS.includes(key)));

// Kembalikan pesan error (string) atau null jika valid
function validate(data, { requireAll }) {
  if (requireAll) {
    for (const field of ["member_name", "book_title", "due_date"]) {
      if (!data[field]) return `Field '${field}' wajib diisi`;
    }
  }
  if (data.status !== undefined && !VALID_STATUS.includes(data.status)) {
    return `Status harus salah satu dari: ${VALID_STATUS.join(", ")}`;
  }
  for (const field of DATE_FIELDS) {
    if (data[field] !== undefined && data[field] !== null && !isDate(data[field])) {
      return `Field '${field}' harus berformat YYYY-MM-DD`;
    }
  }
  return null;
}

export const LoanController = {
  // GET /loans  |  GET /loans?status=Terlambat
  async getAll(req, res) {
    try {
      const { status, member_name, book_title } = req.query;
      if (status && !VALID_STATUS.includes(status)) {
        return res
          .status(400)
          .json({ error: `Status harus salah satu dari: ${VALID_STATUS.join(", ")}` });
      }
      const loans = await LoanModel.getAll({ status, member_name, book_title });
      res.json(loans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const loan = await LoanModel.getById(req.params.id);
      if (!loan) return res.status(404).json({ error: "Data peminjaman tidak ditemukan" });
      res.json(loan);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = pick(req.body);
      const invalid = validate(data, { requireAll: true });
      if (invalid) return res.status(400).json({ error: invalid });

      const loan = await LoanModel.create(data);
      res.status(201).json(loan);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = pick(req.body);
      if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Tidak ada field yang valid untuk diubah" });
      }
      const invalid = validate(data, { requireAll: false });
      if (invalid) return res.status(400).json({ error: invalid });

      const loan = await LoanModel.update(req.params.id, data);
      if (!loan) return res.status(404).json({ error: "Data peminjaman tidak ditemukan" });
      res.json(loan);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const loan = await LoanModel.remove(req.params.id);
      if (!loan) return res.status(404).json({ error: "Data peminjaman tidak ditemukan" });
      res.json({ message: "Data peminjaman berhasil dihapus" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

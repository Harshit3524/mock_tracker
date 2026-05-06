"use client";
import { useState, useEffect } from "react";
import { supabase, PdfDoc } from "@/lib/supabase";
import { format } from "date-fns";

interface PdfSectionProps {
  userName: string;
}

export default function PdfSection({ userName }: PdfSectionProps) {
  const [docs, setDocs] = useState<PdfDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docName, setDocName] = useState("");
  const [docDesc, setDocDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchDocs = async () => {
    setLoading(true);
    const res = await fetch("/api/pdfs");
    const data = await res.json();
    setDocs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const upload = async () => {
    if (!file || !docName) {
      alert("Please provide a name and select a file.");
      return;
    }
    setUploading(true);

    const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
    const { error: storageError } = await supabase.storage
      .from("pdfs")
      .upload(fileName, file);

    if (storageError) {
      alert("Upload failed: " + storageError.message);
      setUploading(false);
      return;
    }

    await fetch("/api/pdfs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: docName,
        description: docDesc,
        uploaded_by: userName,
        file_path: fileName,
      }),
    });

    setDocName("");
    setDocDesc("");
    setFile(null);
    setShowForm(false);
    setUploading(false);
    fetchDocs();
  };

  const deletePdf = async (doc: PdfDoc) => {
    if (!confirm(`Delete "${doc.name}"?`)) return;
    await fetch(`/api/pdfs?id=${doc.id}&filePath=${doc.file_path}`, {
      method: "DELETE",
    });
    fetchDocs();
  };

  const openPdf = async (doc: PdfDoc) => {
    const { data } = await supabase.storage
      .from("pdfs")
      .createSignedUrl(doc.file_path, 60 * 60); // 1 hour
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-bold text-xl">
          Study Docs &amp; Resources
        </h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Upload PDF"}
        </button>
      </div>

      {showForm && (
        <div
          className="fade-in rounded-xl p-5 mb-6"
          style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-display font-semibold uppercase tracking-widest mb-1 text-muted">
                Document Name *
              </label>
              <input
                className="field-input"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g. Physics Formula Sheet"
              />
            </div>
            <div>
              <label className="block text-xs font-display font-semibold uppercase tracking-widest mb-1 text-muted">
                Description
              </label>
              <input
                className="field-input"
                value={docDesc}
                onChange={(e) => setDocDesc(e.target.value)}
                placeholder="Optional short description"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-display font-semibold uppercase tracking-widest mb-1 text-muted">
                PDF File *
              </label>
              <input
                type="file"
                accept=".pdf"
                className="field-input"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <button className="btn-primary mt-4" onClick={upload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-muted text-sm">Loading documents...</p>
      ) : docs.length === 0 ? (
        <div
          className="text-center py-12 rounded-xl"
          style={{ background: "var(--surface)", border: "1.5px dashed var(--border)" }}
        >
          <div className="text-3xl mb-2">📁</div>
          <p className="text-muted text-sm">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="fade-in rounded-xl p-4 flex flex-col gap-2"
              style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display font-semibold text-sm">{doc.name}</div>
                  {doc.description && (
                    <div className="text-muted text-xs mt-0.5">{doc.description}</div>
                  )}
                </div>
                <span className="text-2xl">📄</span>
              </div>
              <div className="text-muted text-xs">
                By {doc.uploaded_by} •{" "}
                {format(new Date(doc.created_at), "dd MMM yyyy")}
              </div>
              <div className="flex gap-2 mt-1">
                <button
                  className="btn-primary"
                  style={{ padding: "5px 14px", fontSize: "0.75rem" }}
                  onClick={() => openPdf(doc)}
                >
                  Open
                </button>
                <button className="btn-danger" onClick={() => deletePdf(doc)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

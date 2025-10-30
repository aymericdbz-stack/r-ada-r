'use client';

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/components/AuthProvider";
import { PROJECT_STORAGE_BUCKET } from "@/lib/constants";
import type { Database } from "@/lib/database.types";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  public_url: string | null;
};

type DashboardClientProps = {
  projects: Project[];
};

export function DashboardClient({ projects }: DashboardClientProps) {
  const { supabase, user } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "loading">("idle");
  const [items, setItems] = useState<Project[]>(projects);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const hasFile = useMemo(() => Boolean(file), [file]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!hasFile || !title.trim()) {
      setFormError("Merci d'ajouter un titre et un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    if (description.trim()) {
      formData.append("description", description.trim());
    }
    formData.append("file", file as File);

    setFormStatus("loading");
    const response = await fetch("/api/generate", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setFormError(payload?.error ?? "Une erreur est survenue.");
      setFormStatus("idle");
      return;
    }

    const payload = (await response.json()) as { project: Project };
    setItems((current) => [payload.project, ...current]);
    setTitle("");
    setDescription("");
    setFile(null);
    setFormStatus("idle");
  };

  const handleDelete = async (project: Project) => {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setFormError(payload?.error ?? "Impossible de supprimer ce projet.");
      return;
    }

    setItems((current) => current.filter((item) => item.id !== project.id));
  };

  const resolvePublicUrl = (path: string | null) => {
    if (!path) {
      return null;
    }

    const { data } = supabase.storage
      .from(PROJECT_STORAGE_BUCKET)
      .getPublicUrl(path);

    return data?.publicUrl ?? null;
  };

  return (
    <div className="dashboard-shell">
      <section className="dashboard-section dashboard-header">
        <div>
          <h1>Mon espace créateur</h1>
          <p>
            {user?.email
              ? `Connecté en tant que ${user.email}.`
              : "Connectez-vous pour gérer vos projets."}
          </p>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Uploader un nouveau projet</h2>
        <p>Ajoutez vos créations pour les retrouver facilement.</p>
        <form className="upload-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Titre</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Concert expérimental"
              required
            />
          </label>

          <label className="form-field">
            <span>Description (facultatif)</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Quelques détails pour vous en souvenir."
            />
          </label>

          <label className="form-field">
            <span>Image</span>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>

          {formError ? <p className="form-error">{formError}</p> : null}

          <button
            type="submit"
            className="form-submit"
            disabled={formStatus === "loading"}
          >
            {formStatus === "loading" ? "Envoi..." : "Ajouter au portfolio"}
          </button>
        </form>
      </section>

      <section className="dashboard-section">
        <h2>Mes projets</h2>
        {items.length === 0 ? (
          <p className="project-empty">
            Vous n&apos;avez pas encore de projet. Lancez-vous !
          </p>
        ) : (
          <ul className="project-grid">
            {items.map((project) => {
              const publicUrl = project.public_url ?? resolvePublicUrl(project.image_path);
              return (
                <li key={project.id} className="project-card">
                  {publicUrl ? (
                    <img src={publicUrl} alt={project.title} />
                  ) : (
                    <div className="project-placeholder">{project.title}</div>
                  )}
                  <div className="project-body">
                    <h3>{project.title}</h3>
                    {project.description ? <p>{project.description}</p> : null}
                    <button
                      type="button"
                      onClick={() => handleDelete(project)}
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { trackerApi } from "@/apis/tracker.api";
import TrackerDetailsView from "@/components/trackers/TrackerDetailsView";
import TrackerDrawer from "@/components/trackers/TrackerDrawer";
import { ArrowLeft } from "lucide-react";

export default function TrackerDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [tracker, setTracker] = useState(null);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([trackerApi.getById(id), trackerApi.getValues(id)])
        .then(([tData, vData]) => {
          setTracker(tData);
          setValues(vData || []);
        })
        .catch(() => setError("Tracker not found"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] font-mono text-xs text-[var(--text-muted)]">
          Loading tracker journey...
        </div>
      </MainLayout>
    );
  }

  if (error || !tracker) {
    return (
      <MainLayout>
        <div className="p-6 font-mono space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Trackers
          </button>
          <p className="text-xs text-rose-400 font-bold">Tracker not found or access denied.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        <TrackerDetailsView tracker={tracker} values={values} />
        <TrackerDrawer />
      </div>
    </MainLayout>
  );
}

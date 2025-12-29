"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import type { Agent, Team } from "@/types";

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgents() {
      try {
        setIsLoading(true);
        const data = await api.getAgents();
        setAgents(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch agents");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAgents();
  }, []);

  return { agents, isLoading, error, refetch: () => {} };
}

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeams() {
      try {
        setIsLoading(true);
        const data = await api.getTeams();
        setTeams(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch teams");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeams();
  }, []);

  return { teams, isLoading, error };
}

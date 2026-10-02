import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ProjectHeader from './components/ProjectHeader';
import BlockersAndRisks from './components/BlockersAndRisks';
import ReadinessDashboard from './components/ReadinessDashboard';
import StageTracker from './components/StageTracker';
import AIAnalysisModal from './components/AIAnalysisModal';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import ProjectNotes from './components/ProjectNotes';
import { api } from './api/client';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch all projects list on mount
  const loadProjectsList = useCallback(async (preferredId = null) => {
    try {
      setError(null);
      const list = await api.getProjects();
      setProjects(list || []);

      if (list && list.length > 0) {
        const targetId = preferredId || selectedProjectId || list[0].id;
        setSelectedProjectId(targetId);
      } else {
        setSelectedProjectId(null);
        setProjectDetails(null);
      }
    } catch (err) {
      setError('Could not connect to the backend server. Make sure Flask is running on port 5000.');
    } finally {
      setLoadingProjects(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    loadProjectsList();
  }, []);

  // 2. Fetch full project details whenever selectedProjectId changes
  const fetchProjectDetails = useCallback(async (projectId) => {
    if (!projectId) {
      setProjectDetails(null);
      return;
    }
    setLoadingDetails(true);
    try {
      const [details, analysis, docs] = await Promise.all([
        api.getProject(projectId),
        api.getLatestAnalysis(projectId),
        api.getDocuments(projectId),
      ]);
      setProjectDetails(details);
      setLatestAnalysis(analysis);
      setNotes(docs || []);
      if (details?.stages?.length > 0) {
        setSelectedStageId((prev) => {
          const exists = details.stages.some((s) => s.id === prev);
          return exists ? prev : details.stages[0].id;
        });
      }
    } catch (err) {
      setError(`Failed to load project details: ${err.message}`);
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectDetails(selectedProjectId);
  }, [selectedProjectId, fetchProjectDetails]);

  // 3. Handler to seed or load demo project
  const handleLoadDemo = async () => {
    setLoadingDemo(true);
    setError(null);
    try {
      const res = await api.seedDemoProject();
      const demoId = res.project?.id || 1;
      await loadProjectsList(demoId);
      setSelectedProjectId(demoId);
    } catch (err) {
      setError(`Failed to seed demo project: ${err.message}`);
    } finally {
      setLoadingDemo(false);
    }
  };

  // 4. Task management handlers
  const handleUpdateTask = async (taskId, updates) => {
    setError(null);
    try {
      await api.updateTask(taskId, updates);
      await fetchProjectDetails(selectedProjectId);
    } catch (err) {
      setError(`Failed to update task: ${err.message}`);
      throw err;
    }
  };

  const handleCreateTask = async (stageId, taskData) => {
    setError(null);
    try {
      await api.createTask(stageId, taskData);
      await fetchProjectDetails(selectedProjectId);
    } catch (err) {
      setError(`Failed to create task: ${err.message}`);
      throw err;
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError(null);
    try {
      await api.deleteTask(taskId);
      await fetchProjectDetails(selectedProjectId);
    } catch (err) {
      setError(`Failed to delete task: ${err.message}`);
      throw err;
    }
  };

  const handleSelectStage = (stageId) => {
    setSelectedStageId(stageId);
    const el = document.getElementById('stage-workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // 5. AI Risk Analysis handlers
  const handleRunAnalysis = async () => {
    if (!selectedProjectId) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await api.analyzeProjectRisks(selectedProjectId);
      setLatestAnalysis(res);
    } catch (err) {
      setAnalysisError(err.message || 'Failed to analyze project risks');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewLatestAnalysis = () => {
    setIsAnalysisModalOpen(true);
  };

  // 6. Project Notes handlers
  const handleCreateNote = async (noteData) => {
    if (!selectedProjectId) return;
    setLoadingNotes(true);
    try {
      await api.createDocument(selectedProjectId, noteData);
      const docs = await api.getDocuments(selectedProjectId);
      setNotes(docs || []);
    } catch (err) {
      setError(`Failed to save note: ${err.message}`);
      throw err;
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!selectedProjectId) return;
    setLoadingNotes(true);
    try {
      await api.deleteDocument(noteId);
      const docs = await api.getDocuments(selectedProjectId);
      setNotes(docs || []);
    } catch (err) {
      setError(`Failed to delete note: ${err.message}`);
      throw err;
    } finally {
      setLoadingNotes(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => setSelectedProjectId(id)}
        onLoadDemo={handleLoadDemo}
        loadingDemo={loadingDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-6 py-8 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center justify-between text-red-800 text-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadProjectsList(selectedProjectId)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white hover:bg-red-100 text-xs font-medium text-red-800 border border-red-200 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        {/* Loading Initial Projects */}
        {loadingProjects && (
          <div className="flex flex-col items-center justify-center min-h-[350px] text-zinc-500">
            <Loader2 className="w-6 h-6 animate-spin text-[#3B5BDB] mb-3" />
            <p className="text-sm font-medium">Connecting to server...</p>
          </div>
        )}

        {/* Empty State */}
        {!loadingProjects && projects.length === 0 && (
          <div className="bg-white border border-zinc-200 rounded-lg p-10 text-center max-w-lg mx-auto my-12 space-y-3">
            <h2 className="text-base font-semibold text-zinc-900">
              No projects found in database
            </h2>
            <p className="text-zinc-500 text-sm">
              Load the reference demo project to explore the 6-stage development lifecycle and risk analysis.
            </p>
            <div className="pt-2">
              <button
                onClick={handleLoadDemo}
                disabled={loadingDemo}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B5BDB] hover:bg-[#364fc7] text-white text-sm font-medium rounded-md shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loadingDemo ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : null}
                Load reference project (150 MW Solar + 60 MWh BESS)
              </button>
            </div>
          </div>
        )}

        {/* Active Project Dashboard View */}
        {!loadingProjects && projectDetails && (
          <div className="space-y-6">
            {/* 1. Project Metadata Header with Large Readiness & Top Executive Summary */}
            <ProjectHeader
              project={projectDetails}
              onAnalyzeRisks={handleRunAnalysis}
              onViewLatestAnalysis={handleViewLatestAnalysis}
              isAnalyzing={isAnalyzing}
              latestAnalysis={latestAnalysis}
            />

            {/* 2. Unified Blockers & Risks (shown once in a single clean table) */}
            <BlockersAndRisks
              blockers={projectDetails.blockers}
              stages={projectDetails.stages}
              analysis={latestAnalysis}
              onSelectStage={handleSelectStage}
            />

            {/* 3. Recommended Next Actions (clean supplementary list if available) */}
            <AIAnalysisPanel
              analysisData={latestAnalysis}
              loading={isAnalyzing}
              error={analysisError}
              onAnalyze={handleRunAnalysis}
            />

            {/* 4. Development Stages */}
            <ReadinessDashboard
              project={projectDetails}
              selectedStageId={selectedStageId}
              onSelectStage={handleSelectStage}
            />

            {/* 5. Stage Deliverables Workspace */}
            <StageTracker
              stages={projectDetails.stages}
              selectedStageId={selectedStageId}
              onSelectStage={handleSelectStage}
              onUpdateTask={handleUpdateTask}
              onCreateTask={handleCreateTask}
              onDeleteTask={handleDeleteTask}
            />

            {/* 6. Project Notes */}
            <ProjectNotes
              notes={notes}
              stages={projectDetails.stages}
              loading={loadingNotes}
              onCreateNote={handleCreateNote}
              onDeleteNote={handleDeleteNote}
            />
          </div>
        )}

        {/* Detailed Risk Analysis Modal (if opened via "View risk analysis") */}
        <AIAnalysisModal
          isOpen={isAnalysisModalOpen}
          onClose={() => setIsAnalysisModalOpen(false)}
          analysisData={latestAnalysis}
          loading={isAnalyzing}
          error={analysisError}
          onReanalyze={handleRunAnalysis}
          projectName={projectDetails?.name}
        />

        {/* Loading details overlay indicator */}
        {loadingDetails && (
          <div className="fixed bottom-5 right-5 bg-white border border-zinc-200 text-xs text-zinc-600 px-3 py-1.5 rounded-md shadow-sm flex items-center gap-2 z-50">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3B5BDB]" />
            <span>Updating...</span>
          </div>
        )}
      </main>
    </div>
  );
}

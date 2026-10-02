import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ProjectHeader from './components/ProjectHeader';
import BlockerBanner from './components/BlockerBanner';
import ReadinessDashboard from './components/ReadinessDashboard';
import StageTracker from './components/StageTracker';
import AIAnalysisModal from './components/AIAnalysisModal';
import { api } from './api/client';
import { Loader2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
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
        // Choose either preferredId, or currently selected if still valid, or first project
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
      const [details, analysis] = await Promise.all([
        api.getProject(projectId),
        api.getLatestAnalysis(projectId),
      ]);
      setProjectDetails(details);
      setLatestAnalysis(analysis);
      // Ensure selectedStageId remains valid
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

  // 3. Handler to seed or load the sales demo project
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

  // 4. Task management handlers with backend synchronization
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

  // Select stage and smooth scroll to workspace
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
    setIsAnalysisModalOpen(true);
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
    setAnalysisError(null);
    setIsAnalysisModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => setSelectedProjectId(id)}
        onLoadDemo={handleLoadDemo}
        loadingDemo={loadingDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="bg-rose-950/60 border border-rose-500/50 rounded-xl p-4 flex items-center justify-between text-rose-300 text-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadProjectsList(selectedProjectId)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-xs text-white border border-rose-700 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        {/* Loading Initial Projects */}
        {loadingProjects && (
          <div className="flex flex-col items-center justify-center min-h-[350px] text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
            <p className="text-sm font-medium">Connecting to Energy Readiness Backend...</p>
          </div>
        )}

        {/* Empty State (when 0 projects exist in database) */}
        {!loadingProjects && projects.length === 0 && (
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-12 text-center max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No Projects Found in Database
            </h2>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Get started instantly by loading the pre-configured Solaria Desert utility-scale solar and storage demo project.
            </p>
            <button
              onClick={handleLoadDemo}
              disabled={loadingDemo}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {loadingDemo ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Load Demo Project (150 MW Solar + 60 MWh BESS)
            </button>
          </div>
        )}

        {/* Active Project Dashboard View */}
        {!loadingProjects && projectDetails && (
          <div className="space-y-6">
            {/* 1. Project Metadata Header */}
            <ProjectHeader
              project={projectDetails}
              onAnalyzeRisks={handleRunAnalysis}
              onViewLatestAnalysis={handleViewLatestAnalysis}
              isAnalyzing={isAnalyzing}
              latestAnalysis={latestAnalysis}
            />

            {/* 2. Core Question: What is currently blocking this project? */}
            <BlockerBanner
              blockers={projectDetails.blockers}
              stages={projectDetails.stages}
            />

            {/* 3. Overall Readiness & 6-Stage Cards */}
            <ReadinessDashboard
              project={projectDetails}
              selectedStageId={selectedStageId}
              onSelectStage={handleSelectStage}
            />

            {/* 4. Interactive Stage & Task Workspace (Step 4B) */}
            <StageTracker
              stages={projectDetails.stages}
              selectedStageId={selectedStageId}
              onSelectStage={handleSelectStage}
              onUpdateTask={handleUpdateTask}
              onCreateTask={handleCreateTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        )}

        {/* 5. AI Risk Analysis Modal (Step 4C) */}
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
          <div className="fixed bottom-6 right-6 bg-slate-800/90 border border-slate-700 text-xs text-slate-300 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 backdrop-blur z-50">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Updating project data...</span>
          </div>
        )}
      </main>
    </div>
  );
}

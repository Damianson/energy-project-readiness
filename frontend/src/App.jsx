import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ProjectHeader from './components/ProjectHeader';
import BlockerBanner from './components/BlockerBanner';
import ReadinessDashboard from './components/ReadinessDashboard';
import StageTracker from './components/StageTracker';
import AIAnalysisModal from './components/AIAnalysisModal';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import ProjectNotes from './components/ProjectNotes';
import { api } from './api/client';
import { Loader2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

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
      const [details, analysis, docs] = await Promise.all([
        api.getProject(projectId),
        api.getLatestAnalysis(projectId),
        api.getDocuments(projectId),
      ]);
      setProjectDetails(details);
      setLatestAnalysis(analysis);
      setNotes(docs || []);
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
    const el = document.getElementById('gemini-analysis-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setIsAnalysisModalOpen(true);
    }
  };

  // 6. Project Notes handlers (Step 5)
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
    <div className="min-h-screen bg-[#0b0f17] text-[#e2e8f0] flex flex-col font-sans selection:bg-emerald-950 selection:text-emerald-300">
      {/* Top Navigation */}
      <Navbar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => setSelectedProjectId(id)}
        onLoadDemo={handleLoadDemo}
        loadingDemo={loadingDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Error Banner */}
        {error && (
          <div className="bg-[#1c1216] border border-rose-900/80 rounded p-3.5 flex items-center justify-between text-rose-300 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadProjectsList(selectedProjectId)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 text-xs font-mono text-white border border-rose-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              RETRY
            </button>
          </div>
        )}

        {/* Loading Initial Projects */}
        {loadingProjects && (
          <div className="flex flex-col items-center justify-center min-h-[350px] text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-400 mb-3" />
            <p className="text-xs font-mono font-medium tracking-wide">CONNECTING TO ENERGY CONTROLS BACKEND...</p>
          </div>
        )}

        {/* Empty State (when 0 projects exist in database) */}
        {!loadingProjects && projects.length === 0 && (
          <div className="bg-[#111622] border border-[#222d42] rounded-md p-10 text-center max-w-2xl mx-auto my-12 space-y-4">
            <div className="w-12 h-12 rounded bg-[#161f2e] border border-[#26354f] text-emerald-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider mb-1.5">
                No Projects Found In Database
              </h2>
              <p className="text-slate-400 text-xs max-w-md mx-auto">
                Initialize the platform with the standard reference project (Solaria Desert utility-scale PV + BESS).
              </p>
            </div>
            <button
              onClick={handleLoadDemo}
              disabled={loadingDemo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-bold text-white bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loadingDemo ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Load Reference Project (150 MW Solar + 60 MWh BESS)
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
              onSelectStage={handleSelectStage}
            />

            {/* 3. Gemini AI Risk Analysis On-Page Panel */}
            <div id="gemini-analysis-panel">
              <AIAnalysisPanel
                analysisData={latestAnalysis}
                loading={isAnalyzing}
                error={analysisError}
                onAnalyze={handleRunAnalysis}
                projectName={projectDetails?.name}
              />
            </div>

            {/* 4. Overall Readiness & 6-Stage Cards */}
            <ReadinessDashboard
              project={projectDetails}
              selectedStageId={selectedStageId}
              onSelectStage={handleSelectStage}
            />

            {/* 5. Interactive Stage & Task Workspace (Step 4B) */}
            <StageTracker
              stages={projectDetails.stages}
              selectedStageId={selectedStageId}
              onSelectStage={handleSelectStage}
              onUpdateTask={handleUpdateTask}
              onCreateTask={handleCreateTask}
              onDeleteTask={handleDeleteTask}
            />

            {/* 6. Project Notes & Qualitative Documents (Step 5) */}
            <ProjectNotes
              notes={notes}
              stages={projectDetails.stages}
              loading={loadingNotes}
              onCreateNote={handleCreateNote}
              onDeleteNote={handleDeleteNote}
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
          <div className="fixed bottom-5 right-5 bg-[#141b27]/95 border border-[#242f46] text-xs font-mono text-slate-300 px-3 py-1.5 rounded shadow-xl flex items-center gap-2 backdrop-blur z-50">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>SYNCING TELEMETRY...</span>
          </div>
        )}
      </main>
    </div>
  );
}

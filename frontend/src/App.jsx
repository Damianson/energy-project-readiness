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

  // 5. Risk Analysis handlers
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
    const el = document.getElementById('risk-assessment-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setIsAnalysisModalOpen(true);
    }
  };

  // 6. Project Notes handlers (Engineering Log)
  const handleCreateNote = async (noteData) => {
    if (!selectedProjectId) return;
    setLoadingNotes(true);
    try {
      await api.createDocument(selectedProjectId, noteData);
      const docs = await api.getDocuments(selectedProjectId);
      setNotes(docs || []);
    } catch (err) {
      setError(`Failed to save record: ${err.message}`);
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
      setError(`Failed to delete record: ${err.message}`);
      throw err;
    } finally {
      setLoadingNotes(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => setSelectedProjectId(id)}
        onLoadDemo={handleLoadDemo}
        loadingDemo={loadingDemo}
        onAnalyzeRisks={handleRunAnalysis}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3.5 flex items-center justify-between text-red-700 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadProjectsList(selectedProjectId)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 border border-gray-300 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-gray-500" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Initial Projects */}
        {loadingProjects && (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin text-forest-800 mb-2" />
            <p className="text-xs font-medium text-gray-600">Connecting to project controls backend...</p>
          </div>
        )}

        {/* Empty State (when 0 projects exist in database) */}
        {!loadingProjects && projects.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-8 text-center max-w-lg mx-auto my-12 space-y-3">
            <h2 className="text-base font-semibold text-gray-900">
              No Projects Found in Database
            </h2>
            <p className="text-gray-500 text-xs">
              Initialize the platform with the reference utility-scale project (Solaria Desert 150 MW Solar PV + 60 MWh BESS).
            </p>
            <button
              onClick={handleLoadDemo}
              disabled={loadingDemo}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded text-xs font-medium text-white bg-forest-800 hover:bg-forest-900 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loadingDemo ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : null}
              <span>Load Reference Project Data</span>
            </button>
          </div>
        )}

        {/* Active Project Workspace View */}
        {!loadingProjects && projectDetails && (
          <div className="space-y-5">
            {/* 1. Project Metadata Header & Top Operational Metrics Summary */}
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

            {/* 3. Project Risk Assessment Section */}
            <div id="risk-assessment-panel">
              <AIAnalysisPanel
                analysisData={latestAnalysis}
                loading={isAnalyzing}
                error={analysisError}
                onAnalyze={handleRunAnalysis}
                projectName={projectDetails?.name}
              />
            </div>

            {/* 4. Development Lifecycle Pipeline (Horizontal 6-Stage Stepper) */}
            <ReadinessDashboard
              project={projectDetails}
              selectedStageId={selectedStageId}
              onSelectStage={handleSelectStage}
            />

            {/* 5. Stage Workspace & Deliverable Table */}
            <StageTracker
              stages={projectDetails.stages}
              selectedStageId={selectedStageId}
              onSelectStage={handleSelectStage}
              onUpdateTask={handleUpdateTask}
              onCreateTask={handleCreateTask}
              onDeleteTask={handleDeleteTask}
            />

            {/* 6. Engineering Log & Project Records */}
            <ProjectNotes
              notes={notes}
              stages={projectDetails.stages}
              loading={loadingNotes}
              onCreateNote={handleCreateNote}
              onDeleteNote={handleDeleteNote}
            />
          </div>
        )}

        {/* Risk Assessment Modal Dialog */}
        <AIAnalysisModal
          isOpen={isAnalysisModalOpen}
          onClose={() => setIsAnalysisModalOpen(false)}
          analysisData={latestAnalysis}
          loading={isAnalyzing}
          error={analysisError}
          onReanalyze={handleRunAnalysis}
          projectName={projectDetails?.name}
        />

        {/* Subtle Syncing Indicator */}
        {loadingDetails && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-300 text-xs font-medium text-gray-700 px-3 py-1.5 rounded shadow-md flex items-center gap-2 z-50">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-forest-800" />
            <span>Syncing telemetry...</span>
          </div>
        )}
      </main>
    </div>
  );
}

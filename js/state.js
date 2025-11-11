// 전역 상태 관리

// 전역 변수
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
let recordingTimer = null;
let startTime = 0;
let totalRecordingTime = 0;
let currentAudioFile = null;
let selectedFiles = [];
let sessionHistory = [];
let projects = {};
let openTabs = new Map();
let activeTabId = 'welcome';
let tabCounter = 1;
let isModalMinimized = false;

// 파일 시스템 핸들
let rootDirHandle = null;
let selectedWorkspaceHandle = null;
let selectedSubjectHandle = null;
let selectedWorkspacePath = null;
let selectedSubjectPath = null;
let currentContextHandle = null;
let currentContextParentHandle = null;
let currentContextLevel = null;

// 파일 시스템 시뮬레이션
let fileSystem = {
    '/': {
        type: 'folder',
        name: '강의 요약 프로젝트',
        children: {
            'recordings': {
                type: 'folder',
                name: '녹음 파일',
                children: {}
            },
            'summaries': {
                type: 'folder',
                name: '요약 파일',
                children: {}
            }
        }
    }
};

// API 설정
const API_CONFIG = {
    baseURL: 'http://localhost:8000',
    endpoints: {
        transcribe: '/summary-jobs'
    },
    defaultHeaders: {},
    timeoutMs: 3_600_000,
    useMockMode: false
};

// 앱 초기화
function initializeApp() {
    checkMicrophonePermission();
    setupEventListeners();
    updateSummariesList();
}

// 탭 시스템 초기화
function initializeTabs() {
    openTabs.set('welcome', {
        id: 'welcome',
        title: '시작하기',
        type: 'welcome',
        icon: 'fas fa-home',
        closable: false
    });
    
    updateTabBar();
}

// 세션 히스토리 관리
function saveSessionHistory() {
    try {
        localStorage.setItem('vscode_lectureAI_history', JSON.stringify(sessionHistory));
    } catch (error) {
        console.error('히스토리 저장 실패:', error);
    }
}

function loadSessionHistory() {
    try {
        const saved = localStorage.getItem('vscode_lectureAI_history');
        if (saved) {
            sessionHistory = JSON.parse(saved);
            sessionHistory.forEach(summary => {
                addToFileSystem(summary);
            });
            updateSummariesList();
            updateRecentItems();
        }
    } catch (error) {
        console.error('히스토리 불러오기 실패:', error);
        sessionHistory = [];
    }
}

// 프로젝트 관리
function saveProjects() {
    try {
        localStorage.setItem('vscode_lectureAI_projects_v2', JSON.stringify(projects));
    } catch (e) {
        console.error('프로젝트 저장 실패', e);
    }
}

function loadProjects() {
    try {
        const saved = localStorage.getItem('vscode_lectureAI_projects_v2');
        projects = saved ? JSON.parse(saved) : {};
    } catch (e) {
        projects = {};
    }
}

// 히스토리에 추가
function addToHistory(summary) {
    sessionHistory.unshift(summary);
    
    if (sessionHistory.length > 20) {
        sessionHistory = sessionHistory.slice(0, 20);
    }
    
    saveSessionHistory();
    updateSummariesList();
    updateRecentItems();
}

// 파일 시스템에 추가
function addToFileSystem(summary) {
    const folderPath = summary.type === 'file' ? '/recordings' : '/summaries';
    const folder = fileSystem['/'].children[folderPath.substring(1)];
    
    folder.children[summary.fileName] = {
        type: 'file',
        name: summary.fileName,
        summary: summary,
        extension: summary.type === 'file' ? 'audio' : 'md'
    };
}

// 파일 시스템에서 제거
function removeFromFileSystem(summary) {
    const folders = fileSystem['/'].children;
    Object.values(folders).forEach(folder => {
        Object.keys(folder.children).forEach(name => {
            const file = folder.children[name];
            if (file && file.summary && file.summary.id === summary.id) {
                delete folder.children[name];
            }
        });
    });
}

// 요약 ID로 인덱스 찾기
function findSummaryIndexById(id) {
    return sessionHistory.findIndex(s => s.id === id);
}

// 프로젝트 할당 여부 확인
function isAssigned(summaryId) {
    return Object.values(projects).some(p => 
        Array.isArray(p.items) && p.items.includes(summaryId)
    );
}

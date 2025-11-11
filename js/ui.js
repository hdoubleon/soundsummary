// UI 관련 함수들

// 사이드바 관리
function setupSidebarTabs() {
    const sidebarTabs = document.querySelectorAll('.sidebar-tab');
    
    sidebarTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const panelId = this.dataset.panel;
            switchSidebarPanel(panelId);
        });
    });
}

function toggleSidebarMini() {
    const sidebar = document.querySelector('.sidebar');
    const btn = document.querySelector('.sidebar-toggle-btn');
    const icon = btn.querySelector('i');

    sidebar.classList.toggle('mini');

    if (sidebar.classList.contains('mini')) {
        icon.classList.remove('fa-chevron-left');
        icon.classList.add('fa-chevron-right');
    } else {
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-left');
    }
}

function switchSidebarPanel(panelId) {
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const targetTab = document.querySelector(`[data-panel="${panelId}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    document.querySelectorAll('.sidebar-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    const targetPanel = document.getElementById(`${panelId}-panel`);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
}

function getCurrentSidebarPanel() {
    const activeTab = document.querySelector('.sidebar-tab.active');
    return activeTab ? activeTab.dataset.panel : null;
}

// 탭 관리
function updateTabBar() {
    const tabBar = document.getElementById('tabBar');
    tabBar.innerHTML = '';
    
    openTabs.forEach((tab, tabId) => {
        const tabElement = document.createElement('div');
        tabElement.className = `tab ${tabId === activeTabId ? 'active' : ''}`;
        tabElement.dataset.tabId = tabId;
        
        tabElement.innerHTML = `
            <i class="${tab.icon} tab-icon"></i>
            <span class="tab-title">${tab.title}</span>
            ${tab.closable ? 
                `<i class="fas fa-times tab-close" onclick="closeTab('${tabId}', event)"></i>` : ''
            }
        `;
        
        tabElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('tab-close')) {
                switchToTab(tabId);
            }
        });
        
        tabBar.appendChild(tabElement);
    });
}

function switchToTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetContent = document.getElementById(`${tabId}-content`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    activeTabId = tabId;
    updateTabBar();
}

function closeTab(tabId, event) {
    if (event) event.stopPropagation();
    
    openTabs.delete(tabId);
    
    const tabContent = document.getElementById(`${tabId}-content`);
    if (tabContent) {
        tabContent.remove();
    }
    
    if (tabId === activeTabId) {
        const remainingTabs = Array.from(openTabs.keys());
        if (remainingTabs.length > 0) {
            switchToTab(remainingTabs[0]);
        }
    }
    
    updateTabBar();
}

function closeActiveTab() {
    const activeTab = openTabs.get(activeTabId);
    if (activeTab && activeTab.closable) {
        closeTab(activeTabId);
    }
}

// 요약 리스트 업데이트
function updateSummariesList() {
    const summariesList = document.getElementById('summariesList');

    if (sessionHistory.length === 0) {
        summariesList.innerHTML = '<p style="text-align: center; color: #8c8c8c; padding: 20px;">아직 요약 기록이 없습니다.</p>';
        return;
    }

    summariesList.innerHTML = '';

    sessionHistory.forEach(summary => {
        if (isAssigned(summary.id)) return;
        
        const summaryElement = document.createElement('div');
        summaryElement.className = 'summary-item';
        summaryElement.onclick = () => openSummaryFromHistory(summary);
        summaryElement.draggable = true;
        summaryElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/summaryId', String(summary.id));
        });

        summaryElement.innerHTML = `
            <h4 title="${summary.title}">${summary.title}</h4>
            <p>${summary.type === 'file' ? '파일 업로드' : '실시간 녹음'}</p>
            <div class="summary-date">${summary.timestamp}</div>
            <div class="summary-actions">
                <button class="icon-btn" title="이름 바꾸기" onclick="renameSummary(${summary.id}, event)">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="icon-btn" title="삭제" onclick="deleteSummary(${summary.id}, event)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        summariesList.appendChild(summaryElement);
    });
}

function updateRecentItems() {
    const recentItems = document.getElementById('recentItems');
    const recentSummaries = sessionHistory.slice(0, 3);
    
    if (recentSummaries.length === 0) {
        recentItems.innerHTML = '<p style="text-align: center; color: #8c8c8c;">최근 요약이 없습니다.</p>';
        return;
    }
    
    recentItems.innerHTML = '';
    
    recentSummaries.forEach(summary => {
        const itemElement = document.createElement('div');
        itemElement.className = 'recent-item';
        itemElement.onclick = () => openSummaryFromHistory(summary);
        
        itemElement.innerHTML = `
            <h4>${summary.title}</h4>
            <p>${summary.timestamp} | ${summary.type === 'file' ? '파일 업로드' : '실시간 녹음'}</p>
        `;
        
        recentItems.appendChild(itemElement);
    });
}

// 알림 표시
function showNotification(type, message) {
    console.log(`[${type === 'error' ? '오류' : '알림'}] ${message}`);
    
    if (type === 'error') {
        alert(`❌ ${message}`);
    } else {
        console.log(`✅ ${message}`);
    }
}

// 로딩 오버레이 제어
function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (show) {
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.classList.remove('active');
    }
}

// 버튼 상태 관리
function enableSummarizeButton() {
    const summarizeBtn = document.getElementById('summarizeBtn');
    if (summarizeBtn) summarizeBtn.disabled = false;
}

function disableSummarizeButton() {
    const summarizeBtn = document.getElementById('summarizeBtn');
    if (summarizeBtn) summarizeBtn.disabled = true;
}

function checkSummarizeButtonState() {
    const subjectInput = document.getElementById('subjectInput');
    const hasFiles = selectedFiles.length > 0 || currentAudioFile !== null;
    const hasWorkspace = selectedWorkspacePath !== null;
    const hasSubject = subjectInput && subjectInput.value.trim() !== '';
    
    if (hasFiles && hasWorkspace && hasSubject) {
        enableSummarizeButton();
    } else {
        disableSummarizeButton();
    }
}

// 오픈소스 정보 표시
function showOpenSourceInfo() {
    const tabId = 'opensource';
    
    if (openTabs.has(tabId)) {
        switchToTab(tabId);
        return;
    }
    
    openTabs.set(tabId, {
        id: tabId,
        title: '오픈소스 정보',
        type: 'opensource',
        icon: 'fas fa-code',
        closable: true
    });
    
    createOpenSourceTabContent(tabId);
    switchToTab(tabId);
    updateTabBar();
}

function createOpenSourceTabContent(tabId) {
    const tabContents = document.querySelector('.tab-contents');
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    tabContent.id = `${tabId}-content`;
    
    tabContent.innerHTML = `
        <div class="opensource-content">
            <h2>오픈소스 라이선스 정보</h2>
            
            <h3>프론트엔드</h3>
            <table class="opensource-table">
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>분류</th>
                        <th>라이선스</th>
                        <th>링크</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Font Awesome</strong></td>
                        <td>UI/UX 라이브러리</td>
                        <td>Font Awesome Free (Icons: CC BY 4.0, Code: MIT)</td>
                        <td><a href="https://fontawesome.com/" target="_blank">fontawesome.com</a></td>
                    </tr>
                    <tr>
                        <td>MediaRecorder API</td>
                        <td>오디오/비디오 녹화</td>
                        <td>표준 웹 API (무료)</td>
                        <td><a href="https://w3c.github.io/mediacapture-record/" target="_blank">W3C 스펙</a></td>
                    </tr>
                    <tr>
                        <td>Fetch API</td>
                        <td>네트워크</td>
                        <td>표준 웹 API (무료)</td>
                        <td><a href="https://fetch.spec.whatwg.org/" target="_blank">WHATWG 스펙</a></td>
                    </tr>
                </tbody>
            </table>
            
            <h3>백엔드</h3>
            <table class="opensource-table">
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>분류</th>
                        <th>라이선스</th>
                        <th>링크</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>FastAPI</strong></td>
                        <td>라이브러리</td>
                        <td>MIT</td>
                        <td><a href="https://fastapi.tiangolo.com/" target="_blank">fastapi.tiangolo.com</a></td>
                    </tr>
                    <tr>
                        <td><strong>SQLAlchemy</strong></td>
                        <td>라이브러리</td>
                        <td>MIT</td>
                        <td><a href="https://www.sqlalchemy.org/" target="_blank">sqlalchemy.org</a></td>
                    </tr>
                </tbody>
            </table>
            
            <h3>AI</h3>
            <table class="opensource-table">
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>분류</th>
                        <th>라이선스</th>
                        <th>링크</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>openai/whisper-large-v3</strong></td>
                        <td>STT 모델</td>
                        <td>Apache License 2.0</td>
                        <td><a href="https://huggingface.co/openai/whisper-large-v3" target="_blank">Hugging Face</a></td>
                    </tr>
                    <tr>
                        <td><strong>pyannote/speaker-diarization-3.1</strong></td>
                        <td>Diarization 모델</td>
                        <td>MIT License</td>
                        <td><a href="https://huggingface.co/pyannote/speaker-diarization-3.1" target="_blank">Hugging Face</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    tabContents.appendChild(tabContent);
}

// 요약 새로고침
function refreshSummaries() {
    updateSummariesList();
    showNotification('success', '요약 목록이 새로고침되었습니다.');
}

// 모든 요약 삭제
function clearAllSummaries() {
    if (confirm('모든 요약 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        sessionHistory = [];
        fileSystem['/'].children.recordings.children = {};
        fileSystem['/'].children.summaries.children = {};
        
        const summaryTabs = Array.from(openTabs.keys()).filter(id => id.startsWith('summary_'));
        summaryTabs.forEach(tabId => closeTab(tabId));
        
        updateSummariesList();
        updateRecentItems();
        saveSessionHistory();
        
        showNotification('success', '모든 요약 기록이 삭제되었습니다.');
    }
}

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSessionHistory();
    loadProjects();
    initializeTabs();
    setupSidebarTabs();
    setupSubjectInputListener();
    setupWorkspaceSelectListener();
    switchSidebarPanel('summaries');
    renderProjects();
});

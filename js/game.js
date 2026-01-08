// ==========================================
// 非遗寻踪 - 迷你游戏系统
// ==========================================

// 游戏状态
let currentGame = null;
let gameScore = 0;
let gameTime = 0;
let gameTimer = null;

// 非遗项目数据（用于游戏）
const heritageItems = [
    { id: 1, name: '剪纸', icon: '✂️', emoji: '🔴' },
    { id: 2, name: '青花瓷', icon: '🏺', emoji: '🏺' },
    { id: 3, name: '云锦', icon: '🧵', emoji: '🟡' },
    { id: 4, name: '花鼓戏', icon: '🎭', emoji: '🎭' },
    { id: 5, name: '唐卡', icon: '🖼️', emoji: '🟤' },
    { id: 6, name: '木雕', icon: '🪵', emoji: '🟠' }
];

// ==========================================
// 游戏启动函数
// ==========================================

function startMemoryGame() {
    showGameArea('记忆卡片游戏', 'memoryGame');
    initMemoryGame();
}

function startQuizGame() {
    showGameArea('知识问答', 'quizGame');
    initQuizGame();
}

function startPuzzleGame() {
    showGameArea('拼图挑战', 'puzzleGame');
    initPuzzleGame();
}

function showGameArea(title, gameId) {
    // 隐藏游戏选择区
    document.querySelector('.game-selection').style.display = 'none';
    document.querySelector('.leaderboard').style.display = 'none';
    
    // 显示游戏区域
    const gameArea = document.getElementById('gameArea');
    gameArea.style.display = 'block';
    
    // 隐藏所有游戏
    document.getElementById('memoryGame').style.display = 'none';
    document.getElementById('quizGame').style.display = 'none';
    document.getElementById('puzzleGame').style.display = 'none';
    
    // 显示当前游戏
    document.getElementById(gameId).style.display = 'block';
    document.getElementById('gameTitle').textContent = title;
    
    // 重置统计
    gameScore = 0;
    gameTime = 0;
    updateGameStats();
    
    // 开始计时
    startTimer();
    currentGame = gameId;
}

function backToSelection() {
    // 停止计时
    stopTimer();
    
    // 显示游戏选择区
    document.querySelector('.game-selection').style.display = 'block';
    document.querySelector('.leaderboard').style.display = 'block';
    
    // 隐藏游戏区域
    document.getElementById('gameArea').style.display = 'none';
    
    currentGame = null;
}

// ==========================================
// 计时器
// ==========================================

function startTimer() {
    gameTimer = setInterval(() => {
        gameTime++;
        updateGameStats();
    }, 1000);
}

function stopTimer() {
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

function updateGameStats() {
    document.getElementById('gameScore').textContent = `得分: ${gameScore}`;
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    document.getElementById('gameTime').textContent = 
        `时间: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ==========================================
// 游戏1: 记忆卡片
// ==========================================

let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let flips = 0;

function initMemoryGame() {
    matchedPairs = 0;
    flips = 0;
    flippedCards = [];
    
    // 创建卡片对（每个非遗项目2张）
    memoryCards = [];
    heritageItems.forEach(item => {
        memoryCards.push({ ...item, cardId: `${item.id}-1` });
        memoryCards.push({ ...item, cardId: `${item.id}-2` });
    });
    
    // 打乱卡片
    memoryCards = shuffleArray(memoryCards);
    
    // 渲染卡片
    const board = document.getElementById('memoryBoard');
    board.innerHTML = '';
    
    memoryCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.cardIndex = index;
        cardElement.innerHTML = `
            <div class="card-front">?</div>
            <div class="card-back">${card.emoji}</div>
        `;
        cardElement.addEventListener('click', () => flipCard(index));
        board.appendChild(cardElement);
    });
    
    updateMemoryStats();
}

function flipCard(index) {
    const card = document.querySelectorAll('.memory-card')[index];
    
    // 如果已经翻开或已匹配，不做处理
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // 如果已经翻开2张，不做处理
    if (flippedCards.length >= 2) {
        return;
    }
    
    // 翻开卡片
    card.classList.add('flipped');
    flippedCards.push({ index, card: memoryCards[index] });
    flips++;
    updateMemoryStats();
    
    // 如果翻开了2张，检查是否匹配
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const elements = document.querySelectorAll('.memory-card');
    
    if (card1.card.id === card2.card.id) {
        // 匹配成功
        elements[card1.index].classList.add('matched');
        elements[card2.index].classList.add('matched');
        matchedPairs++;
        gameScore += 100;
        updateGameStats();
        updateMemoryStats();
        
        // 检查是否完成
        if (matchedPairs === heritageItems.length) {
            setTimeout(() => {
                stopTimer();
                alert(`恭喜完成！\n翻开次数: ${flips}\n用时: ${gameTime}秒\n得分: ${gameScore}`);
            }, 500);
        }
    } else {
        // 不匹配，翻回去
        elements[card1.index].classList.remove('flipped');
        elements[card2.index].classList.remove('flipped');
    }
    
    flippedCards = [];
}

function updateMemoryStats() {
    document.getElementById('flips').textContent = flips;
    document.getElementById('matches').textContent = `${matchedPairs}/${heritageItems.length}`;
}

// ==========================================
// 游戏2: 知识问答
// ==========================================

const quizQuestions = [
    {
        question: '剪纸艺术起源于哪个朝代？',
        options: ['唐朝', '东汉', '宋朝', '明朝'],
        correct: 1
    },
    {
        question: '景德镇青花瓷使用的主要原料是什么？',
        options: ['氧化铁', '氧化钴', '氧化铜', '氧化锰'],
        correct: 1
    },
    {
        question: '南京云锦被列为中国四大名锦之首，其色泽光丽灿烂，美如天上云霞，因此得名。云锦的配色多达多少种？',
        options: ['十种', '十五种', '十八种', '二十种'],
        correct: 2
    },
    {
        question: '花鼓戏是哪个省份的地方戏剧？',
        options: ['湖北', '湖南', '江西', '安徽'],
        correct: 1
    },
    {
        question: '藏族唐卡主要涉及哪些内容？',
        options: ['仅宗教', '仅历史', '仅艺术', '历史、政治、文化等多方面'],
        correct: 3
    },
    {
        question: '木雕在工种分类中被称为什么？',
        options: ['粗木工', '精细木工', '装饰木工', '建筑木工'],
        correct: 1
    },
    {
        question: '剪纸艺术通过什么工具在纸上剪刻花纹？',
        options: ['刀和笔', '剪刀或刻刀', '针和线', '印章'],
        correct: 1
    },
    {
        question: '青花瓷的"青花"是指什么颜色？',
        options: ['绿色', '青色', '蓝色', '黑色'],
        correct: 2
    },
    {
        question: '南京云锦有什么美称？',
        options: ['寸锦寸银', '寸锦寸金', '寸锦寸玉', '寸锦寸珠'],
        correct: 1
    },
    {
        question: '木雕可以分为哪三大类？',
        options: ['圆雕、浮雕、透雕', '立体圆雕、根雕、浮雕', '人物、动物、植物', '宫廷、民间、宗教'],
        correct: 1
    }
];

let currentQuestion = 0;
let correctAnswers = 0;

function initQuizGame() {
    currentQuestion = 0;
    correctAnswers = 0;
    gameScore = 0;
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        showQuizResult();
        return;
    }
    
    const q = quizQuestions[currentQuestion];
    document.getElementById('questionNumber').textContent = `问题 ${currentQuestion + 1}/${quizQuestions.length}`;
    document.getElementById('questionText').textContent = q.question;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(btn);
    });
    
    // 更新进度条
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    document.getElementById('quizProgress').style.width = progress + '%';
}

function selectAnswer(selectedIndex) {
    const q = quizQuestions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    
    // 禁用所有按钮
    buttons.forEach(btn => btn.disabled = true);
    
    // 显示正确/错误
    buttons[selectedIndex].classList.add(selectedIndex === q.correct ? 'correct' : 'wrong');
    if (selectedIndex !== q.correct) {
        buttons[q.correct].classList.add('correct');
    }
    
    // 计分
    if (selectedIndex === q.correct) {
        correctAnswers++;
        gameScore += 100;
        updateGameStats();
    }
    
    // 下一题
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1500);
}

function showQuizResult() {
    document.querySelector('.question-card').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';
    
    const accuracy = Math.round((correctAnswers / quizQuestions.length) * 100);
    document.getElementById('accuracy').textContent = accuracy + '%';
    document.getElementById('finalScore').textContent = gameScore;
    
    stopTimer();
}

function restartQuiz() {
    document.querySelector('.question-card').style.display = 'block';
    document.getElementById('quizResult').style.display = 'none';
    initQuizGame();
    startTimer();
}

// ==========================================
// 游戏3: 拼图挑战
// ==========================================

let puzzleState = [];
let emptyIndex = 8; // 空白块的位置
let moves = 0;

function initPuzzleGame() {
    moves = 0;
    
    // 设置预览图
    const preview = document.getElementById('puzzlePreview');
    preview.src = 'images/jianzhi.jpg';
    
    // 初始化拼图状态（0-8，8是空白）
    puzzleState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    emptyIndex = 8;
    
    // 打乱（执行随机移动）
    for (let i = 0; i < 100; i++) {
        const validMoves = getValidMoves();
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        swapPieces(emptyIndex, randomMove);
    }
    
    renderPuzzle();
    updatePuzzleStats();
}

function renderPuzzle() {
    const board = document.getElementById('puzzleBoard');
    board.innerHTML = '';
    
    puzzleState.forEach((piece, index) => {
        const div = document.createElement('div');
        div.className = 'puzzle-piece';
        
        if (piece === 8) {
            div.classList.add('empty');
        } else {
            // 计算背景位置
            const row = Math.floor(piece / 3);
            const col = piece % 3;
            div.style.backgroundImage = 'url(images/jianzhi.jpg)';
            div.style.backgroundPosition = `-${col * 100}% -${row * 100}%`;
            div.addEventListener('click', () => movePiece(index));
        }
        
        board.appendChild(div);
    });
}

function getValidMoves() {
    const valid = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;
    
    // 上
    if (row > 0) valid.push(emptyIndex - 3);
    // 下
    if (row < 2) valid.push(emptyIndex + 3);
    // 左
    if (col > 0) valid.push(emptyIndex - 1);
    // 右
    if (col < 2) valid.push(emptyIndex + 1);
    
    return valid;
}

function movePiece(index) {
    const validMoves = getValidMoves();
    
    if (validMoves.includes(index)) {
        swapPieces(emptyIndex, index);
        moves++;
        gameScore = Math.max(0, 1000 - moves * 10);
        updateGameStats();
        updatePuzzleStats();
        renderPuzzle();
        
        // 检查是否完成
        if (isPuzzleSolved()) {
            setTimeout(() => {
                stopTimer();
                alert(`恭喜完成拼图！\n移动次数: ${moves}\n用时: ${gameTime}秒\n得分: ${gameScore}`);
            }, 500);
        }
    }
}

function swapPieces(index1, index2) {
    [puzzleState[index1], puzzleState[index2]] = [puzzleState[index2], puzzleState[index1]];
    emptyIndex = index2;
}

function isPuzzleSolved() {
    for (let i = 0; i < 9; i++) {
        if (puzzleState[i] !== i) return false;
    }
    return true;
}

function updatePuzzleStats() {
    document.getElementById('moves').textContent = moves;
}

function showHint() {
    alert('提示：尝试先将角块和边块归位，最后处理中心块。\n空白块应该在右下角。');
}

// ==========================================
// 排行榜
// ==========================================

function showLeaderboard(gameType) {
    // 更新标签状态
    const tabs = document.querySelectorAll('.leaderboard-tabs .tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // 这里可以根据gameType加载不同的排行榜数据
    // 目前使用示例数据
    console.log('显示', gameType, '的排行榜');
}

// ==========================================
// 工具函数
// ==========================================

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// ==========================================
// 页面加载
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('非遗寻踪 - 迷你游戏系统已加载');
});

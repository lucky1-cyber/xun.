// ==========================================
// 非遗寻踪 - JavaScript交互功能
// 技术1: 地图标记点交互系统
// 技术2: 动态内容切换与动画效果
// ==========================================

// ============ 技术1: 地图标记点交互系统 ============
// 功能说明: 实现地图标记点的点击交互,动态显示非遗项目详情

// 非遗项目数据库（✅ 已修改：支持真实图片）
const heritageData = {
    '剪纸': {
        name: '剪纸艺术',
        category: '传统技艺',
        level: '国家级',
        location: '东北地区',
        image: 'images/jianzhi.jpg',  // ✅ 改为图片路径
        description: '剪纸是中国最古老的民间艺术之一,起源于东汉时期。通过剪刀或刻刀在纸上剪刻花纹,用于装点生活或配合其他民俗活动。剪纸艺术以其独特的视觉形象和造型格式,蕴涵了丰富的文化历史信息。',
        process: '选纸 → 构图设计 → 折叠 → 剪刻 → 展开 → 装裱',
        tasks: ['了解剪纸历史', '学习基本剪法', '完成简单作品']
    },
    '青花瓷': {
        name: '景德镇青花瓷',
        category: '传统技艺',
        level: '国家级',
        location: '江西景德镇',
        image: 'images/qinghuaci.jpg',  // ✅ 改为图片路径
        description: '青花瓷是中国瓷器的主流品种之一,属釉下彩瓷。青花瓷使用含氧化钴的钴矿为原料,在陶瓷坯体上描绘纹饰,再罩上一层透明釉,经高温一次烧成。钴料烧成后呈蓝色,具有着色力强、发色鲜艳、烧成率高、呈色稳定的特点。',
        process: '选泥 → 拉坯 → 修坯 → 绘画 → 施釉 → 烧制',
        tasks: ['了解青花瓷历史', '虚拟拉坯体验', '欣赏精品瓷器']
    },
    '云锦': {
        name: '南京云锦',
        category: '传统技艺',
        level: '国家级',
        location: '江苏南京',
        image: 'images/yunjin.jpg',  // ✅ 改为图片路径
        description: '南京云锦是中国传统的丝制工艺品,有"寸锦寸金"之称,被列为中国四大名锦之首。云锦因其色泽光丽灿烂,美如天上云霞而得名。南京云锦配色多达十八种,运用"色晕"层层推出主花,富丽典雅、质地坚实。',
        process: '设计图案 → 挑花结本 → 造机 → 织造 → 整理',
        tasks: ['了解云锦工艺', '学习配色技巧', '体验织造过程']
    },
    '花鼓戏': {
        name: '花鼓戏',
        category: '传统戏剧',
        level: '国家级',
        location: '湖南',
        image: 'images/huaguxe.jpg',  // ✅ 改为图片路径
        description: '花鼓戏是湖南各地花鼓戏剧种的总称,因其表演时以锣鼓伴奏而得名。花鼓戏源于民歌,逐渐发展成为一旦一丑演唱的花鼓戏初级形式。角色行当发展为小生、小旦、小丑的"三小"戏,表演富有浓郁的生活气息和地方特色。',
        process: '基本功训练 → 唱腔学习 → 身段练习 → 剧目排练',
        tasks: ['学习基本唱腔', '了解角色行当', '观看经典剧目']
    },
    '唐卡': {
        name: '藏族唐卡',
        category: '传统美术',
        level: '国家级',
        location: '西藏',
        image: 'images/tangka.jpg',  // ✅ 改为图片路径
        description: '唐卡是藏族文化中一种独具特色的绘画艺术形式,具有鲜明的民族特点、浓郁的宗教色彩和独特的艺术风格。唐卡内容涉及藏族历史、政治、文化和社会生活等诸多领域,堪称藏族的百科全书。',
        process: '备料 → 绷布 → 打磨 → 构图 → 着色 → 开眼 → 装裱',
        tasks: ['了解唐卡分类', '学习绘画技法', '欣赏精品唐卡']
    },
    '木雕': {
        name: '木雕工艺',
        category: '传统技艺',
        level: '国家级',
        location: '华北地区',
        image: 'images/mudiao.jpg',  // ✅ 改为图片路径
        description: '木雕是雕塑的一种,在我们国家常常被称为"民间工艺"。木雕可以分为立体圆雕、根雕、浮雕三大类。木雕是从木工中分离出来的一个工种,在我们国家的工种分类中为"精细木工"。',
        process: '选材 → 设计 → 粗坯 → 修光 → 打磨 → 上色/上蜡',
        tasks: ['了解木材特性', '学习雕刻技法', '完成简单作品']
    }
};

// 当前选中的非遗项目
let currentHeritage = null;

// 初始化地图标记点交互
function initMapMarkers() {
    const markers = document.querySelectorAll('.marker');
    const heritageDetail = document.querySelector('.heritage-detail');
    const welcomePanel = document.querySelector('.welcome-panel');
    
    if (!markers.length) return;

    markers.forEach(marker => {
        marker.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemName = this.getAttribute('data-item');
            
            // 移除其他标记的选中状态
            markers.forEach(m => m.classList.remove('active'));
            
            // 添加当前标记的选中状态
            this.classList.add('active');
            
            // 显示对应的非遗项目详情
            showHeritageDetail(itemName);
            
            // 添加点击动画效果
            this.style.transform = 'translate(-50%, -50%) scale(1.3)';
            setTimeout(() => {
                this.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 300);
        });

        // 添加悬停音效提示(可选)
        marker.addEventListener('mouseenter', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1.15)';
        });

        marker.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
    });
}

// 显示非遗项目详情（✅ 已修改：支持显示真实图片）
function showHeritageDetail(itemName) {
    const data = heritageData[itemName];
    if (!data) return;

    currentHeritage = itemName;
    
    const welcomePanel = document.querySelector('.welcome-panel');
    const heritageDetail = document.querySelector('.heritage-detail');
    
    // 隐藏欢迎面板
    if (welcomePanel) {
        welcomePanel.style.display = 'none';
    }
    
    // 更新详情内容
    if (heritageDetail) {
        heritageDetail.style.display = 'block';
        
        // 更新内容
        const imagePlaceholder = heritageDetail.querySelector('.image-placeholder');
        const heritageName = heritageDetail.querySelector('.heritage-name');
        const heritageTags = heritageDetail.querySelector('.heritage-tags');
        const heritageDesc = heritageDetail.querySelector('.heritage-desc p');
        const taskItems = heritageDetail.querySelectorAll('.task-item label');
        
        // ✅ 修改：支持显示真实图片
        if (imagePlaceholder) {
            // 判断是图片路径还是emoji
            if (data.image.includes('/') || data.image.includes('.')) {
                // 是图片路径 - 显示真实图片
                imagePlaceholder.innerHTML = `
                    <img src="${data.image}" 
                         alt="${data.name}" 
                         onerror="this.onerror=null; this.parentElement.innerHTML='<div style=\\'font-size:18px;color:#8b6f47;text-align:center;\\'>📷<br>图片加载失败<br><small>${data.image}</small></div>';"
                         style="width: 100%; 
                                height: 100%; 
                                object-fit: cover; 
                                border-radius: 8px;
                                transition: transform 0.3s ease;
                                cursor: pointer;">
                `;
                
                // 添加图片加载成功的事件
                const img = imagePlaceholder.querySelector('img');
                if (img) {
                    img.onload = function() {
                        console.log('✅ 图片加载成功:', data.image);
                    };
                }
            } else {
                // 是emoji - 显示emoji图标
                imagePlaceholder.innerHTML = `
                    <div style="font-size: 80px; margin: 40px 0;">${data.image}</div>
                `;
            }
        }
        
        if (heritageName) {
            heritageName.textContent = data.name;
        }
        
        if (heritageTags) {
            heritageTags.innerHTML = `
                <span class="tag">${data.category}</span>
                <span class="tag">${data.level}</span>
                <span class="tag">${data.location}</span>
            `;
        }
        
        if (heritageDesc) {
            heritageDesc.innerHTML = `
                <strong>项目介绍：</strong><br>
                ${data.description}
                <br><br>
                <strong>制作流程：</strong><br>
                ${data.process}
            `;
        }
        
        // 更新任务列表
        if (taskItems.length >= 3) {
            data.tasks.forEach((task, index) => {
                if (taskItems[index]) {
                    taskItems[index].textContent = task;
                    // 重置复选框状态
                    const checkbox = taskItems[index].previousElementSibling;
                    if (checkbox) {
                        checkbox.checked = false;
                    }
                    taskItems[index].style.textDecoration = 'none';
                    taskItems[index].style.color = '#5d4422';
                }
            });
        }
        
        // 添加淡入动画
        heritageDetail.style.opacity = '0';
        heritageDetail.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heritageDetail.style.transition = 'all 0.5s ease';
            heritageDetail.style.opacity = '1';
            heritageDetail.style.transform = 'translateY(0)';
        }, 10);
    }
}

// ============ 技术2: 动态内容切换与动画效果 ============
// 功能说明: 实现Tab切换、平滑滚动、按钮动画等交互效果

// 初始化Tab切换功能
function initTabSwitch() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    if (!tabBtns.length) return;
    
    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            // 移除所有active类
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // 添加当前按钮的active类
            this.classList.add('active');
            
            // 根据tab显示不同内容
            handleTabContent(index);
            
            // 添加点击动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// 处理Tab内容切换
function handleTabContent(tabIndex) {
    const heritageDetail = document.querySelector('.heritage-detail');
    if (!heritageDetail || heritageDetail.style.display === 'none') return;
    
    const contentBody = document.querySelector('.content-body');
    
    switch(tabIndex) {
        case 0: // 知识卡片
            // 当前已经显示详情内容
            break;
        case 1: // 制作过程
            showProcessAnimation();
            break;
        case 2: // 互动任务
            highlightTasks();
            break;
    }
}

// 显示制作过程动画
function showProcessAnimation() {
    if (!currentHeritage) return;
    
    const data = heritageData[currentHeritage];
    const heritageDesc = document.querySelector('.heritage-desc p');
    
    if (heritageDesc && data) {
        heritageDesc.innerHTML = `
            <strong>📝 ${data.name}制作流程：</strong><br><br>
            <div class="process-steps" style="font-size: 18px; line-height: 2.5;">
                ${data.process.split('→').map((step, index) => 
                    `<div class="process-step" style="animation: slideIn 0.5s ease forwards; animation-delay: ${index * 0.2}s; opacity: 0;">
                        <span style="color: #d4a574; font-weight: bold;">步骤${index + 1}:</span> ${step.trim()}
                    </div>`
                ).join('')}
            </div>
        `;
    }
}

// 高亮任务项
function highlightTasks() {
    const taskPanel = document.querySelector('.task-panel');
    if (taskPanel) {
        taskPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        taskPanel.style.animation = 'pulse 1s ease';
        setTimeout(() => {
            taskPanel.style.animation = '';
        }, 1000);
    }
}

// 初始化按钮悬停效果
function initButtonEffects() {
    const buttons = document.querySelectorAll('.main-btn, .control-btn, .action-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        btn.addEventListener('click', function() {
            this.style.transform = 'translateY(0) scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            }, 150);
        });
    });
}

// 初始化平滑滚动
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 只对页面内锚点进行平滑滚动
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// 任务复选框交互
function initTaskCheckboxes() {
    const checkboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.textDecoration = 'line-through';
                label.style.color = '#999';
                showCompletionMessage();
            } else {
                label.style.textDecoration = 'none';
                label.style.color = '#5d4422';
            }
        });
    });
}

// 显示完成提示
function showCompletionMessage() {
    const checkboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    if (checkedCount === checkboxes.length) {
        showModal('🎉 恭喜完成所有任务！', '你已经完成了所有的非遗体验任务，获得了"非遗守护者"成就徽章！');
    }
}

// 模态框功能
function showModal(title, message) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <h3>${title}</h3>
            <p>${message}</p>
            <button class="modal-close-btn">确定</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加关闭事件
    const closeBtn = modal.querySelector('.modal-close-btn');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    });
    
    overlay.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    });
    
    // 显示动画
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// 导航模式和漫游模式切换
function initModeSwitch() {
    const controlBtns = document.querySelectorAll('.map-controls .control-btn');
    
    controlBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            controlBtns.forEach(b => b.classList.remove('mode-active'));
            this.classList.add('mode-active');
            
            const mode = index === 0 ? '导航模式' : '漫游模式';
            showNotification(`已切换到${mode}`);
        });
    });
}

// 通知提示
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: linear-gradient(135deg, #d4a574, #8b6f47);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s;
        opacity: 1;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 页面加载动画
function initPageLoadAnimation() {
    const heroSection = document.querySelector('.hero-section');
    const modeCards = document.querySelectorAll('.mode-card');
    
    if (heroSection) {
        heroSection.style.opacity = '0';
        heroSection.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroSection.style.transition = 'all 1s ease';
            heroSection.style.opacity = '1';
            heroSection.style.transform = 'translateY(0)';
        }, 100);
    }
    
    modeCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 500 + index * 200);
    });
}

// ============ 主初始化函数 ============
document.addEventListener('DOMContentLoaded', function() {
    console.log('非遗寻踪 - JavaScript交互系统已加载');
    console.log('✅ 支持真实图片显示');
    
    // 初始化技术1: 地图标记点交互系统
    initMapMarkers();
    
    // 初始化技术2: 动态内容切换与动画效果
    initTabSwitch();
    initButtonEffects();
    initSmoothScroll();
    initTaskCheckboxes();
    initModeSwitch();
    initPageLoadAnimation();
    
    console.log('所有交互功能已初始化完成');
});

// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
    /* 标记点选中状态 */
    .marker.active {
        z-index: 100;
        animation: markerPulse 2s infinite;
    }
    
    @keyframes markerPulse {
        0%, 100% { filter: drop-shadow(0 0 8px rgba(212, 165, 116, 0.8)); }
        50% { filter: drop-shadow(0 0 20px rgba(212, 165, 116, 1)); }
    }
    
    /* 滑入动画 */
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    /* 脉冲动画 */
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    /* 右侧滑入动画 */
    @keyframes slideInRight {
        from {
            transform: translateX(100px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    /* 淡出动画 */
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    /* 模态框样式 */
    .custom-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        position: relative;
        background: linear-gradient(135deg, #fff, #f9f5f0);
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        text-align: center;
        animation: modalSlideIn 0.4s ease;
    }
    
    @keyframes modalSlideIn {
        from {
            transform: translateY(-50px) scale(0.9);
            opacity: 0;
        }
        to {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
    }
    
    .modal-content h3 {
        font-size: 28px;
        color: #5d4422;
        margin-bottom: 20px;
    }
    
    .modal-content p {
        font-size: 16px;
        color: #8b6f47;
        line-height: 1.8;
        margin-bottom: 30px;
    }
    
    .modal-close-btn {
        padding: 12px 40px;
        background: linear-gradient(135deg, #d4a574, #8b6f47);
        color: white;
        border: none;
        border-radius: 25px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .modal-close-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    /* 模式切换按钮激活状态 */
    .control-btn.mode-active {
        background: linear-gradient(135deg, #4caf50, #388e3c);
        box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4);
    }
    
    /* 通知样式动画 */
    .notification {
        font-weight: 500;
    }
    
    /* ✅ 新增：图片悬停效果 */
    .image-placeholder img:hover {
        transform: scale(1.05);
    }
    
    /* ✅ 新增：图片加载动画 */
    @keyframes imageFadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .image-placeholder img {
        animation: imageFadeIn 0.5s ease;
    }
`;
document.head.appendChild(style);
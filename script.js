// 字段映射（数据库字段 → 前端显示名称 + 自然语言关键词扩展）
const FIELD_MAPPING = {
    "植物名": "植物名",
    "拉丁名": ["拉丁名", "拉丁名称"],
    "类": "类",
    "形态": ["形态", "形态特征"],
    "科": ["科", "科属"],
    "分布": ["分布", "产地", "生长区域", "分布范围"],
    // 民族名称扩展关键词
    "药物名（羌）": ["羌族名称", "羌名", "羌族叫什么", "羌医名称", "羌医叫什么"],
    "药物名（彝）": ["彝族名称", "彝名", "彝族叫什么", "彝医名称", "彝医叫什么"],
    "药物名（藏）": ["藏族名称", "藏名", "藏族叫什么", "藏医名称", "藏医叫什么"], 
    // 功效扩展关键词
    "功能主治": ["功效", "作用", "功能主治", "用途", "疗效", "羌族功效", "羌医功效"],
    "功能主治.1": ["彝族功效", "彝族作用", "彝族功能主治", "彝医功效", "彝医作用","彝族疗效","彝族用途","藏医疗效","彝医用途","彝医功能主治"],
    "功能主治.2":  ["藏族功效", "藏族作用", "藏族功能主治", "藏医功效", "藏医作用","藏族疗效","藏族用途","藏医疗效","藏医用途","藏医功能主治"],
    // 海拔相关关键词
    "海拔（最低）": ["最低海拔", "海拔下限"],
    "海拔（最高）": ["最高海拔", "海拔上限"],
    "海拔": ["海拔", "生长海拔", "海拔范围", "生长的海拔"]
};

// 症状-民族映射（用于精准匹配“XX民族如何治疗XX症状”）
const SYMPTOM_ETHNIC_MAPPING = {
    "藏族": "功能主治.2",
    "藏医": "功能主治.2",
    "羌族": "功能主治",
    "羌医": "功能主治",
    "彝族": "功能主治.1",
    "彝医": "功能主治.1"
};

// 症状同义词映射（扩展自然语言交互场景）
const SYMPTOM_SYNONYMS = {
    "头晕": ["头晕", "头昏", "眩晕", "头眩", "头重脚轻", "眩晕症", "头昏沉"],
    "感冒": ["感冒", "伤风", "着凉", "流感", "时疫感冒", "风寒感冒", "风热感冒", "外感风寒", "感冒发热", "疫疠感冒"],
    "发烧": ["发烧", "发热", "高热", "低热", "寒热往来", "午后潮热", "骨蒸劳热", "瘟病发热", "热病发烧"],
    "胃痛": ["胃痛", "胃脘痛", "胃病", "胃寒痛", "胃热痛", "胃脘胀痛", "心口痛", "胃痞痛", "食积胃痛"],
    "咳嗽": ["咳嗽", "咳喘", "干咳", "痰咳", "肺热咳嗽", "肺寒咳嗽", "久咳", "咳嗽带血", "百日咳", "顿咳"],
    "消炎": ["消炎", "抗炎", "消肿", "清热解毒", "疮疡肿毒", "痈肿", "疔疮", "热毒", "疮疖"],
    "止痛": ["止痛", "镇痛", "疼痛", "剧痛", "隐痛", "酸痛", "刺痛", "神经痛", "痹痛", "跌打痛"],
    "关节炎": ["关节炎", "关节痛", "关节肿胀", "风湿痹痛", "风寒湿痹", "筋骨疼痛", "痹症", "关节积黄水"],
    "腹泻": ["腹泻", "泄泻", "痢疾", "水泻", "溏泻", "久泻", "湿热泻痢", "寒泻", "食积腹泻"],
    "便秘": ["便秘", "大便秘结", "肠燥便秘", "习惯性便秘", "产后便秘"],
    "黄疸": ["黄疸", "身目发黄", "肝胆湿热", "湿热黄疸", "阳黄", "阴黄"],
    "头痛": ["头痛", "头风痛", "偏头痛", "巅顶痛", "风热头痛", "风寒头痛", "肝热头痛", "头胀", "头刺痛"],
    "水肿": ["水肿", "浮肿", "腹水", "四肢肿胀", "肾性水肿", "心性水肿", "黄水病", "水臌"],
    "跌打损伤": ["跌打损伤", "跌打瘀痛", "扭伤", "挫伤", "骨折", "跌打肿痛", "瘀血作痛"],
    "皮肤病": ["皮肤病", "湿疹", "癣", "疥癣", "疮疡", "皮肤瘙痒", "黄水疮", "麻风病", "风疹"],
    "惊风": ["惊风", "小儿惊风", "急惊风", "慢惊风", "惊厥", "抽搐", "痉挛"],
    "月经不调": ["月经不调", "经闭", "痛经", "经血过多", "崩漏", "带下", "产后恶露"],
    "肺炎": ["肺炎", "肺热", "肺部疾病", "肺痈", "咳喘", "痰热壅肺", "肺脓疡"],
    "肝炎": ["肝炎", "肝热", "肝胆湿热", "黄疸型肝炎", "肝中毒", "肝病"],
    "腰痛": ["腰痛", "腰痹", "腰腿痛", "腰间盘突出", "腰肌劳损", "腰寒痛", "腰酸痛"],
    "关节痛": ["关节痛", "痹症", "风湿痛", "关节肿胀", "关节积液", "骨痛", "筋骨痛"],
    "腰酸背痛": ["腰酸背痛", "腰背酸痛", "腰背痛", "腰酸疼", "腰背疼"]
};

// 全局变量存储药材数据
let herbsData = [];

// 页面初始化
document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const queryInput = document.getElementById("queryInput");
    const resultContainer = document.getElementById("resultContainer");

    // 加载数据
    loadHerbsData();

    // 绑定查询事件
    searchBtn.addEventListener("click", () => handleQuery(queryInput, resultContainer));
    queryInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleQuery(queryInput, resultContainer);
    });

    // 支持输入框获取焦点时按ESC清空内容
    queryInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            queryInput.value = "";
        }
    });

    // 全局点击事件委托（确保动态生成的元素能被点击）
    document.body.addEventListener('click', (e) => {
        // 处理建议列表点击
        const li = e.target.closest('.suggestions li[data-plant]');
        if (li) {
            const input = document.getElementById('queryInput');
            const container = document.getElementById('resultContainer');
            input.value = li.dataset.plant; 
            handleQuery(input, container); 
        }
        
        // 处理药材标签点击
        const herbTag = e.target.closest('.herb-tag');
        if (herbTag && herbTag.textContent) {
            const input = document.getElementById('queryInput');
            const container = document.getElementById('resultContainer');
            input.value = herbTag.textContent; 
            handleQuery(input, container); 
        }
    });
});

/**
 * 加载药材数据
 */
function loadHerbsData() {
    document.getElementById('resultContainer').innerHTML = `
        <div class="loading flex flex-col items-center justify-center py-12">
            <div class="spinner w-10 h-10 rounded-full border-4 border-gray-200"></div>
            <p class="mt-4 text-gray-500">加载药材数据中...</p>
        </div>
    `;
    // 实际项目中替换为真实数据接口
    fetch("data/herbs.json") 
        .then(response => {
            if (!response.ok) {
                throw new Error(`数据加载失败: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            herbsData = data;
            // 数据加载完成后清空加载状态
            if (document.querySelector('#resultContainer .loading')) {
                document.getElementById('resultContainer').innerHTML = `
                    <div class="flex flex-col items-center justify-center h-64 text-gray-500">
                        <i class="fa fa-search-plus text-4xl mb-4 opacity-30"></i>
                        <p>请输入查询内容并点击查询按钮</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            document.getElementById("resultContainer").innerHTML = `
                <div class="error bg-red-50 border border-red-200 rounded-lg p-6">
                    <div class="flex items-start">
                        <i class="fa fa-exclamation-circle text-red-500 mt-1 mr-3"></i>
                        <div>
                            <h3 class="font-medium text-red-800">数据加载失败</h3>
                            <p class="mt-1 text-red-700">请检查数据文件路径是否正确</p>
                            <p class="mt-2 text-sm text-red-600">错误信息: ${error.message}</p>
                        </div>
                    </div>
                `;
        });
}

/**
 * 核心查询处理函数
 */
function handleQuery(input, container) {
    const question = input.value.trim();

    if (!question) {
        alert("请输入查询内容（例如：羌活的藏族名称、头晕在藏族中如何治疗）");
        input.focus();
        return;
    }
    
    if (herbsData.length === 0) {
        container.innerHTML = `
            <div class="error bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div class="flex items-start">
                    <i class="fa fa-info-circle text-yellow-500 mt-1 mr-3"></i>
                    <div>
                        <h3 class="font-medium text-yellow-800">数据尚未加载完成</h3>
                        <p class="mt-1 text-yellow-700">请稍候重试或刷新页面</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="loading flex flex-col items-center justify-center py-12">
            <div class="spinner w-10 h-10 rounded-full border-4 border-gray-200"></div>
            <p class="mt-4 text-gray-500">查询中，请稍候...</p>
        </div>
    `;

    // 执行查询逻辑
    const parsedResult = parseQuery(question); 
    renderResult(parsedResult, container);
}

/**
 * 解析自然语言查询（强化民族-症状匹配、多关键词识别）
 */
function parseQuery(question) {
    let processedQuestion = question.trim();
    let plantName = "";
    let queryField = "";
    let symptoms = [];
    let targetEthnic = "";

    // 1. 识别“民族如何治疗症状”的正向和反向句式
    const ethnicPatterns = [
        /(藏族|藏医|羌族|羌医|彝族|彝医).*?(如何治疗|怎么治疗|如何缓解|怎么缓解|治疗|缓解)(.+)/i,
        /(.+?)在(藏族|藏医|羌族|羌医|彝族|彝医).*?(如何治疗|怎么治疗|如何缓解|怎么缓解|治疗|缓解)/i,
        /(如何治疗|怎么治疗|如何缓解|怎么缓解|治疗|缓解)(.+?)的(藏族|藏医|羌族|羌医|彝族|彝医)方法/i
    ];
    
    for (const pattern of ethnicPatterns) {
        const ethnicSymptomMatch = processedQuestion.match(pattern);
        if (ethnicSymptomMatch && ethnicSymptomMatch.length >= 4) {
            // 确定民族和症状
            if (ethnicSymptomMatch[2] in SYMPTOM_ETHNIC_MAPPING) {
                targetEthnic = ethnicSymptomMatch[2];
                symptoms = [extractSymptom(ethnicSymptomMatch[3] || ethnicSymptomMatch[1])];
            } else if (ethnicSymptomMatch[3] in SYMPTOM_ETHNIC_MAPPING) {
                targetEthnic = ethnicSymptomMatch[3];
                symptoms = [extractSymptom(ethnicSymptomMatch[1] || ethnicSymptomMatch[2])];
            }
            
            if (targetEthnic && symptoms.length > 0) {
                const field = SYMPTOM_ETHNIC_MAPPING[targetEthnic];
                return {
                    intent: "ethnic_symptom_query",
                    params: { 
                        ethnic: targetEthnic,
                        symptom: symptoms[0],
                        field: field 
                    },
                    data: herbsData
                };
            }
        }
    }

    // 2. 识别“植物名的XX”句式
    for (const field in FIELD_MAPPING) {
        const keywords = Array.isArray(FIELD_MAPPING[field]) ? FIELD_MAPPING[field] : [FIELD_MAPPING[field]];
        const pattern = new RegExp(`(.+?)的(${keywords.join("|")})`, 'i');
        const match = processedQuestion.match(pattern);
        
        if (match && match.length === 3) {
            plantName = match[1].trim();
            queryField = field;
            return {
                intent: "plant_detail_field", 
                params: { plant: plantName, field: queryField },
                data: herbsData
            };
        }
    }

    // 3. 处理多药材对比（增强版逻辑）
    const comparisonTriggers = ["与", "和", "vs", "对比"];
    const comparisonSuffixes = ["的区别", "的异同", "的共同点", "的不同点", "的相同点"];
    
    // 先移除句尾的干扰后缀
    let cleanedQuestion = processedQuestion;
    comparisonSuffixes.forEach(suffix => {
        if (cleanedQuestion.endsWith(suffix)) {
            cleanedQuestion = cleanedQuestion.slice(0, -suffix.length).trim();
        }
    });

    const hasComparison = comparisonTriggers.some(kw => cleanedQuestion.includes(kw));
    
    if (hasComparison) {
        // 使用更可靠的分割逻辑
        let plants = [];
        // 尝试多种分割方式
        comparisonTriggers.forEach(trigger => {
            if (cleanedQuestion.includes(trigger)) {
                plants = cleanedQuestion.split(new RegExp(trigger, 'i'))
                    .map(p => p.trim().replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ''))
                    .filter(p => p.length > 0);
            }
        });

        // 如果分割结果不足2个，尝试更激进的分割
        if (plants.length < 2) {
            // 按常见标点分割
            plants = cleanedQuestion.split(/[、,，;；]/)
                .map(p => p.trim().replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ''))
                .filter(p => p.length > 0);
        }

        // 验证分割结果
        if (plants.length >= 2) {
            // 恢复原始问题判断意图
            if (processedQuestion.includes("异同")) {
                return {
                    intent: "similarity_and_difference",
                    params: { plants: plants },
                    data: herbsData
                };
            } else if (processedQuestion.includes("共同点") || 
                      processedQuestion.includes("相同点")) {
                return {
                    intent: "common",
                    params: { plants: plants },
                    data: herbsData
                };
            } else {
                return {
                    intent: "compare",
                    params: { plants: plants },
                    data: herbsData
                };
            }
        }
    }

    // 4. 处理纯症状查询
    if (["治疗", "治", "缓解", "推荐", "如何"].some(kw => processedQuestion.includes(kw))) {
        symptoms = [extractSymptom(processedQuestion)];
        return {
            intent: "function_query",
            params: { 
                symptoms: symptoms,
                logic: "or",
                specified_ethnic: []
            },
            data: herbsData
        };
    }

    // 5. 兜底：单药材详情查询
    plantName = processedQuestion;
    return {
        intent: "plant_details",
        params: { plant: plantName, fields: "all" },
        data: herbsData
    };
}

/**
 * 提取症状（支持双向句式和同义词匹配）
 */
function extractSymptom(question) {
    // 1. 优先匹配完整症状
    for (const symptom in SYMPTOM_SYNONYMS) {
        if (SYMPTOM_SYNONYMS[symptom].some(syn => question.includes(syn))) {
            return symptom;
        }
    }

    // 2. 拆分复合症状
    const symptoms = question.match(/(腰痛|腰酸|背痛|关节痛|头痛|发热|咳嗽|胃痛)/g) || [];
    if (symptoms.length > 0) {
        return symptoms.join("、");
    }

    // 3. 处理反向语序（病症+缓解）
    const reversePattern = /(.+?)(如何缓解|怎么缓解|如何治疗|怎么治疗|如何治|怎么治)/;
    const reverseMatch = question.match(reversePattern);
    if (reverseMatch && reverseMatch[1]) {
        return reverseMatch[1].trim();
    }

    // 4. 处理正向语序（缓解+病症）
    const forwardPattern = /(如何缓解|怎么缓解|如何治疗|怎么治疗|如何治|怎么治)(.+?)/;
    const forwardMatch = question.match(forwardPattern);
    if (forwardMatch && forwardMatch[2]) {
        return forwardMatch[2].trim();
    }

    // 5. 终极兜底
    return question.trim();
}

/**
 * 渲染不同意图的结果
 */
function renderResult(result, container) {
    container.innerHTML = "";

    if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
        container.innerHTML = `
            <div class="error bg-red-50 border border-red-200 rounded-lg p-6">
                <div class="flex items-start">
                    <i class="fa fa-exclamation-circle text-red-500 mt-1 mr-3"></i>
                    <div>
                        <h3 class="font-medium text-red-800">查询失败</h3>
                        <p class="mt-1 text-red-700">数据为空或格式异常</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    switch (result.intent) {
        case "plant_details":
            renderPlantDetails(result.params, result.data, container);
            break;
        case "plant_detail_field":
            renderPlantDetailField(result.params, result.data, container);
            break;
        case "compare":
            renderComparison(result.params, result.data, container);
            break;
        case "common":
            renderCommonFeatures(result.params, result.data, container);
            break;
        case "similarity_and_difference":
            renderSimilaritiesAndDifferences(result.params, result.data, container);
            break;
        case "function_query":
            renderFunctionQuery(result.params, result.data, container);
            break;
        case "ethnic_symptom_query":
            renderEthnicSymptomQuery(result.params, result.data, container);
            break;
        default:
            container.innerHTML = `
                <div class="error bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div class="flex items-start">
                        <i class="fa fa-info-circle text-yellow-500 mt-1 mr-3"></i>
                        <div>
                            <h3 class="font-medium text-yellow-800">无法识别的查询</h3>
                            <p class="mt-1 text-yellow-700">请尝试：药材名、药材 vs 药材、症状</p>
                        </div>
                    </div>
                </div>
            `;
    }
}

/**
 * 渲染单药材详情
 */
function renderPlantDetails(params, data, container) {
    const { plant, fields } = params;
    
    // 过滤逻辑
    const exactMatches = data.filter(item => 
        item && typeof item === "object" && "植物名" in item && 
        item["植物名"].toLowerCase() === plant.toLowerCase()
    );
    const matches = exactMatches.length > 0 
        ? exactMatches 
        : data.filter(item => 
            item && typeof item === "object" && "植物名" in item && 
            item["植物名"].toLowerCase().includes(plant.toLowerCase())
        );

    if (matches.length === 0) {
        container.innerHTML = `
            <div class="error bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div class="flex items-start">
                    <i class="fa fa-search text-yellow-500 mt-1 mr-3"></i>
                    <div>
                        <h3 class="font-medium text-yellow-800">未找到药材</h3>
                        <p class="mt-1 text-yellow-700">未找到名称为 "${plant}" 的药材，请检查名称是否正确</p>
                    </div>
                </div>
            </div>
        `;
        return;
    } else if (matches.length > 1) {
        let html = `<div class="card bg-white rounded-xl p-6 card-shadow">
            <h2 class="text-xl font-semibold mb-4">找到 ${matches.length} 个匹配结果</h2>
            <p class="text-gray-600 mb-3">请选择具体药材：</p>
            <ul class="suggestions grid grid-cols-1 md:grid-cols-2 gap-2">`;
        
        matches.forEach(match => {
            html += `<li data-plant="${match["植物名"]}" class="p-3 border border-gray-200 rounded-lg hover:bg-primary/5 hover:border-primary/30 cursor-pointer transition-colors">
                ${match["植物名"]} ${match["拉丁名"] ? `（${match["拉丁名"]}）` : ''}
            </li>`;
        });
        
        html += `</ul></div>`;
        container.innerHTML = html;
        return;
    }

    const plantData = matches[0];
    
    // 定义完整的字段展示顺序（分三组）
    const fieldGroups = [
        {
            title: "基础信息",
            fields: [
                { key: "植物名", title: "植物名" },
                { key: "拉丁名", title: "拉丁名" },
                { key: "类", title: "类" },
                { key: "形态", title: "形态" },
                { key: "科", title: "科" },
                { key: "海拔（最低）", title: "最低海拔" },
                { key: "海拔（最高）", title: "最高海拔" },
                { key: "海拔", title: "海拔范围" },
                { key: "分布", title: "分布区域" }
            ]
        },
        {
            title: "民族名称",
            fields: [
                { key: "药物名（羌）", title: "羌族名称" },
                { key: "药物名（彝）", title: "彝族名称" },
                { key: "药物名（藏）", title: "藏族名称" }
            ]
        },
        {
            title: "民族医药功能",
            fields: [
                { key: "功能主治", title: "羌族功能主治" },
                { key: "功能主治.1", title: "彝族功能主治" },
                { key: "功能主治.2", title: "藏族功能主治" }
            ]
        }
    ];

    let html = `<div class="card bg-white rounded-xl p-6 card-shadow">
        <h2 class="text-2xl font-bold mb-6">${plantData["植物名"]} 详情</h2>
        <div class="details space-y-6">`;

    // 按分组渲染所有字段
    fieldGroups.forEach(group => {
        html += `<div class="section">
            <h3 class="text-lg font-semibold mb-3 pb-1 border-b border-gray-200">${group.title}</h3>
            <div class="detail-list grid grid-cols-1 md:grid-cols-2 gap-3">`;
        group.fields.forEach(({ key, title }) => {
            const value = plantData[key] || "无记录";
            html += `<div class="detail-item p-3 bg-gray-50 rounded-lg">
                <strong class="text-gray-700">${title}：</strong>
                <span class="text-gray-600">${value}</span>
            </div>`;
        });
        html += `</div></div>`;
    });

    html += `</div></div>`;
    container.innerHTML = html;
}

/**
 * 渲染药材指定字段详情
 */
function renderPlantDetailField(params, data, container) {
    const { plant, field } = params;
    const plantData = data.find(item => 
        item && typeof item === "object" && "植物名" in item &&
        item["植物名"].toLowerCase() === plant.toLowerCase()
    );

    if (!plantData) {
        container.innerHTML = `
            <div class="error bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div class="flex items-start">
                    <i class="fa fa-search text-yellow-500 mt-1 mr-3"></i>
                    <div>
                        <h3 class="font-medium text-yellow-800">未找到药材</h3>
                        <p class="mt-1 text-yellow-700">未找到名称为 "${plant}" 的药材，请检查名称是否正确</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    // 获取显示名称
    const displayName = Array.isArray(FIELD_MAPPING[field]) ? FIELD_MAPPING[field][0] : FIELD_MAPPING[field];
    const value = plantData[field] || "无记录";
    
    container.innerHTML = `
        <div class="card bg-white rounded-xl p-6 card-shadow">
            <h2 class="text-xl font-bold mb-4">${plant} 的 ${displayName}</h2>
            <div class="details p-4 bg-gray-50 rounded-lg">
                <p class="text-lg"><strong>${displayName}：</strong>${value}</p>
                <div class="mt-4 text-sm text-gray-500">
                    <p>提示：可输入药材全名查看完整信息</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染植物对比结果（支持2+药材）
 */
function renderComparison(params, data, container) {
    const { plants } = params;
    
    // 增强版药材匹配
    const targetPlants = plants.map(name => {
        const lowerCaseName = name.toLowerCase();
        // 1. 精确匹配
        let match = data.find(item => 
            item && typeof item === "object" && "植物名" in item && 
            item["植物名"].toLowerCase() === lowerCaseName
        );
        
        // 2. 关键词匹配（如果精确匹配失败）
        if (!match) {
            match = data.find(item => 
                item && typeof item === "object" && "植物名" in item && 
                item["植物名"].toLowerCase().includes(lowerCaseName)
            );
        }
        
        // 3. 反向匹配（检查药材名是否包含查询词）
        if (!match) {
            match = data.find(item => 
                item && typeof item === "object" && "植物名" in item && 
                lowerCaseName.includes(item["植物名"].toLowerCase())
            );
        }
        
        return match || null;
    }).filter(p => p);  // 过滤空值

    // 显示未识别的药材
    const unrecognizedPlants = plants.filter(plant => {
        const lowerCasePlant = plant.toLowerCase();
        return !targetPlants.some(p => p["植物名"].toLowerCase().includes(lowerCasePlant));
    });

    if (targetPlants.length < 2) {
        container.innerHTML = `
            <div class="error bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div class="flex items-start">
                    <i class="fa fa-exclamation-triangle text-yellow-500 mt-1 mr-3"></i>
                    <div>
                        <h3 class="font-medium text-yellow-800">对比失败</h3>
                        <p class="mt-1 text-yellow-700">至少需要 2 种有效药材进行对比</p>
                        <p class="mt-2 text-yellow-700">已找到：${targetPlants.map(p => `<span class="herb-tag">${p["植物名"]}</span>`).join("、") || "无有效药材"}</p>
                        ${unrecognizedPlants.length > 0 ? 
                            `<p class="mt-1 text-yellow-700">未识别：${unrecognizedPlants.map(p => `<span class="text-red-500">${p}</span>`).join("、")}</p>` : ""}
                    </div>
                </div>
            </div>
        `;
        return;
    }

    // 定义对比字段（包含民族信息和基础信息）
    const compareFields = [
        "类", "科", "形态", "海拔（最低）", "海拔（最高）", "海拔", "分布",
        "药物名（羌）", "功能主治",
        "药物名（彝）", "功能主治.1",
        "药物名（藏）", "功能主治.2",
        "拉丁名"
    ];

    // 提取差异字段
    const diffFields = {};
    compareFields.forEach(key => {
        const values = targetPlants.map(p => p[key] || "无记录");
        if (values.some((val, i) => val !== values[0])) { // 存在差异
            diffFields[key] = targetPlants.reduce((acc, plant, i) => {
                acc[plant["植物名"]] = values[i];
                return acc;
            }, {});
        }
    });

    let html = `<div class="card bg-white rounded-xl p-6 card-shadow">
        <h2 class="text-xl font-bold mb-6">${targetPlants.map(p => `<span class="herb-tag">${p["植物名"]}</span>`).join(" 与 ")} 的区别对比</h2>
    `;
    
    if (unrecognizedPlants.length > 0) {
        html += `<div class="bg-yellow-50 p-3 rounded-lg mb-4 text-sm">
            <i class="fa fa-info-circle text-yellow-500 mr-1"></i>
            <span>未识别的药材：${unrecognizedPlants.join("、")}</span>
        </div>`;
    }
    
    if (Object.keys(diffFields).length === 0) {
        html += `<div class="no-result p-6 bg-gray-50 rounded-lg text-center">
            <i class="fa fa-info-circle text-gray-400 text-2xl mb-3"></i>
            <p class="text-gray-600">未发现明显区别</p>
        </div>`;
    } else {
        html += `<div class="comparison-grid grid grid-cols-1 md:grid-cols-2 gap-4">`;
        Object.entries(diffFields).forEach(([field, values]) => {
            const displayKey = Array.isArray(FIELD_MAPPING[field]) ? FIELD_MAPPING[field][0] : FIELD_MAPPING[field];
            html += `<div class="comparison-item p-4 bg-gray-50 rounded-lg">
                <h3 class="font-medium text-gray-800 mb-2">${displayKey}</h3>
                <div class="comparison-values space-y-2">`;
            Object.entries(values).forEach(([plant, value]) => {
                html += `<p><strong>${plant}：</strong>${value}</p>`;
            });
            html += `</div></div>`;
        });
        html += `</div>`;
    }
    
    html += `</div>`;
    container.innerHTML = html;
}

/**
 * 渲染植物共同点（支持2+药材）
 */
function renderCommonFeatures(params, data, container) {
    const { plants } = params;
    
    // 增强版药材匹配
    const targetPlants = plants.map(name => {
        const lowerCaseName = name.toLowerCase();
        // 1. 精确匹配
        let match = data.find(item => 
            item && typeof item === "object" && "植物名" in item && 
            item["植物名"].toLowerCase() === lowerCaseName
        );
        
        // 2. 关键词匹配（如果精确匹配失败）
        if (!match) {
            match = data.find(item => 
                item && typeof item === "object" && "植物名" in item && 
                item["植物名"].toLowerCase().includes(lowerCaseName)
            );
        }
        
        // 3. 反向匹配（检查药材名是否包含查询词）
        if (!match) {
            match = data.find(item => 
                item && typeof item === "object" && "植物名" in item && 
                lowerCaseName.includes(item["植物名"].toLowerCase())
            );
        }
        
        return match || null;
    }).filter(p => p);  // 过滤空值

    // 显示未识别的药材
    const unrecognizedPlants = plants.filter(plant => {
        const lowerCasePlant = plant.toLowerCase();
        return !targetPlants.some(p => p["植物名"].toLowerCase().includes(lowerCasePlant));
    });

    if (targetPlants.length < 2) {
        container.innerHTML = `
            <div class="error bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div class="flex items-start">
                    <i class="fa fa-exclamation-triangle text-yellow-500 mt-1 mr-3"></i>
                    <div>
                        <h3 class="font-medium text-yellow-800">查询失败</h3>
                        <p class="mt-1 text-yellow-700">至少需要 2 种有效药材查询共同点</p>
                        <p class="mt-2 text-yellow-700">已找到：${targetPlants.map(p => `<span class="herb-tag">${p["植物名"]}</span>`).join("、") || "无有效药材"}</p>
                        ${unrecognizedPlants.length > 0 ? 
                            `<p class="mt-1 text-yellow-700">未识别：${unrecognizedPlants.map(p => `<span class="text-red-500">${p}</span>`).join("、")}</p>` : ""}
                    </div>
                </div>
            </div>
        `;
        return;
    }

    // 提取共同字段
    const commonFields = {};
    const baseKeys = Object.keys(targetPlants[0]);
    
    baseKeys.forEach(key => {
        if (key === "序号" || key === "serial_number") return; // 排除序号
        
        const values = targetPlants.map(p => p[key] || "无记录");
        if (values.every(v => v === values[0])) {
            commonFields[key] = values[0];
        }
    });

    let html = `<div class="card bg-white rounded-xl p-6 card-shadow">
        <h2 class="text-xl font-bold mb-6">${targetPlants.map(p => `<span class="herb-tag">${p["植物名"]}</span>`).join(" 与 ")} 的共同点</h2>
    `;
    
    if (unrecognizedPlants.length > 0) {
        html += `<div class="bg-yellow-50 p-3 rounded-lg mb-4 text-sm">
            <i class="fa fa-info-circle text-yellow-500 mr-1"></i>
            <span>未识别的药材：${unrecognizedPlants.join("、")}</span>
        </div>`;
    }
    
    if (Object.keys(commonFields).length === 0) {
        html += `<div class="no-result p-6 bg-gray-50 rounded-lg text-center">
            <i class="fa fa-info-circle text-gray-400 text-2xl mb-3"></i>
            <p class="text-gray-600">未发现明显共同点</p>
        </div>`;
    } else {
        html += `<ul class="common-list grid grid-cols-1 md:grid-cols-2 gap-3">`;
        Object.entries(commonFields).forEach(([field, value]) => {
            const displayKey = Array.isArray(FIELD_MAPPING[field]) ? FIELD_MAPPING[field][0] : FIELD_MAPPING[field];
            html += `<li class="p-3 bg-gray-50 rounded-lg">
                <strong class="text-gray-700">${displayKey}：</strong>
                <span class="text-gray-600">${value}</span>
            </li>`;
        });
        html += `</ul>`;
    }
    
    html += `</div>`;
    container.innerHTML = html;
}

/**
 * 渲染异同分析结果（支持2+药材）
 */
function renderSimilaritiesAndDifferences(params, data, container) {
    const { plants } = params;
    
    // 增强版药材匹配
    const targetPlants = plants.map(name => {
        const lowerCaseName = name.toLowerCase();
        // 1. 精确匹配
        let match = data.find(item => 
            item && typeof item === "object" && "植物名" in item && 
            item["植物名"].toLowerCase() === lowerCaseName
        );
        
        // 2. 关键词匹配（如果精确匹配失败）
        if (!match) {
            match = data.find(item => 
                item && typeof item === "object" && "植物名" in item && 
                item["植物名"].toLowerCase().includes(lowerCaseName)
            );
        }
        
        // 3. 反向匹配（检查药材名是否包含查询词）
        if (!match) {
            match = data.find(item => 
                item && typeof item === "object" && "植物名" in item && 
                lowerCaseName.includes(item["植物名"].toLowerCase())
            );
        }
        
        return match || null;
    }).filter(p => p);  // 过滤空值

    // 显示未识别的药材
    const unrecognizedPlants = plants.filter(plant => {
        const lowerCasePlant = plant.toLowerCase();
        return !targetPlants.some(p => p["植物名"].toLowerCase().includes(lowerCasePlant));
    });

    if (targetPlants.length < 2) {
        container.innerHTML = `
            <div class="error bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div class="flex items-start">
                    <i class="fa fa-exclamation-triangle text-yellow-500 mt-1 mr-3"></i>
                    <div>
                        <h3 class="font-medium text-yellow-800">分析失败</h3>
                        <p class="mt-1 text-yellow-700">至少需要 2 种有效药材分析异同</p>
                        <p class="mt-2 text-yellow-700">已找到：${targetPlants.map(p => `<span class="herb-tag">${p["植物名"]}</span>`).join("、") || "无有效药材"}</p>
                        ${unrecognizedPlants.length > 0 ? 
                            `<p class="mt-1 text-yellow-700">未识别：${unrecognizedPlants.map(p => `<span class="text-red-500">${p}</span>`).join("、")}</p>` : ""}
                    </div>
                </div>
            </div>
        `;
        return;
    }

    // 定义分析字段
    const analyzeFields = [
        "类", "科", "形态", "海拔（最低）", "海拔（最高）", "海拔", "分布",
        "药物名（羌）", "功能主治",
        "药物名（彝）", "功能主治.1",
        "药物名（藏）", "功能主治.2",
        "拉丁名"
    ];

    // 提取共同字段 & 差异字段
    const commonFields = {};
    const diffFields = {};
    
    analyzeFields.forEach(key => {
        const values = targetPlants.map(p => p[key] || "无记录");
        if (values.every(v => v === values[0])) {
            commonFields[key] = values[0];
        } else {
            diffFields[key] = targetPlants.reduce((acc, plant, i) => {
                acc[plant["植物名"]] = values[i];
                return acc;
            }, {});
        }
    });

    let html = `<div class="card bg-white rounded-xl p-6 card-shadow">
        <h2 class="text-xl font-bold mb-6">${targetPlants.map(p => `<span class="herb-tag">${p["植物名"]}</span>`).join(" 与 ")} 的异同分析</h2>
    `;
    
    if (unrecognizedPlants.length > 0) {
        html += `<div class="bg-yellow-50 p-3 rounded-lg mb-4 text-sm">
            <i class="fa fa-info-circle text-yellow-500 mr-1"></i>
            <span>未识别的药材：${unrecognizedPlants.join("、")}</span>
        </div>`;
    }
    
    html += `<div class="similarity-section section mb-6">
            <h3 class="text-lg font-semibold mb-3 pb-1 border-b border-gray-200">共同点</h3>
    `;
    
    if (Object.keys(commonFields).length === 0) {
        html += `<div class="no-result p-4 bg-gray-50 rounded-lg text-center">
            <p class="text-gray-600">未发现明显共同点</p>
        </div>`;
    } else {
        html += `<ul class="common-list grid grid-cols-1 md:grid-cols-2 gap-2">`;
        Object.entries(commonFields).forEach(([field, value]) => {
            const displayKey = Array.isArray(FIELD_MAPPING[field]) ? FIELD_MAPPING[field][0] : FIELD_MAPPING[field];
            html += `<li class="p-2 bg-gray-50 rounded-lg">
                <strong class="text-gray-700">${displayKey}：</strong>
                <span class="text-gray-600">${value}</span>
            </li>`;
        });
        html += `</ul>`;
    }
    
    html += `</div><div class="difference-section section"><h3 class="text-lg font-semibold mb-3 pb-1 border-b border-gray-200">区别</h3>`;
    
    if (Object.keys(diffFields).length === 0) {
        html += `<div class="no-result p-4 bg-gray-50 rounded-lg text-center">
            <p class="text-gray-600">未发现明显区别</p>
        </div>`;
    } else {
        html += `<div class="comparison-grid grid grid-cols-1 md:grid-cols-2 gap-3">`;
        Object.entries(diffFields).forEach(([field, values]) => {
            const displayKey = Array.isArray(FIELD_MAPPING[field]) ? FIELD_MAPPING[field][0] : FIELD_MAPPING[field];
            html += `<div class="comparison-item p-3 bg-gray-50 rounded-lg">
                <h4 class="font-medium text-gray-800">${displayKey}</h4>
                <div class="comparison-values space-y-1 mt-1 text-sm">`;
            Object.entries(values).forEach(([plant, value]) => {
                html += `<p><strong>${plant}：</strong>${value}</p>`;
            });
            html += `</div></div>`;
        });
        html += `</div>`;
    }
    
    html += `</div></div>`;
    container.innerHTML = html;
}

/**
 * 渲染功效查询结果（修复药材名称分隔问题）
 */
function renderFunctionQuery(params, data, container) {
    const { symptoms, logic, specified_ethnic } = params;
    
    if (!symptoms || symptoms.length === 0) {
        container.innerHTML = `
            <div class="error bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div class="flex items-start">
                    <i class="fa fa-exclamation-triangle text-yellow-500 mt-1 mr-3"></i>
                    <div>
                        <h3 class="font-medium text-yellow-800">查询失败</h3>
                        <p class="mt-1 text-yellow-700">未识别到症状，请重新输入</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    const matched = {
        羌族: [],
        彝族: [],
        藏族: []
    };

    // 扩展匹配的症状（包含所有同义词）
    const allRelatedSymptoms = symptoms.flatMap(sym => SYMPTOM_SYNONYMS[sym] || [sym]);
    const symptomPattern = new RegExp(allRelatedSymptoms.join("|"), "i");

    data.forEach(plant => {
        if (plant && typeof plant === "object") {
            // 羌族功效匹配
            if ("功能主治" in plant && typeof plant["功能主治"] === "string" && symptomPattern.test(plant["功能主治"])) {
                matched.羌族.push(plant["植物名"]);
            }
            // 彝族功效匹配
            if ("功能主治.1" in plant && typeof plant["功能主治.1"] === "string" && symptomPattern.test(plant["功能主治.1"])) {
                matched.彝族.push(plant["植物名"]);
            }
            // 藏族功效匹配
            if ("功能主治.2" in plant && typeof plant["功能主治.2"] === "string" && symptomPattern.test(plant["功能主治.2"])) {
                matched.藏族.push(plant["植物名"]);
            }
        }
    });

    // 确保每个民族的药材列表是唯一的，避免重复
    Object.keys(matched).forEach(ethnic => {
        matched[ethnic] = [...new Set(matched[ethnic])];
    });

     const ethnicHTML = Object.entries(matched).map(([ethnic, plants]) => `
        <div class="ethnic-section p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold text-gray-800 mb-2">${ethnic}医药推荐</h3>
            <div class="plant-list">
                ${plants.length > 0 
                    ? plants.join('、')  // 直接用顿号连接药材名称
                    : '<p class="text-gray-500">无推荐药材</p>'
                }
            </div>
        </div>
    `).join("");

    container.innerHTML = `
        <div class="card bg-white rounded-xl p-6 card-shadow">
            <h2 class="text-xl font-bold mb-6">针对“${symptoms.join("、")}”的药材推荐</h2>
            <div class="details grid grid-cols-1 md:grid-cols-3 gap-4">${ethnicHTML}</div>
            <div class="mt-6 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                <i class="fa fa-lightbulb-o mr-2"></i>
                <p>提示：点击药材名称可查看详细信息</p>
            </div>
        </div>
    `;
}

/**
 * 渲染特定民族的病症查询结果（修复药材名称分隔问题）
 */
function renderEthnicSymptomQuery(params, data, container) {
    const { ethnic, symptom, field } = params;
    
    if (!ethnic || !symptom || !field) {
        container.innerHTML = `
            <div class="error bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div class="flex items-start">
                    <i class="fa fa-exclamation-triangle text-yellow-500 mt-1 mr-3"></i>
                    <div>
                        <h3 class="font-medium text-yellow-800">查询失败</h3>
                        <p class="mt-1 text-yellow-700">未能正确识别民族或症状，请重新输入</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    // 扩展匹配的症状（包含所有同义词）
    const allRelatedSymptoms = SYMPTOM_SYNONYMS[symptom] || [symptom];
    const symptomPattern = new RegExp(allRelatedSymptoms.join("|"), "i");

    // 只匹配特定民族的药材
    const matchedPlants = data.filter(plant => {
        return plant && typeof plant === "object" && 
               field in plant && typeof plant[field] === "string" && 
               symptomPattern.test(plant[field]);
    }).map(plant => plant["植物名"]);

    // 去重处理
    const uniquePlants = [...new Set(matchedPlants)];

    // 获取民族对应的名称（如"藏医"显示为"藏族医药"）
    const ethnicDisplayName = ethnic.includes("医") ? 
        ethnic.replace("医", "族医药") : 
        `${ethnic}医药`;

    container.innerHTML = `
        <div class="card bg-white rounded-xl p-6 card-shadow">
            <h2 class="text-xl font-bold mb-6">${ethnicDisplayName}中治疗“${symptom}”的推荐药材</h2>
            <div class="details p-4 bg-gray-50 rounded-lg">
                ${uniquePlants.length > 0 
                    ? `<div class="plant-list">
                        ${uniquePlants.join('、')}  // 直接用顿号连接药材名称
                      </div>`
                    : `<p class="text-gray-600">未找到${ethnicDisplayName}中治疗“${symptom}”的药材</p>`
                }
            </div>
            <div class="mt-6 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                <i class="fa fa-lightbulb-o mr-2"></i>
                <p>提示：点击药材名称可查看详细信息</p>
            </div>
        </div>
    `;
}

// 暴露全局函数用于点击建议列表
window.handleQuery = handleQuery;
    